const indicesController = client => ({
  getIndices: () => new Promise((resolve, reject) => {
    client.cat.indices({ format: 'json' }, (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  }),
});

module.exports = indicesController;
