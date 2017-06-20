const uuidV4 = require('uuid/v4');
const config = require('../config');
const { makeRedisClient, autoScan } = require('./redis-service');
const { generateNewKey } = require('../utils');
const { addCoachJSON } = require('../utils/event-maker');

const makeNewCoachId = () => {
  const coachId = uuidV4();
  const client = makeRedisClient();
  client.saddAsync(config.redis.coachList, coachId)
    .then(() => client.quit());
  return coachId;
};

const checkId = (coachId = '') => {
  const client = makeRedisClient();
  return client.sismemberAsync(config.redis.coachList, [coachId])
  .then((coachExists) => {
    if (coachExists) {
      return coachId;
    }
    return makeNewCoachId();
  })
  .then((r) => {
    client.quit();
    return r;
  });
};

const initGame = (coachId, gameId) => {
  const client = makeRedisClient();
  const logKey = `${gameId}:log`;
  const coachesKey = `${gameId}:coaches`;
  return client.rpushAsync(logKey, addCoachJSON(coachId, 0))
    .then(() => client.expireAsync(logKey, config.redis.maxGameTime))
    .then(() => client.hsetAsync(coachesKey, coachId, 0))
    .then(() => client.expireAsync(coachesKey, config.redis.maxGameTime))
    .then(() => client.quit());
};

const makeNewGame = (coachId) => checkId(coachId)
  .then((newCoachId) => autoScan('*:log')
    .then((gameLogs) => {
      const gameList = gameLogs.map((gameLog) => gameLog.replace(':log', ''));
      const gameId = generateNewKey(gameList);
      initGame(newCoachId, gameId);
      return { coachId: newCoachId, gameId };
    }));

module.exports = {
  checkId,
  makeNewCoachId,
  makeNewGame,
};
