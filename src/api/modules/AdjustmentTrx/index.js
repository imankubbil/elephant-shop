const AdjustmentHandlers = require('./AdjustmentHandlers');

const register = {
  name: "adjustments-handler",
  version: "1.0.0",
  register: async function (server, options) {
    server.privateRoute([
      {
        path: '/adjustments',
        method: 'GET',
        handler: AdjustmentHandlers.getAdjustments,
      },
      {
        path: '/adjustment/{id}',
        method: 'GET',
        handler: AdjustmentHandlers.getDetailAdjustment,
      },
      {
        path: '/adjustment/save',
        method: 'POST',
        handler: AdjustmentHandlers.saveAdjustment
      },
      {
        path: '/adjustment/update/{id}',
        method: 'POST',
        handler: AdjustmentHandlers.updateAdjustment
      },
      {
        path: '/adjustment/delete/{id}',
        method: 'DELETE',
        handler: AdjustmentHandlers.deleteAdjustment
      },
    ])
  }
};

module.exports = register;