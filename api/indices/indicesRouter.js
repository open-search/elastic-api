const indicesRouter = require('express').Router();
const client = require('../elasticsearchClient');
const indicesController = require('./indicesController')(client);

indicesRouter
  .get('/', (req, res, next) => {
    indicesController.getIndices()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
  });

module.exports = indicesRouter;
