const helmet = require('helmet');
const health = require('express-ping');
const router = require('./router');

module.exports = (app) => {
  app.use(helmet());
  app.use(health.ping());
  app.use(router);
};
