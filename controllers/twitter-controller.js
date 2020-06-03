var config = require('../config.js');
var TwitterPost = require('../models/twitter-post.js');


exports.twitterTrackerInfo = async function(req, res) {
  // we're using == rather than === because tracker.id can be either number or string
  var tracker = config.twitter_trackers.filter( tracker => tracker.id == req.params['trackerId'] )[0];

  try {
    var top_posters = await TwitterPost[tracker.id].getTopPosters();
  
    res.render('tracker-info', { 
        title:        tracker.name, 
        tracker:      tracker,
        top_posters:  top_posters
    });
  }
  catch(err) {
    console.log(err);
    res.end();
  }
};