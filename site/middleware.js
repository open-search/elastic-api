const helmet = require('helmet');
const router = require('./router');

module.exports = (app) => {
  app.use(helmet());
  app.use(router);
};
