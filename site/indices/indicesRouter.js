'use strict';

let indicesRouter = require('express').Router();
let indicesController = require('./indicesController');

indicesRouter
  .get('/', (req, res) => {
    indicesController.getIndices()
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: { message: error } });
    });
  });

module.exports = indicesRouter;
