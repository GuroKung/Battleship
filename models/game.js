var mongoose = require('mongoose');
var _ = require('lodash');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    key: String,
    status: Number,
    boardGame: [],
    boardSize: Number,
    attackerMove: Number,
    missedShot: Number,
    pieces: []
});

GameSchema.query.getByGameKey = function (key) {
   var self = this;
   return new Promise(function (resolve, reject) {
       self.findOne({ key }).exec((err, gameData) => {
           if (err) reject(err);
           if(!gameData) resolve({ status: 'error', message: 'game with the given key not found'});
           gameData = gameData.toObject();
           gameData.boardGame = _.chunk(gameData.boardGame, gameData.boardSize);
           resolve(gameData);
       });
   });
}

// Compile model from schema
var Game = mongoose.model('Game', GameSchema );

module.exports = Game;