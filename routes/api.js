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
    game.createGameInDB();
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
            if (gameData.status == 'error') res.status(404).send(gameData);
            return res.send(gameData)
        })
        .catch((err) => {
            console.error(err)
            return res.status(400).send({ error: err });
        });
});

api.put('/game/:gameKey/move', function(req, res) {
    let gameKey = req.params.gameKey;
    console.log('GAME KEY', gameKey);
    GameModel.find().getByGameKey(gameKey)
        .then((gameData) => {
            let game = new GameController(gameData.key, gameData.boardGame, gameData.boardSize, gameData.status,
                gameData.attackerMove, gameData.missedShot, gameData.pieces);
            let content = req.body.content;
            let result = {};
            if (content.status === gameData.status) {
                switch (content.status) {
                    case 1:
                        result = game.playerMove(content.position.x, content.position.y, content.meta.piece, content.meta.axis);
                        break;
                    case 2:
                        result = game.playerMove(content.position.x, content.position.y);
                        break;
                }
            }
            else result = { status: 'error', message: 'move in wrong turn' };
            return res.json(result)
        })
        .catch((err) => {
            console.error(err)
            return res.status(400).send({ error: err });
        });
});

api.get('/game/:gameId/history', function(req, res) {
    res.send("Welcome to Battleship game");
    //get game history
});


module.exports = api;