'use strict';

const helmet = require('helmet');

module.exports = app => {

  app.use(helmet());
  app.use(require('./router'));

};
