'use strict';

let searchRouter = require('express').Router();
let searchController = require('./searchController');

searchRouter
  .get('/search/:index/:type/:id', __getById)
  .get('/more', __moreLikeThis)
  .get('/search', __search);

module.exports = searchRouter;

function __getById(req, res, next) {
  searchController.getById(req.params.index, req.params.type, req.params.id)
    .then(result => {
      res.json(result);
    })
    .catch(next);
}

function __moreLikeThis(req, res, next) {
  searchController.moreLikeThis(req.query.index, req.query.type, req.query.q)
    .then(result => {
      res.json(result);
    })
    .catch(next);
}

function __search(req, res, next) {
  searchController.search(req.params.index, req.params.type, req.query)
    .then(result => {
      res.json(result);
    })
    .catch(next);
}
