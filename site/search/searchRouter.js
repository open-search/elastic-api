const searchRouter = require('express').Router();
const client = require('../elasticsearchClient');
const searchController = require('./searchController')(client);

function getById(req, res, next) {
  searchController.getById(req.params.index, req.params.type, req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
}

function moreLikeThis(req, res, next) {
  searchController.moreLikeThis(req.query.index, req.query.type, req.query.q)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
}

function search(req, res, next) {
  searchController.search(req.query)
    .then((result) => {
      res.json(result);
    })
    .catch(next);
}

searchRouter
  .get('/search/:index/:type/:id', getById)
  .get('/more', moreLikeThis)
  .get('/search', search);

module.exports = searchRouter;
