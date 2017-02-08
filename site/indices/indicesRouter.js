'use strict';

let indicesRouter = require('express').Router();
let indicesController = require('./indicesController');

indicesRouter
  .get('/', (req, res, next) => {
    indicesController.getIndices()
    .then(result => {
      res.json(result);
    })
    .catch(next);
  });

module.exports = indicesRouter;
