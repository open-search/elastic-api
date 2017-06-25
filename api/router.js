const router = require('express').Router();

router.use('/', require('./search/searchRouter'));
router.use('/indices', require('./indices/indicesRouter'));

router.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: { message: error } });
  next();
});

module.exports = router;
