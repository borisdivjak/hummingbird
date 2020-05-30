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
    var twitter_call = twit.get('search/tweets', { 
      q:            '#servicedesign OR "service design"', 
      count:        5, 
      result_type:  'recent',
      geocode:      '"52.5 -1.5 200km"',
      tweet_mode:   'extended' 
    });
    // `result` of twit.get is a Promise Object with keys "data" and "resp".

    // after twitter call, check for exsiting tweets (IDs) – find the ones already saved in database
    var check_existing = twitter_call.then(function (result) {
      return TwitterPost.find({'id': { $in: result.data.statuses.map( status => status.id) }}, 'id');
    });

    // after both calls (to twitter and to database), remove existing tweets from twitter results and return that
    return Promise.all([twitter_call, check_existing]).then(function([result, existing_posts]) {
      var existing_ids = existing_posts.map(post => post.id);

      // filter out tweets with ids that exist in database
      result.data.statuses = result.data.statuses.filter( status => !existing_ids.includes(status.id) );

      return result;
    });
    
  }) 
  .then(function (result) {
    // save remaining tweets to database
    TwitterPost.insertMany(result.data.statuses);
    console.log("NEW RECORDS CREATED: " + result.data.statuses.length);
    res.send("NEW RECORDS CREATED: " + result.data.statuses.length);      
  })
  .catch(function (err) {
    console.log(err.stack);
    res.end();
  });
};