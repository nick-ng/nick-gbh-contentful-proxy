const contentful = require('contentful');

module.exports = space => (accessToken) => {
  const client = contentful.createClient({
    space,
    accessToken,
  });

  return {
    getPlayerList: (_, res) => res.send('Nothing here'),
    getVeteranRage: async (_, res) => {
      const response = await client.getEntry('5KflVRZT5C4IsIG0qQCaYq');
      res.send(response);
    },
  };
};
