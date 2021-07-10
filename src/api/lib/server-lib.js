const register = {
  name: "private-route",
  version: "1.0.0",
  register: async function (server, options) {
    function privateRoute(options) {
      this.route(options);
    }

    server.decorate("server", "privateRoute", privateRoute);
  }
}

module.exports = register;