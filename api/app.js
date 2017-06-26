const app = require('express')();

require('./swagger')(app);
require('./middleware')(app);

module.exports = app;
