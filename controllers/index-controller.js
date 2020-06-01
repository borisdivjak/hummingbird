var config = require('../config.js');

exports.index = function(req, res) {
  res.render('index', { title: 'Hummingbird trackers', trackers: config.twitter_trackers });
};