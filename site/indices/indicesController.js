'use strict';

let client = require('../elasticsearchClient');

let indicesController = {
  getIndices: () => new Promise((resolve, reject) => {

    client.cat.indices({ format: 'json' }, (error, result) => {
      if (error) {
        return reject(error);
      }

      resolve(result);
    });

  }),
};

module.exports = indicesController;
