var express = require('express');
var indexController = require('./controllers/index-controller.js');
var twitterController = require('./controllers/twitter-controller.js');
var router = express.Router();

router.get('/', indexController.index);
router.get('/tracker/:trackerId', twitterController.twitterTrackerInfo);


module.exports = router;
