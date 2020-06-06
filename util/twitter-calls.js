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

var max_tweet_results = 10000; // limit calling the api at 100 calls (100 results x 100 calls = 10000)
var count_per_call = 100; // 100 is the maximum for the standard API



//
//  function getTweets - make recursive calls to Twitter to get all relevant results (100 per call)
//

var getTweets = async (search_params, max_id) => {
  if (typeof search_params !== 'object') {
    return Promise.reject(new Error('getTweets requires search parameters object for a twitter query'));
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

      // get min_id from all current ids and pass that to next twitter call as max_id
      // (through a recursive getTweets) 
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
  getTweets:  getTweets,
  getUsers:   getUsers
}
