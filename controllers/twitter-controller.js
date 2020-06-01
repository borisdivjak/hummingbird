var config = require('../config.js');

exports.twitterTrackerInfo = function(req, res) {
  // we're using == rather than === because tracker.id can be either number or string
  var tracker = config.twitter_trackers.filter( tracker => tracker.id == req.params['trackerId'] )[0];
  console.log(tracker);

  res.render('tracker-info', { 
      title:    tracker.name, 
      tracker:  tracker
  });
};