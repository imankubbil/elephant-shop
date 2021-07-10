const axios = require('axios');
const xml2js = require('xml2js');
const { db, Helpers } = require('./db');

class eleveniaService {

  request(url, option) {
    return new Promise((resolve, reject) => {
      const domain = `http://api.elevenia.co.id`;
      const header = {
        headers: {
          openapikey: process.env.API_KEY
        }
      };

      axios
        .get(`${domain}/${url}${option}`, header)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  getProducts(pages) {
    return new Promise(async (resolve, reject) => {
      await this.request('rest/prodservices/product/listing/', `?page=${pages}`)
        .then((res) => resolve(res))
        .catch((err) =>reject(err));
    });
  }

  getProductDetails(prdNo) {
    return new Promise(async (resolve, reject) => {
      await this.request('rest/prodservices/product/details/', prdNo)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  
  convertJson(file) {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({ explicitArray: false });
  
      parser.parseString(file, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  async responseProducts(pages) {
    const response = await this.getProducts(pages);
    const resultConvert = await this.convertJson(response.data);
    const products = resultConvert.Products.product;

    const parseData = await Promise.all(

      products.map(async(dt) => {
        const resProductDetails = await this.getProductDetails(dt.prdNo);
        const convertProductDetils = await this.convertJson(resProductDetails.data);
        const productDetails = convertProductDetils.Product;
  
        const product = {
          name: dt.prdNm,
          sku: dt.prdNo,
          image: productDetails.prdImage01,
          price: parseInt(dt.selPrc),
          description: productDetails.htmlDetail,
        };

        const qty = productDetails.ProductOptionDetails.stckQty;
        if(qty != undefined) {
          const adjustmentTrx = {
            sku: dt.prdNo,
            qty: qty
          }

          await this.insertAdjustment(adjustmentTrx);
        }

        return product;
      })
    );

    await this.insertProduct(parseData);

    return parseData;
  }

  async insertProduct(data) {
    const queries = [];

    data.forEach(async (values) => {
      queries.push({
        query: `insert into products (name, sku, image, price, description) 
        values ($<name>, $<sku>,$<image>,$<price>,$<description>)`,
        values,
      });
    });

    const sql = Helpers.concat(queries);
    await db.none(sql);
  }

  async insertAdjustment(data) {
    await db.query(`insert into adjustment_transactions (sku, qty) values ($<sku>, $<qty>)`, data);
  }
}

module.exports = eleveniaService;