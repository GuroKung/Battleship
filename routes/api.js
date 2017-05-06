import express from 'express';
import _ from 'lodash';

import GameController from '../src/gameController';

// var constants = require('../src/constants');
// var mysqlDB = require('../src/storage/mysqlDB');

var api = express.Router();

api.get('/', function(req, res) {
    const game = new GameController();
    res.send("Welcome to Battleship game");
});

module.exports = api;