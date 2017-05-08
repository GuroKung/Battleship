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
    if (gameKey) {
        GameModel.find().getByGameKey(gameKey)
            .then((gameData) => res.send(gameData))
            .catch((err) => {
                console.error(err)
                res.status(400).send({ error: err });
            });
    } else res.status(400).send({ error: 'no game key provided' });
});

api.put('/game/:gameId/move', function(req, res) {
    let gameKey = req.body.key;
    console.log('GAME KEY', gameKey);
    if (gameKey) {
        GameModel.find().getByGameKey(gameKey)
        .then((gameData) => {
            let game = new GameController(gameData.key, gameData.boardGame, gameData.boardSize, gameData.status,
                gameData.attackerMove, gameData.missedShot, gameData.pieces);
            let content = req.body.content;
            let result = {};
            switch (content.status) {
                case 1:
                    result = game.playerMove(content.position.x, content.position.y, content.meta.piece, content.meta.axis);    
                    break;
                case 2:
                    result = game.playerMove(content.position.x, content.position.y); 
                    break;
            }
            res.json(result)
        })
        .catch((err) => {
            console.error(err)
            res.status(400).send({ error : err});
        });
    } else res.status(400).send({ error : 'no game key provided'});
});

api.get('/game/:gameId/history', function(req, res) {
    res.send("Welcome to Battleship game");
    //get game history
});


module.exports = api;