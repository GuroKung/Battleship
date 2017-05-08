var mongoose = require('mongoose');

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

// GameSchema.methods.getBoardGame = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

// GameSchema.methods.saveBoardGame = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

// Compile model from schema
var Game = mongoose.model('Game', GameSchema );

module.exports = Game;