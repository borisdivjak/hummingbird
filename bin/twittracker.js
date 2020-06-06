#!/usr/bin/env node

// DB setup

var mongoose = require('mongoose');
require('../mongosetup.js');
var TwitterPost = require('../models/twitter-post.js');
var TwitterUser = require('../models/twitter-user.js');
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

var getTweets = async (search_params, max_id) => {
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
//  function processTracker - retreive new tweets and users for each tracker
//

var processTracker = async (tracker) => {
  var users = []; // we'll need this to store users temporarily (to simplify promise logic)
  var user_ids = [];
  
  
  try {
    
    await TwitterPost[tracker.id].init();
    await TwitterUser.init();
  
    // get id of the most recent (highest id) tweet in the db
    var post_with_highest_id = await TwitterPost[tracker.id].find({}, {id_str: 1, _id:0}).sort({id_str:-1}).limit(1);
    
    // set since_id to retrieve only tweets more recent than the ones in the DB
    if (post_with_highest_id.length > 0) tracker.parameters.since_id = post_with_highest_id[0].id_str;
  
 
  
    // GET NEW TWEETS AND SAVE THEM
      
    // get tweets - see the getTweets function above
    var result = await getTweets(tracker.parameters);
  
    // after twitter call, check for exsiting tweets (IDs) – check if any duplicates are already saved in database  
    var existing_posts = await TwitterPost[tracker.id].find({'id_str': { $in: result.data.statuses.map( status => status.id_str) }}, 'id_str');
  
    // after both calls (to twitter and to database), remove existing tweets from twitter results and return that
    var existing_ids = existing_posts.map(post => post.id_str);
  
    // filter out tweets with ids that exist in database
    result.data.statuses = result.data.statuses.filter( status => !existing_ids.includes(status.id_str) );
  
    // save remaining tweets to database
    var saved_tweets = await TwitterPost[tracker.id].insertMany(result.data.statuses);
    console.log('NEW RECORDS CREATED FOR "' + tracker.name + '": ' + saved_tweets.length);
  


    // EXTRACT AND SAVE NEW USERS
   
    // create array of users that are authors of new messages
    users = result.data.statuses.map( status => status.user);
    
    // remove duplicates from users array (check where user_ids appear repeatedly in array)
    user_ids = users.map( user => user.id_str);
    users = users.filter((user, index) => user_ids.indexOf(user.id_str) === index);
  
    // get list of users that are already in database
    var existing_users = await TwitterUser.find({'id_str': { $in: user_ids }});  
    var existing_ids = existing_users.map(user => user.id_str);
  
    // filter out users with ids that exist in database
    var new_users = users.filter( user => !existing_ids.includes(user.id_str) );
  
    // save remaining users to database
    var saved_users = await TwitterUser.insertMany(new_users);
    console.log('NEW USERS CREATED: ' + saved_users.length);
    
    
    // UPDATE EXISTING USERS
    
    // for each existing user run a seuqence of steps
    await Promise.all(existing_users.map( async existing_user => {

      // find the new data for the user from the twitter responses
      var new_data = users.find( user => user.id_str === existing_user.id_str );

      // if the twitter data has an update (new data is different to existing)
      // update the user (set) and save changes to database
      if ( !existing_user.equalsUserData( new_data )) {
        try {
          existing_user.set(new_data);
          await existing_user.save({validateModifiedOnly: true});
          console.log( 'Updated user: ', existing_user.screen_name );
        }
        catch(err) {
          console.log(err);
        }
      }
    }));
  }
  catch(err) {
    console.log(err.stack);
  }
}



//  MAIN - call twitter then write to database – repeat for each tracker defined in config.js

var tracker_promises = [];

config.twitter_trackers.forEach( tracker => {
  tracker_promises.push(processTracker(tracker));
}); 

// close mongodb at the end of all calls
Promise.all(tracker_promises).then(() => { mongoose.disconnect(); });