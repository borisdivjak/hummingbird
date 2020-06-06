#!/usr/bin/env node

// DB setup

var db = require('../mongosetup.js');
var TwitterPost = require('../models/twitter-post.js');
var TwitterUser = require('../models/twitter-user.js');
var Twitter = require('../util/twitter-calls');
var config = require('../config.js')

var combined_screen_names = [];


Promise.all(config.twitter_trackers.map( async tracker => {
  // START BY GOING THROUGH ALL POSTS IN ALL TRACKERS AND GET ALL USER REFERENCES (posts, mentions, retweets, ...)

  // get connections from posts
  var connections    = await TwitterPost[tracker.id].getUserConnections();
  
  // get rich user objects based on screen names from connections
  var screen_names_1 = connections.map( connection => connection.screen_name_1 );
  var screen_names_2 = connections.map( connection => connection.screen_name_2 );

  // combine names into single array across all trackers
  // use '...new Set()' to ensure there are no duplicates
  combined_screen_names = [...new Set( [...screen_names_1, ...screen_names_2, ...combined_screen_names] )];

}))

// after we have a combined list of all screen_names from all trackers
.then( async () => {

  // get hydrated user objects from Twitter
  var tw_users = await Twitter.getUsers(combined_screen_names);
  console.log('Users received from twitter: ', tw_users.length);

  // UPDATE EXISTING USERS

  // get users that are already in database and update if needed
  var db_users = await TwitterUser.getUsersByScreenName(combined_screen_names);

  // for each existing user run a seuqence of steps
  await Promise.all(db_users.map( async existing_user => {

    try {
      // find the new data for the user from the twitter responses
      var new_data = tw_users.find( user => user.id_str === existing_user.id_str );
    }
    catch(err) {
      console.log('MAPPING ARRAY DATA ', err.message);
      console.log(existing_user);
      console.log('twitter objects');
      console.log(tw_users);
    }

    // if the twitter data has an update (new data is different to existing)
    // update the user (set) and save changes to database
    try {
      if ( !existing_user.equalsUserData( new_data )) {
        try {
          existing_user.set(new_data);
          await existing_user.save({validateModifiedOnly: true});
          console.log( 'Updated user: ', existing_user.screen_name );
        }
        catch(err) {
          console.log('Error while updating existing users with new Twitter data');
          console.log(err.message);
        }
      }
    }
    catch(err) {
      console.log('EQUALS USER DATA ', err.message);
      console.log(new_data);
    }
  }));

  
  // INSERT NEW USERS

  // make subset of twitter user data with just new users (not existing in db yet)
  var db_names = db_users.map( db_user => db_user.screen_name );  
  var new_tw_users = tw_users.filter( user => !db_names.includes(user.screen_name));

  // save new users to database
  var saved_users = await TwitterUser.insertMany(new_tw_users);
  console.log('NEW USERS CREATED: ' + saved_users.length);

})

.then(() => {
  db.close();
})

.catch(err => {
  console.log(err.message);
  db.close();
});