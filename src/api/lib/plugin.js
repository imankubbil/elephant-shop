const server = require('./server-lib');
const request = require('./request-lib');

const plugins =[
  server,
  request
];

module.exports = plugins;