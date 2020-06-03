require('dotenv').config()

//Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://' 
              + process.env.MONGO_USER
              + ':'
              + process.env.MONGO_PASS
              + '@clusterbd1-07cdt.mongodb.net/'
              + process.env.MONGO_DB
              + '?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
