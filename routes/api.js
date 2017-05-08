const express = require('express');
const _ = require('lodash');

const GameController = require('../src/gameController');

var api = express.Router();

api.get('/', function(req, res) {
    res.send("Welcome to Battleship game");
});

api.post('/startgame', function(req, res) {
    console.log('START GAME');
    const game = new GameController();
    let gameData = {};
    gameData = game.getData();
    gameData.message = "Battleship game start";
    res.json(gameData);
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