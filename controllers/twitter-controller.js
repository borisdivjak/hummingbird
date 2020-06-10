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

    var screen_names  = await TwitterPost[tracker.id].getAllScreenNames();
    var top_orgs      = await TwitterUser.getTopDescriptionMentions(screen_names);
      
    res.render('tracker-info', { 
        title:         tracker.name, 
        tracker:       tracker,
        top_posters:   top_posters,
        top_hashtags:  top_hashtags,
        top_rm:        top_rm,
        top_orgs:      top_orgs,
        top_list_limit: config.top_list_limit
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

    var users           = await TwitterUser.getUsersByScreenName(screen_names);
    var orgs            = await TwitterUser.getTopDescriptionMentions(screen_names, { limit: 0 });
    var orgs_lc         = orgs.map ( org => org.screen_name.toLowerCase() );
    var org_connections = await TwitterUser.getUserOrgConnections(screen_names, { orgs: orgs_lc });
    
    var response = {
      elements: users.map( user => {
        return { 
          id:           user.screen_name.toLowerCase(), 
          label:        user.name, 
          description:  user.description,
          followers_count: user.followers_count, 
          image:        user.profile_image_url_200x200,
          type:         orgs_lc.includes(user.screen_name.toLowerCase()) ? 'Organisation' : 'User',
          'twitter profile': user.screen_name,
          posted: connections.reduce( (count, connection) => { 
            // if connection mataches screen_name, increase count
            return (connection.screen_name_1.toLowerCase() == user.screen_name.toLowerCase()) ? count+1 : count;
          }, 0),
          retw_or_mentioned: connections.reduce( (count, connection) => { 
            // if connection mataches screen_name, increase count
            return (connection.screen_name_2.toLowerCase() == user.screen_name.toLowerCase()) ? count+1 : count;
          }, 0),
          has_orgs: org_connections.reduce( (count, connection) => { 
            // if connection mataches screen_name, increase count
            return (connection.user.toLowerCase() == user.screen_name.toLowerCase()) ? count+1 : count;
          }, 0)
        }
      }),
      connections: connections.map( connection => {
        return { 
          from:       connection.screen_name_1.toLowerCase(),
          to:         connection.screen_name_2.toLowerCase(),
          strength:   connection.count,
          type:       'Retweets and mentions',
          direction:  'directed'
        }   
      })
    };
    
    // if organisation connections are requested then add those to response
    if (req.query.orgs == 'true') {
      response.connections.push( ...org_connections.map( org_c => {
        return { 
          from:       org_c.user.toLowerCase(),
          to:         org_c.org.toLowerCase(),
          strength:   10,
          type:       'Organisations',
          direction:  'directed'
        }   
      }));
    }
    
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
