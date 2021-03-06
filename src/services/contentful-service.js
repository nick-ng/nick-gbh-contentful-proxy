const contentful = require('contentful');
const { objectIndexer } = require('../utils');

const queryParser = (options = {}) => (query = {}) => Object.keys(query).reduce((a, b) => Object.assign(a, { [`fields.${b}`]: query[b] }), options);

const contentfulCleaner = (a) => {
  if (a instanceof Object) {
    return Object.keys(a).reduce((prev, curr) => {
      if (curr === 'sys') {
        return Object.assign(prev, { updatedAt: a.sys.updatedAt });
      }
      if (curr === 'fields') {
        return Object.assign(prev, contentfulCleaner(a[curr]));
      }
      if (curr === 'file') {
        return Object.assign(prev, { url: a[curr].url });
      }
      return Object.assign(prev, { [curr]: contentfulCleaner(a[curr]) });
    }, {});
  }
  if (a instanceof Array) {
    return a.map((b) => contentfulCleaner(b));
  }
  return a;
};

const getAllEntries = (client) => (options = {}) => async (query = {}) => {
  const items = [];
  let total = 1;
  while (items.length < total) {
    // Get entries then check if there are any more pages.
    const response = await client.getEntries(queryParser(Object.assign({ skip: items.length }, options))(query)); // eslint-disable-line no-await-in-loop
    items.push(...response.items);
    total = response.total;
  }
  return contentfulCleaner({ items }).items;
};

const getPlayerList = (client) => async (req, res) => {
  const items = await getAllEntries(client)({ content_type: 'player' })(req.query);
  res.send(objectIndexer('name')(items));
};

const getGuildList = (client) => async (req, res) => {
  const items = await getAllEntries(client)({ content_type: 'guild' })(req.query);
  res.send(objectIndexer('name')(items));
};

// Demo method.
const getPlayerListRaw = (client) => async (req, res) => {
  const response = await client.getEntries(queryParser({ content_type: 'player' })(req.query));
  res.send(response.items);
};

module.exports = (space) => (accessToken) => {
  const client = contentful.createClient({
    space,
    accessToken,
  });

  return {
    getPlayerList: getPlayerList(client),
    getGuildList: getGuildList(client),
    getPlayerListRaw: getPlayerListRaw(client),
    getVeteranRage: async (_, res) => res.send(await client.getEntry('5KflVRZT5C4IsIG0qQCaYq')),
  };
};
