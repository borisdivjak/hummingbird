var express = require('express');
var twitterController = require('./controllers/twitter-controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/twit', twitterController.twitterSearch);


module.exports = router;
