const _ = require('lodash');

function mergeRequestOptions(options = {}) {
  return _.merge(
    {
      timeout: 2000,
      headers: { Accept: 'application/json' },
    },
    options,
  );
}

module.exports = { mergeRequestOptions };
