var Twitter = require('twit');
var Strint = require('../util/strint.js'); 
 
// NOTE: we use Strint to process twitter IDs as strings, because they are too big for Numbers.
// Javascript can only handle 53 bit integers, and Twitter IDs are 64 bit
 
var twit = new Twitter({
  consumer_key:         process.env.TW_API_KEY,
  consumer_secret:      process.env.TW_API_SECRET,
  access_token:         process.env.TW_TOKEN,
  access_token_secret:  process.env.TW_TOKEN_SECRET
})

var max_tweet_results = 5000; // limit calling the api 
var count_per_call = 100; // 100 is the maximum for the standard API



//
//  function getTweets - make recursive calls to Twitter to get all relevant results (100 per call)
//

var getTweetsFromSearch = async (tw_params, max_id) => {
  if (typeof tw_params !== 'object') {
    return Promise.reject(new Error('getTweetsFromSearch requires parameters object for a twitter query'));
  }

  tw_params.count       = count_per_call;
  tw_params.tweet_mode  = 'extended';
  tw_params.result_type = 'recent';
  
  if (max_id != undefined) tw_params.max_id = max_id;
    
  // get first 100 tweets 
  var result = await twit.get('search/tweets', tw_params);
  var statuses = result.data.statuses;
  
  // if more than 0 statuses in response, then there might be more to come, so try to fetch more
  if (statuses.length > 0 && statuses.length < max_tweet_results) {

      // get min_id from all current ids and pass that to next twitter call as max_id
      // (through a recursive getTweetsFromSearch) 
      var ids = statuses.map( status => status.id_str );
      var min_id = ids.reduce( (a, b) => { return Strint.lt(a,b) ? a : b; });

      var new_statuses = await getTweetsFromSearch(tw_params, Strint.sub(min_id,'1'));
      statuses = [...statuses, ...new_statuses];
  }
  return statuses; 
}


var getTweetsFromList = async (tw_params, max_id) => {
  if (typeof tw_params !== 'object') {
    return Promise.reject(new Error('getTweetsFromList requires parameters object for a twitter query'));
  }

  tw_params.count       = 200; // seems like the list call allows 200 results
  tw_params.tweet_mode  = 'extended';
  
  if (max_id != undefined) tw_params.max_id = max_id;
    
  // get first 100 tweets 
  var result = await twit.get('lists/statuses', tw_params);
  var statuses = result.data;
  
  // if more than 0 statuses in response, then there might be more to come, so try to fetch more
  if (statuses.length > 0 && statuses.length < max_tweet_results) {

      // get min_id from all current ids and pass that to next twitter call as max_id
      // (through a recursive getTweetsFromSearch) 
      var ids = statuses.map( status => status.id_str );
      var min_id = ids.reduce( (a, b) => { return Strint.lt(a,b) ? a : b; });

      var new_statuses = await getTweetsFromList(tw_params, Strint.sub(min_id,'1'));
      statuses = [...statuses, ...new_statuses];
  }
  return statuses; 
}


var getTweetsFromTimeline = async (tw_params) => {
  if (typeof tw_params !== 'object') {
    return Promise.reject(new Error('getTweetsFromTimeline requires parameters object for a twitter query'));
  }

  tw_params.count       = count_per_call;  
  tw_params.tweet_mode  = 'extended';
  
  // get 100 results from users timeline (tweeted by the user, no mentions etc.)
  var result = await twit.get('statuses/user_timeline', tw_params);
  var statuses = result.data;
  
  // also get available mentions through the search API (only able to fetch last 7 days though)
  // note: we can specify a different queary in the config to do a combined timeline + search feed
  // so if q is defined, leave it as it is
  if ( tw_params.q === undefined ) tw_params.q = '@' + tw_params.screen_name;
  tw_params.result_type = 'recent';
  var mentions = await getTweetsFromSearch(tw_params);

  // remove mentions of own tweets - to avoid duplication
  mentions = mentions.filter( mention => mention.user.screen_name.toLowerCase() !== tw_params.screen_name.toLowerCase() );

  return [...statuses, ...mentions];
}


var getUsers = async (screen_names) => {
  if (screen_names === undefined || screen_names === null) {
    throw new Error('function getUsers requires a list of users, either as array or as a comma separated string.');
  }
  if (typeof screen_names === 'string') {
    // turn string into array
    screen_names = screen_names.replace(/\s/g,'').split(',');
  }

  // create chunks of 100 names (max 100 per twitter call)
  var chuncks_of_names = [];
  for ( i=0; i<screen_names.length; i+=100 ) {
    chuncks_of_names.push( screen_names.slice(i,i+100) );
  }

  var twitter_users = [];

  // get twitter user data in chunks of 100 at a time and wait for all responses
  await Promise.all( chuncks_of_names.map( async names => {
    try {
      var response = await twit.get('users/lookup', { 
        screen_name: names.toString(),
        include_entities: false
      });
      twitter_users.push(...response.data);
    }
    catch(err) {
      console.log('Function getUsers, call to Twitter "users/lookup":');
      console.log(err.message);
    }
  }));

  return twitter_users;
}

module.exports = {
  getTweetsFromSearch:    getTweetsFromSearch,
  getTweetsFromList:      getTweetsFromList,
  getTweetsFromTimeline:  getTweetsFromTimeline,
  getUsers:               getUsers
}
