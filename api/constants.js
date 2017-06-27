const path = require('path');

exports.SIZE_LIMIT = process.env.SIZE_LIMIT || 50;
exports.SEARCH_FIELDS = process.env.SEARCH_FIELDS || ['attachment.content', 'title', '_all'];
exports.ELASTIC_OBJECTS_PATH = process.env.ELASTIC_OBJECTS_PATH ||
  path.resolve('examples');
exports.DEFAULT_OPERATOR = process.env.DEFAULT_OPERATOR || 'and';
