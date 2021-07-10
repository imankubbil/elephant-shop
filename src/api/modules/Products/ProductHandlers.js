const eleveniaService = require('../../lib/eleveniaService');
const serviceElevenia = new eleveniaService();

class ProductHandlers {

  async getProducts(req, h) {

    try{
      const db = req.systemDb;
      const page = req.query.page ? Number(req.query.page) : 1;
      const perPage = req.query.perPage ? Number(req.query.perPage) : 10;
      const offeset = page * perPage - perPage;

      await serviceElevenia.responseProducts(page);
      
      const query = `select p.name, p.sku, p.image, p.description, at.qty stock
        from products p inner join adjustment_transactions at on p.sku = at.sku
        limit '${perPage}' offset '${offeset}'`;

      const dataProducts = await db.query(query);
      const response = {
        status: "success",
        data: dataProducts
      };

      return h.response(response).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }

  async getDetailProduct(req, h) {
    try{
      const db     = req.systemDb;
      const sku = req.params.sku;

      const dataProduct =
        await db.query(`select p.name, p.sku, p.image, p.description, at.qty stock
          from products p inner join adjustment_transactions at on p.sku = at.sku where p.sku = $1`, [sku]);

      const response = {
        status: 'success',
        data: dataProduct
      };

      return h.response(response).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }

  async saveProduct(req, h) {
    try {
      const db = req.systemDb;
      const payload = req.payload;

      const insertData = 
        await
          db.query(`
            insert into products (name, sku, image, price, description)
            values ($<name>, $<sku>, $<image>, $<price>, $<description>) returning *`,
            payload)

      const data = {
        status: "success",
        data : insertData
      }

      return h.response(data).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }
  
  async updateProduct(req, h) {
    try {
      const db = req.systemDb;
      const payload = req.payload;
      const id = req.params.id
      const updateData =
        await 
          db.query(`
            update products set name = $1, sku = $2, image = $3, price = $4, description = $5 where id = $6 returning *`,
            [ payload.name,
              payload.sku,
              payload.image,
              payload.price,
              payload.description,
              id
            ]);

      const data = {
        status: "success",
        data: updateData
      }

      return h.response(data).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }

  async deleteProduct(req, h) {
    try {
      const db = req.systemDb;
      const id = req.params.id;

      const deleteProduct = 
        await db.query('delete from products where id = $1', [id]);
      
      const data = {
        status: "success",
      }
      return h.response(data).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }
}

module.exports = new ProductHandlers();