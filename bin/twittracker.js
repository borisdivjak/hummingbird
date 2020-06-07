#!/usr/bin/env node

// DB setup

var db = require('../mongosetup.js');
var TwitterPost = require('../models/twitter-post.js');
var TwitterUser = require('../models/twitter-user.js');
var Twitter = require('../util/twitter-calls');
var config = require('../config.js');



//
//  process all trackers - retreive new tweets and users for each tracker
//  

Promise.all( config.twitter_trackers.map( async tracker => {
  try {
    
    await TwitterPost[tracker.id].init();
    await TwitterUser.init();
  
    // get id of the most recent (highest id) tweet in the db
    var post_with_highest_id = await TwitterPost[tracker.id].find({}, {id_str: 1, _id:0}).sort({id_str:-1}).limit(1);
    
    // set since_id to retrieve only tweets more recent than the ones in the DB
    if (post_with_highest_id.length > 0) tracker.parameters.since_id = post_with_highest_id[0].id_str;
  
 
  
    // GET NEW TWEETS AND SAVE THEM
      
    var statuses = [];

    // get tweets from twitter - method depending on tracker type
    switch(tracker.type) {
      case 'search': {
        statuses = await Twitter.getTweetsFromSearch(tracker.parameters);
        break;
      }
      case 'timeline': {
        break;        
      }
    }
  
    // after twitter call, check for exsiting tweets (IDs) – check if any duplicates are already saved in database  
    var existing_posts = await TwitterPost[tracker.id].find({'id_str': { $in: statuses.map( status => status.id_str) }}, 'id_str');
  
    // after both calls (to twitter and to database), remove existing tweets from twitter results and return that
    var existing_ids = existing_posts.map(post => post.id_str);
  
    // filter out tweets with ids that exist in database
    statuses = statuses.filter( status => !existing_ids.includes(status.id_str) );
  
    // save remaining tweets to database
    var saved_tweets = await TwitterPost[tracker.id].insertMany(statuses);
    console.log('NEW RECORDS CREATED FOR "' + tracker.name + '": ' + saved_tweets.length);
  


    // EXTRACT AND SAVE NEW USERS
   
    // create array of users that are authors of new messages
    var users = statuses.map( status => status.user);
    
    // remove duplicates from users array (check where user_ids appear repeatedly in array)
    var user_ids = users.map( user => user.id_str);
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
}))

// close mongodb at the end of all calls (when promises fulfilled)
.then(() => { db.close(); });
