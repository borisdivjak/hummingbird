var config = require('../config.js');
var TwitterPost = require('../models/twitter-post.js');
var TwitterUser = require('../models/twitter-user.js');


exports.twitterTrackerInfo = async function(req, res) {
  // we're using == rather than === because tracker.id can be either number or string
  var tracker = config.twitter_trackers.filter( tracker => tracker.id == req.params['trackerId'] )[0];

  try {
    var top_posters   = await TwitterPost[tracker.id].getTopPosters();
    var top_hashtags  = await TwitterPost[tracker.id].getTopHashtags();
    var top_rm        = await TwitterPost[tracker.id].getTopRetweetedOrMentioned();
      
    res.render('tracker-info', { 
        title:         tracker.name, 
        tracker:       tracker,
        top_posters:   top_posters,
        top_hashtags:  top_hashtags,
        top_rm:        top_rm
    });
  }
  catch(err) {
    console.log(err);
    res.end();
  }
};


exports.twitterTrackerConnections = async function(req, res) {
  var tracker = config.twitter_trackers.filter( tracker => tracker.id == req.params['trackerId'] )[0];

  try {
    var connections   = await TwitterPost[tracker.id].getUserConnections();

    res.render('tracker-connections', { 
        title:         tracker.name, 
        tracker:       tracker,
        connections:   connections
    });
  }
  catch(err) {
    console.log(err);
    res.end();
  }

};



exports.twitterTrackerConnectionsJSON = async function(req, res) {
  var tracker = config.twitter_trackers.filter( tracker => tracker.id == req.params['trackerId'] )[0];

  try {
    // get connections from posts
    var connections    = await TwitterPost[tracker.id].getUserConnections();

    // get rich user objects based on screen names from connections
    var screen_names_1 = connections.map( connection => connection.screen_name_1 );
    var screen_names_2 = connections.map( connection => connection.screen_name_2 );
    var screen_names   = [...new Set( [...screen_names_1, ...screen_names_2] )];

    var users = await TwitterUser.getUsersByScreenName(screen_names);

    var response = {
      elements: users.map( user => {
        return { 
          id:           user.screen_name, 
          label:        user.name, 
          description:  user.description,
          followers_count: user.followers_count, 
          image:        user.profile_image_url_200x200,
          'twitter profile': user.screen_name
        }
      }),
      connections: connections.map( connection => {
        return { 
          from:       connection.screen_name_1,
          to:         connection.screen_name_2,
          strength:   connection.count,
          direction:  'mutual'
        }   
      })
    };
    
    console.log( 'Elements: ' + response.elements.length );
    console.log( 'Connections: ' + response.connections.length );

    res .header("Content-Type",'application/json')
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "X-Requested-With")
        .send(JSON.stringify(response, null, 4));
  }
  catch(err) {
    console.log(err);
    res.end();
  }

};
