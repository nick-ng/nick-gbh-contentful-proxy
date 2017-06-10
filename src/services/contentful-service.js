const contentful = require('contentful');

const contentfulService = async space => (accessToken) => {
  const client = contentful.createClient({
    space,
    accessToken,
  });

  return {
    getPlayerList: () => client.getEntry('5KflVRZT5C4IsIG0qQCaYq'),
  };
};

module.exports = contentfulService;
