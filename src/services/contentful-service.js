const contentful = require('contentful');

const queryParser = (options = {}) => (query = {}) => Object.keys(query).reduce((a, b) => Object.assign(a, { [`fields.${b}`]: query[b] }), options);

const getPlayerList = client => async (req, res) => {
  const response = await client.getEntries(queryParser({ content_type: 'player' })(req.query));
  res.send(response.items.map(a => a.fields));
};

module.exports = space => (accessToken) => {
  const client = contentful.createClient({
    space,
    accessToken,
  });

  return {
    getPlayerList: getPlayerList(client),
    getVeteranRage: async (_, res) => res.send(await client.getEntry('5KflVRZT5C4IsIG0qQCaYq')),
  };
};
