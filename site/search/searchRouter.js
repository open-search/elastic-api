'use strict';

let searchRouter = require('express').Router();
let searchController = require('./searchController');

searchRouter
  .get('/search/:index/:type/:id', __getById)
  .get('/more', __moreLikeThis)
  .get('/search', __search);

module.exports = searchRouter;

function __getById(req, res) {
  searchController.getById(req.params.index, req.params.type, req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: { message: error } });
    });
}

function __moreLikeThis(req, res) {
  searchController.moreLikeThis(req.query.index, req.query.type, req.query.q)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: { message: error } });
    });
}

function __search(req, res) {
  searchController.search(req.params.index, req.params.type, req.query)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json({ error: { message: error } });
    });
}
