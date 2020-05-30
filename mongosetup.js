require('dotenv').config()

//Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://' 
              + process.env.MONGO_USER
              + ':'
              + process.env.MONGO_PASS
              + '@clusterbd1-07cdt.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
