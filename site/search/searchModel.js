'use strict';

let client = require('../elasticsearchClient');

let searchModel = {

  search: searchObj => new Promise((resolve, reject) => {
    client
      .search(searchObj)
      .then(resolve, error => {
        reject(error.message);
      });
  }),

  getById: (index, type, id) => new Promise((resolve, reject) => {
    client
      .get({ index: index, type: type, id: id })
      .then(resolve, reject);
  }),

};

module.exports = searchModel;
