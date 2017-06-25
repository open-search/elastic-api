const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`,
});

module.exports = client;
