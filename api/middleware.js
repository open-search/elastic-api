const helmet = require('helmet');
const health = require('express-ping');
const router = require('./router');
const cors = require('cors');

module.exports = (app) => {
  app.use(helmet());
  app.use(cors());
  app.use(health.ping());
  app.use(router);
};
