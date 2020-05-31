#!/usr/bin/env node

// DB setup

var mongoose = require('mongoose');
require('../mongosetup.js');
var TwitterPost = require('../models/twitter-post.js');
var Twitter = require('twit');
var Strint = require('../util/strint.js'); 
var config = require('../config.js')
 
// NOTE: we use Strint to process twitter IDs as strings, because they are too big for Numbers.
// Javascript can only handle 53 bit integers, and Twitter IDs are 64 bit
 
var twit = new Twitter({
  consumer_key:         process.env.TW_API_KEY,
  consumer_secret:      process.env.TW_API_SECRET,
  access_token:         process.env.TW_TOKEN,
  access_token_secret:  process.env.TW_TOKEN_SECRET
})

var max_tweet_results = 10000; // limit calling the api at 100 calls (100 results x 100 calls = 10000)
var count_per_call = 100; // 100 is the maximum for the standard API

//
//  function getTweets - make recursive calls to Twitter to get all relevant results (100 per call)
//

var getTweets = function( search_params, max_id ) {
  if (typeof search_params !== 'object') {
    return Promise.reject(new Error('getTweets requires search parameters for a twitter query'));
  }

  search_params.count       = count_per_call;
  search_params.tweet_mode  = 'extended';
  search_params.result_type = 'recent';
  
  if (max_id != undefined) search_params.max_id = max_id;
    
  // get first 100 tweets 
  var tw_call_1 = twit.get('search/tweets', search_params);
  
  // if there's more, call API again to get next 'page'
  var tw_call_2 = tw_call_1.then( result => {
    if (result.data.statuses.length > 0 || result.data.statuses.length > max_tweet_results) {
      // get min_id from all current ids and pass that to next twitter call (through a recursive getTweets) as max_id
      var ids = result.data.statuses.map( status => status.id_str );
      var min_id = ids.reduce( (a, b) => { return Strint.lt(a,b) ? a : b; });

      return getTweets(search_params, Strint.sub(min_id,'1'));
    }
    else return result;
  });

  // merge statuses from this and from next call to twitter API
  return Promise.all([tw_call_1, tw_call_2]).then( ([result_1, result_2]) => {
      var new_statuses = [ ...result_1.data.statuses, ...result_2.data.statuses ];      
      result_1.data.statuses = new_statuses;
      return result_1;
  });
  
}



//
//  Main - call twitter then write to database
//  repeat for each tracker defined in config.js
//
var tracker_promises = [];

// retreive new tweets for each tracker
config.twitter_trackers.forEach(tracker => {
  var tracker_promise = TwitterPost[tracker.id].init()
  .then(function() {

    // get id of the most recent (highest id) tweet in the db
    return TwitterPost[tracker.id].find({}, {id_str: 1, _id:0}).sort({id_str:-1}).limit(1);
  })
  .then(function(post_with_highest_id) {

    // set since_id to retrieve only tweets more recent than the ones in the DB
    tracker.parameters.since_id = post_with_highest_id[0].id_str;

    // get tweets - see the getTweets function above
    var twitter_call = getTweets(tracker.parameters);
  
    // after twitter call, check for exsiting tweets (IDs) – check if any duplicates are already saved in database
    var check_existing = twitter_call.then( result => {
      return TwitterPost[tracker.id].find({'id_str': { $in: result.data.statuses.map( status => status.id_str) }}, 'id_str');
    });
  
    // after both calls (to twitter and to database), remove existing tweets from twitter results and return that
    return Promise.all([twitter_call, check_existing]).then(function([result, existing_posts]) {
      var existing_ids = existing_posts.map(post => post.id_str);
  
      // filter out tweets with ids that exist in database
      result.data.statuses = result.data.statuses.filter( status => !existing_ids.includes(status.id_str) );
  
      return result;
    });
    
  }) 
  .then(function (result) {
    // save remaining tweets to database
    return TwitterPost[tracker.id].insertMany(result.data.statuses);
  }).then(function (statuses) {
    // log message with number of new statuses recorded
    console.log('NEW RECORDS CREATED FOR "' + tracker.name + '": ' + statuses.length);
  });
    
  tracker_promises.push(tracker_promise);
});

// catch errors across all trackers and close mongodb at the end of all calls
Promise.all(tracker_promises).then(() => {
    mongoose.disconnect();
})
.catch(function (err) {
  console.log(err.stack);
  mongoose.disconnect();
});
