const contentful = require('contentful');
const { objectIndexer } = require('../utils');

const queryParser = (options = {}) => (query = {}) => Object.keys(query).reduce((a, b) => Object.assign(a, { [`fields.${b}`]: query[b] }), options);

const contentfulCleaner = (a) => {
  if (a instanceof Object) {
    return Object.keys(a).reduce((prev, curr) => {
      if (curr === 'sys') {
        return prev;
      }
      if (curr === 'fields') {
        return Object.assign({}, prev, contentfulCleaner(a[curr]));
      }
      if (curr === 'file') {
        return Object.assign({}, prev, { url: a[curr].url });
      }
      return Object.assign({}, prev, { [curr]: contentfulCleaner(a[curr]) });
    }, {});
  }
  if (a instanceof Array) {
    return a.map(b => contentfulCleaner(b));
  }
  return a;
};

const getPlayerList = client => async (req, res) => {
  const response = await client.getEntries(queryParser({ content_type: 'player' })(req.query));
  res.send(objectIndexer('name')(contentfulCleaner(response.items)));
};

const getPlayerListRaw = client => async (req, res) => {
  const response = await client.getEntries(queryParser({ content_type: 'player' })(req.query));
  res.send(response.items);
};

module.exports = space => (accessToken) => {
  const client = contentful.createClient({
    space,
    accessToken,
  });

  return {
    getPlayerList: getPlayerList(client),
    getPlayerListRaw: getPlayerListRaw(client),
    getVeteranRage: async (_, res) => res.send(await client.getEntry('5KflVRZT5C4IsIG0qQCaYq')),
  };
};
