var config = require('../config.js');
var TwitterPost = require('../models/twitter-post.js');



exports.twitterTrackerInfo = function(req, res) {
  // we're using == rather than === because tracker.id can be either number or string
  var tracker = config.twitter_trackers.filter( tracker => tracker.id == req.params['trackerId'] )[0];
  console.log(tracker);

  top_posters_query = TwitterPost[tracker.id].aggregate([
    { $group: { _id: '$user.id_str', screen_name: { $first: '$user.screen_name' },  count: { $sum: 1 }}},
    { $sort : { count : -1 } },
    { $limit: 10 }
  ]);
  
  Promise.all([top_posters_query]).then(([top_posters]) => {
    res.render('tracker-info', { 
        title:        tracker.name, 
        tracker:      tracker,
        top_posters:  top_posters
    });
  }).catch(err => {
    console.log(err);
  });
  
};