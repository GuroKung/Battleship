const express = require('express');
const _ = require('lodash');

const GameController = require('../src/gameController');
const GameModel = require('../models/game');
const HistoryModel = require('../models/history');

var api = express.Router();

api.get('/', function(req, res) {
    res.send("Welcome to Battleship game");
});

api.post('/startgame', function(req, res) {
    const game = new GameController();
    let gameData = {};
    gameData = game.getData();
    gameData.message = "Battleship game start";
    res.json(gameData);
});

api.get('/game/:gameKey', function(req, res) {
    let gameData = {};
    let gameKey = req.params.gameKey;
    GameModel.find().getByGameKey(gameKey)
    .then((gameData) => {
        res.send(gameData);
    })
    .catch((err) => console.error(err));
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