const sizeLimit = 50;
const model = require('./searchModel');
const searchTypes = require('../elastic-objects/searchTypes');
const moreLikeThisObject = require('../elastic-objects/moreLikeThisObject');
const searchObject = require('../elastic-objects/searchObject');

const isTrue = value => (value !== undefined && value !== null);

const getMoreLikeThisObject = () => Object.assign({}, moreLikeThisObject);

const getConfigFromRequestQuery = query => ({
  index: query.index,
  query: query.q || '',
  from: query.from || 0,
  size: query.size || sizeLimit,
  order: query.order || 'asc',
  field: query.field,
  filter: query.filter,
  lte: query.lte,
  gte: query.gte,
});

const getSearchObject = config => Object.assign(searchObject, {
  index: config.index,
  type: config.type,
});

const getMatchAllQueryObject = () => ({
  bool: {
    must: {
      match_all: {},
    },
    filter: [],
  },
});

const getSimpleQueryStringSearchObject = searchPhrase => ({
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
});

const getQueryObject = (searchTerm) => {
  if (searchTerm === '' || searchTerm === '*') {
    return getMatchAllQueryObject();
  }

  return getSimpleQueryStringSearchObject(searchTerm);
};

const getQueryObjectType = type => searchTypes[type] || 'all';

const getSize = (size) => {
  if (+size < sizeLimit) {
    return +size;
  }

  return sizeLimit;
};

const getSortObject = (field, order) => field.split(',').map((item) => {
  const sortField = {};
  sortField[item] = order;
  return sortField;
});

const getRange = (filter, lte, gte) => {
  const filterArray = [];
  const filterObject = { range: {} };
  filterObject.range[filter] = { lte, gte };
  filterArray.push(filterObject);
  return filterArray;
};

const searchController = (client) => {
  const searchModel = model(client);
  return {
    search: (queryObject) => {
      const config = getConfigFromRequestQuery(queryObject);
      const searchObj = getSearchObject(config);
      searchObj.body.query = getQueryObject(config.query);
      searchObj.type = getQueryObjectType(queryObject.type);
      searchObj.from = config.from;
      searchObj.size = getSize(config.size);

      if (config.order && config.field && ['asc', 'desc'].indexOf(config.order) !== -1) {
        searchObj.body.sort = getSortObject(config.field, config.order);
      }

      if (config.filter && searchObj.body.query.bool.filter && isTrue(config.lte)
        && isTrue(config.gte)) {
        searchObj.body.query.bool.filter = getRange(config.filter, config.lte, config.gte);
      }

      return searchModel.search(searchObj);
    },

    getById: (index, type, id) => searchModel.getById(index, type, id),

    moreLikeThis: (index, type, query) => {
      const moreLikeThis = getMoreLikeThisObject();
      moreLikeThis.index = index;
      moreLikeThis.type = getQueryObjectType(type);
      moreLikeThis.body.query.more_like_this.like = query;
      return searchModel.search(moreLikeThis);
    },
  };
};

module.exports = searchController;
