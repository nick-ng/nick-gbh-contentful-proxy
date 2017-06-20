require('dotenv-safe').load();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const {
  getVeteranRage,
  getPlayerList,
  getPlayerListRaw,
  getGuildList,
} = require('./services/contentful-service')(process.env.CONTENTFUL_GBH_SPACE)(process.env.CONTENTFUL_ACCESS_TOKEN);

const PORT = process.env.PORT || 4001;
const INDEX = path.join(__dirname, 'public', 'index.html');

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.set('content-type', 'application/json; charset=utf-8');
  next();
});

// Routes
server.get('/veteran-rage', getVeteranRage);
server.get('/players', getPlayerList);
server.get('/guilds', getGuildList);

// Legacy routes
server.get('/player-list', getPlayerList);
server.get('/player-list-raw', getPlayerListRaw);

server.use((req, res) => res.sendFile(INDEX));
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
