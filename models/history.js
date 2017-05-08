var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HistorySchema = new Schema({
    status: String,
    message: String
});

// Compile model from schema
var History = mongoose.model('History', HistorySchema );

module.exports = History;