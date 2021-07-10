class AdjustmentHandlers {

  async getAdjustments(req, h) {

    try{
      const db = req.systemDb;
      const page = req.query.page ? Number(req.query.page) : 1;
      const perPage = req.query.perPage ? Number(req.query.perPage) : 10;
      const offeset = page * perPage - perPage;

      const query = `select p.sku, at.qty, ( at.qty * p.price) amount
        from products p inner join adjustment_transactions at on p.sku = at.sku
        limit '${perPage}' offset '${offeset}'`;

      const dataAdjustment = await db.query(query);
      const response = {
        status: "success",
        data: dataAdjustment
      };

      return h.response(response).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }

  async getDetailAdjustment(req, h) {
    try{
      const db = req.systemDb;
      const id = req.params.id;

      const dataProduct =
        await db.query(`select at.sku, at.qty, (at.qty * p.price) amount
          from products p inner join adjustment_transactions at on p.sku = at.sku where at.id = $1`, [id]);

      const response = {
        status: 'success',
        data: dataProduct
      };

      return h.response(response).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }

  async saveAdjustment(req, h) {
    try {
      const db = req.systemDb;
      const payload = req.payload;

      const insertData = 
        await
          db.query(`
            insert into adjustment_transactions (sku, qty)
            values ($<sku>, $<qty>) returning *`,
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
  
  async updateAdjustment(req, h) {
    try {
      const db = req.systemDb;
      const payload = req.payload;
      const id = req.params.id
      const updateData =
        await 
          db.query(`
            update adjustment_transactions set sku = $1, qty = $2 where id = $3 returning *`,
            [ payload.sku,
              payload.qty,
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

  async deleteAdjustment(req, h) {
    try {
      const db = req.systemDb;
      const id = req.params.id;

      const deleteAdjustment = 
        await db.query('delete from adjustment_transactions where id = $1', [id]);
      
      const data = {
        status: "success",
      }
      return h.response(data).code(200);
    } catch (err) {
      return h.response({ message: err.message }).code(500);
    }
  }
}

module.exports = new AdjustmentHandlers();