'use strict';

let router = require('express').Router();

router.use('/', require('./search/searchRouter'));
router.use('/indices', require('./indices/indicesRouter'));

router.use((req, res, next) => {
  let error = new Error('Not Found');
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json(error);
});

module.exports = router;
