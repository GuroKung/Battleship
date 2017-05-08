import express from 'express';
import _ from 'lodash';

import GameController from '../src/gameController';

// var constants = require('../src/constants');
// var mysqlDB = require('../src/storage/mysqlDB');

var api = express.Router();

api.get('/', function(req, res) {
    res.send("Welcome to Battleship game");
});

api.post('/startgame', function(req, res) {
    const game = new GameController();
    res.send("Welcome to Battleship game");
    // return game init status and game info + gameId
});

api.get('/game/:gameId', function(req, res) {
    res.send("Welcome to Battleship game");
    //game info and current game state.
});

api.put('/game/:gameId/move', function(req, res) {
    res.send("Welcome to Battleship game");
    //player make a move
});

api.get('/game/:gameId/history', function(req, res) {
    res.send("Welcome to Battleship game");
    //get game history
});


module.exports = api;