const ProductHandlers = require('./ProductHandlers');

const register = {
  name: "products-handler",
  version: "1.0.0",
  register: async function (server, options) {
    server.privateRoute([
      {
        path: '/products',
        method: 'GET',
        handler: ProductHandlers.getProducts,
      },
      {
        path: '/product/{sku}',
        method: 'GET',
        handler: ProductHandlers.getDetailProduct,
      },
      {
        path: '/product/save',
        method: 'POST',
        handler: ProductHandlers.saveProduct
      },
      {
        path: '/product/update/{id}',
        method: 'POST',
        handler: ProductHandlers.updateProduct
      },
      {
        path: '/product/delete/{id}',
        method: 'DELETE',
        handler: ProductHandlers.deleteProduct
      },
    ])
  }
};

module.exports = register;