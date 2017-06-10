require('dotenv-safe').load();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { getPlayerList } = require('./services/contentful-service');

const PORT = process.env.PORT || 4001;
const INDEX = path.join(__dirname, 'public', 'index.html');
// const LEGACY_WARNING = 'This route will be deprecated soon. Please switch to the appropriate route.';

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
server.get('/player-list', getPlayerList);

server.use((req, res) => res.sendFile(INDEX));
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
