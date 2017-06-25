const app = require('express')();

require('./api/middleware')(app);

module.exports = app;
