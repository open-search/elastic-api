module.exports = {
  _source: 'title',
  body: {
    query: {
      more_like_this: {
        fields: [
          'title',
          'attachmentcontent',
        ],
        like: null,
        max_query_terms: 12,
        min_term_freq: 1,
      },
    },
  },
  index: null,
  type: null,
};
