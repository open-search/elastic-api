exports.SIZE_LIMIT = process.env.SIZE_LIMIT || 50;
exports.SEARCH_FIELDS = process.env.SEARCH_FIELDS || ['attachment.content', 'title', '_all'];
exports.DEFAULT_OPERATOR = process.env.DEFAULT_OPERATOR || 'and';
