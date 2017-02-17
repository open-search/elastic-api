'use strict';

const sizeLimit = 50;
let searchModel = require('./searchModel');

const searchController = {

  search: (queryObject) => {

    let config = __getConfigFromRequestQuery(queryObject);
    let searchObj = __getSearchObject(config);

    searchObj.body.query = __getQueryObject(config.query);
    __decorateQueryObjectWithType(searchObj, queryObject.type);
    __decorateFrom(searchObj, config.from);
    __decorateSizeLimit(searchObj, config.size, sizeLimit);
    __decorateSort(searchObj, config.field, config.order);
    __decorateRange(searchObj.body.query.bool.filter, config.filter, config.lte, config.gte);

    return searchModel.search(searchObj);
  },

  getById: (index, type, id) => searchModel.getById(index, type, id),

  moreLikeThis: (index, type, query) => {

    let moreLikeThisObject = __getMoreLikeThisObject();
    __decorateQueryObjectWithIndex(moreLikeThisObject, index);
    __decorateQueryObjectWithType(moreLikeThisObject, type);
    __decorateMoreLikeThis(moreLikeThisObject, query);

    return searchModel.search(moreLikeThisObject);

  },

};

module.exports = searchController;

let __getMoreLikeThisObject = (() => {
  const moreLikeThisObject = require('./config/moreLikeThisObject');
  return () => Object.assign({}, moreLikeThisObject);
})();

let __decorateQueryObjectWithType = (() => {
  const types = require('./config/searchTypes');
  return (object, type) => {
    object.type = type ? (types[type] === 'all' ? types.all : types[type]) : types.all;
  };
})();

function __decorateMoreLikeThis(moreObject, likePhrase) {
  moreObject.body.query.more_like_this.like = likePhrase;
}

function __getConfigFromRequestQuery(query) {
  return {
    index: query.index,
    query: query.q || '',
    from: query.from,
    size: query.size,
    order: query.order || 'asc',
    field: query.field,
    filter: query.filter,
    lte: query.lte,
    gte: query.gte,
  };
}

let __getSearchObject = (() => {
  let searchObject = require('./config/searchObject');
  return (config) => Object.assign(searchObject, {
    index: config.index,
    type: config.type,
  });
})();

function __decorateQueryObjectWithIndex(object, index) {
  object.index = index;
}

function __getQueryObject(searchTerm) {

  if (searchTerm === '' || searchTerm === '*') {
    return __getMatchAllQueryObject();
  }

  return __getSimpleQueryStringSearchObject(searchTerm);

}

function __getMatchAllQueryObject() {
  return {
    bool: {
      must: {
        match_all: {},
      },
      filter: [],
    },
  };
}

function __getSimpleQueryStringSearchObject(searchPhrase) {
  return {
    bool: {
      must: {
        simple_query_string: {
          query: searchPhrase,
          fields: ['attachment.content', 'title', '_all'],
          default_operator: 'and',
        },
      },
      filter: [],
    },
  };
}

function __decorateSort(searchObj, field, order) {
  if (order) {
    if (field && ~['asc', 'desc'].indexOf(order)) {
      searchObj.body.sort = field.split(',').map(item => {
        let sortField = {};
        sortField[item] = order;
        return sortField;
      });
    }
  }
}

function __decorateSizeLimit(searchObj, size, sizeLimit) {
  if (size) {
    size = +size;
    searchObj.size = (size < sizeLimit) ? size : sizeLimit;
  }
}

function __decorateFrom(searchObj, from) {
  if (from) {
    searchObj.from = +from;
  }
}

function __decorateRange(filterArray, filter, lte, gte) {
  if (filterArray && filter && __isTrue(lte) && __isTrue(gte)) {
    let filterObject = { range: {} };
    filterObject.range[filter] = {
      lte: lte,
      gte: gte,
    };
    filterArray.push(filterObject);
  }
}

function __isTrue(value) {
  return (value !== undefined && value !== null);
}
