const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const plugins = require('./api/lib/plugin');
const modules = require('./api/modules');

dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.APP_PORT || 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      },
    },
  });

  await server.register(plugins);
  await server.register(modules);
  return server;
}

const serverStart = async () => {
  const server = await init();
  
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

serverStart();