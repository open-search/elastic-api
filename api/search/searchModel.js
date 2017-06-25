const searchModel = client => ({
  search: searchObj => new Promise((resolve, reject) => {
    client
      .search(searchObj)
      .then(resolve, (error) => {
        reject(error.message);
      });
  }),

  getById: (index, type, id) => new Promise((resolve, reject) => {
    client
      .get({ index, type, id })
      .then(resolve, reject);
  }),
});

module.exports = searchModel;
