const { db } = require('./db');

let register = (server, options, next) => {
  server.decorate("request", "systemDb", db);
}

register = {
  name: "customRequest",
  version: "1.0.0",
  register: register
}

module.exports = register;