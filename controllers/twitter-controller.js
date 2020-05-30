var TwitterPost = require('../models/twitter-post.js')
var Twitter = require('twit')
 
var twit = new Twitter({
  consumer_key:         process.env.TW_API_KEY,
  consumer_secret:      process.env.TW_API_SECRET,
  access_token:         process.env.TW_TOKEN,
  access_token_secret:  process.env.TW_TOKEN_SECRET
})
 
  
exports.twitterSearch = function(req, res) {
  TwitterPost.init()
  .then(function() {
    return twit.get('search/tweets', { 
      q:            '#servicedesign OR "service design"', 
      count:        5, 
      result_type:  'recent',
      geocode:      '"52.5 -1.5 200km"',
      tweet_mode:   'extended' 
    })
  }) 
  .then(function (result) {
    // `result` is an Object with keys "data" and "resp".
    // See https://github.com/ttezel/twit#tgetpath-params-callback for details.
    
    var post = new TwitterPost(result.data.statuses[0]);
    
    console.log(result.data);

    res.send(result.data.statuses[0].full_text);

    return post.save();
 
  })
  .catch(function (err) {
    console.log(err.stack);
    res.end();
  });
};