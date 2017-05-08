var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    id: String,
    status: Date,
    boardGame: []
});

// Compile model from schema
var Game = mongoose.model('Game', GameSchema );