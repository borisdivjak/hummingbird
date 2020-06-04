var config = require('../config.js');
var TwitterPost = require('../models/twitter-post.js');


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
    var connections   = await TwitterPost[tracker.id].getUserConnections();
    var elements_1 = connections.map( connection => connection.screen_name_1 );
    var elements_2 = connections.map( connection => connection.screen_name_2 );
    var elements = [...new Set(elements_1, elements_2)];

    var response = {
      elements: elements.map( element => {
        return { 
          label: element 
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
        .send(JSON.stringify(response, null, 4));
  }
  catch(err) {
    console.log(err);
    res.end();
  }

};
