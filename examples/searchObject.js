module.exports = {
  body: {
    _source: [
      'title',
      'lastSaveDate',
      'modifiedTime',
      'download',
    ],
    highlight: {
      fields: {
        'attachment.content': {
          fragment_size: 600,
          number_of_fragments: 3,
        },
        title: {},
      },
      post_tags: [
        '</mark>',
      ],
      pre_tags: [
        '<mark>',
      ],
    },
    query: null,
  },
  index: null,
  type: null,
};
