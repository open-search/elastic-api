const path = require('path');
const express = require('express');
const sla = express();
const swaggerExpress = require('swagger-node-express');

module.exports = (app) => {
  swaggerExpress.createNew(sla);

  app.use('/swagger', sla);
  app.use(express.static(path.resolve(__dirname, 'dist')));

  sla.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });

  return sla;
};
