const app = require('express')();

require('./site/middleware')(app);

module.exports = app;
