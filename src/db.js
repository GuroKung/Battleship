var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:32768/battleship');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Successfully connected to database");
});

module.exports = mongoose;