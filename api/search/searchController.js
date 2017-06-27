const path = require('path');
const { ELASTIC_OBJECTS_PATH, SIZE_LIMIT, SEARCH_FIELDS, DEFAULT_OPERATOR } =
  require('../constants');
const model = require('./searchModel');
const searchTypes = require(path.resolve(ELASTIC_OBJECTS_PATH, 'searchTypes'));
const moreLikeThisObject = require(path.resolve(ELASTIC_OBJECTS_PATH, 'moreLikeThisObject'));
const matchAllQueryObject = require(path.resolve(ELASTIC_OBJECTS_PATH, 'matchAllQueryObject'));
const simpleQueryStringObject =
  require(path.resolve(ELASTIC_OBJECTS_PATH, 'simpleQueryStringObject'));
const searchObject = require(path.resolve(ELASTIC_OBJECTS_PATH, 'searchObject'));

const isTrue = value => (value !== undefined && value !== null);

const getMoreLikeThisObject = () => Object.assign({}, moreLikeThisObject);

const getConfigFromRequestQuery = query => ({
  index: query.index,
  query: query.q || '',
  from: query.from || 0,
  size: query.size || SIZE_LIMIT,
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

const getMatchAllQueryObject = () => Object.assign(matchAllQueryObject);

const getSimpleQueryStringSearchObject = searchPhrase => {
  const searchObject = Object.assign({}, simpleQueryStringObject);
  searchObject.bool.must.simple_query_string = {
    query: searchPhrase,
    fields: SEARCH_FIELDS,
    default_operator: DEFAULT_OPERATOR,
  };
  return searchObject;
};

const getQueryObject = (searchTerm) => (searchTerm === '' || searchTerm === '*') ?
  getMatchAllQueryObject() : getSimpleQueryStringSearchObject(searchTerm);

const getQueryObjectType = type => searchTypes[type] || 'all';

const getSize = (size) => +size < SIZE_LIMIT ? +size : SIZE_LIMIT;

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
