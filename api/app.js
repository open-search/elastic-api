const app = require('express')();

require('./middleware')(app);

module.exports = app;
