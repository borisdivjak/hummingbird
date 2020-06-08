var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var config = require('../config.js')

var Schema = mongoose.Schema;

// NOTE: we use Strings for twitter IDs, because they are too big to store as Numbers
// Javascript can only handle 53 bit integers, and Twitter IDs are 64 bit

var TwitterPostSchema = new Schema(
  {
    created_at:       { type: Date, required: true, index: true },
    id_str:           { type: String, unique: true, required: true }, 
    full_text:        { type: String, required: true },
    entities: {
      hashtags: [{
        text:         { type: String }
      }],
      user_mentions: [{
        screen_name:  { type: String },
        id_str:       { type: String }
      }]
    },
    user: {
      screen_name:  { type: String },
      id_str:       { type: String }
    },

    // comments - replies but not retweets
    in_reply_to_status_id_str:  { type: String },
    in_reply_to_user_id_str:    { type: String },
    in_reply_to_screen_name:    { type: String },

    // retweets with comments
    quoted_status: {
      id_str:         { type: String },
      user: {
        screen_name:  { type: String },
        id_str:       { type: String }
      }
    },

    // retweets without comments
    retweeted_status: {
      id_str:       { type: String },
      user: {
        screen_name:  { type: String },
        id_str:       { type: String }
      }
    }
  }
);

TwitterPostSchema.statics.getTopPosters = function() {
  return this.aggregate([
    { $group: { _id: '$user.id_str', screen_name: { $first: '$user.screen_name' },  count: { $sum: 1 }}},
    { $sort : { count : -1 } },
    { $limit: 10 }
  ]);
}

TwitterPostSchema.statics.getTopHashtags = function() {
  return this.aggregate([
    { $unwind: '$entities.hashtags' },
    { $group: { _id: { $toLower: '$entities.hashtags.text' }, text: { $first: '$entities.hashtags.text' },  count: { $sum: 1 }}},
    { $sort : { count : -1 } },
    { $limit: 10 }
  ]);
}

TwitterPostSchema.statics.getTopMentions = function() {
  return this.aggregate([
    { $unwind: '$entities.user_mentions' },
    { $group: { _id: '$entities.user_mentions.id_str', screen_name: { $first: '$entities.user_mentions.screen_name' },  count: { $sum: 1 }}},
    { $sort : { count : -1 } },
    { $limit: 10 }
  ]);
}

TwitterPostSchema.statics.getTopRetweeted = function() {
  return this.aggregate([
    { $project: { user_screen_name: { $setUnion: [ ['$retweeted_status.user.screen_name' ], ['$quoted_status.user.screen_name' ]] }}},
    { $unwind: '$user_screen_name' },
    { $match: { 'user_screen_name': { $exists: true, $ne: null }}},
    { $group: { _id: '$user_screen_name', screen_name: { $first: '$user_screen_name' },  count: { $sum: 1 }}},
    { $sort : { count : -1 } },
    { $limit: 10 }
  ]);
}

TwitterPostSchema.statics.getTopRetweetedOrMentioned = function() {
  return this.aggregate([
    { $project: { user_screen_name: { $setUnion: [ '$entities.user_mentions.screen_name', ['$retweeted_status.user.screen_name' ], ['$quoted_status.user.screen_name' ]] }}},
    { $unwind: '$user_screen_name' },
    { $match: { 'user_screen_name': { $exists: true, $ne: null }}},
    { $group: { _id: '$user_screen_name', screen_name: { $first: '$user_screen_name' },  count: { $sum: 1 }}},
    { $sort : { count : -1 } },
    { $limit: 10 }
  ]);
}

TwitterPostSchema.statics.getUserConnections = function() {
  return this.aggregate([
    
    // create list of screen names that posted the tweets
    { $project: { id_str  : '$id_str', user_screen_name: '$user.screen_name' }},

    // then create a list of everyone that was mentioned or retweeted in their tweets
    { $lookup : {
        from : this.collection.name,
        let : { start_id: '$id_str'},
        pipeline: [
          { $match: { $expr: { $eq: [ '$id_str', '$$start_id' ] }}},
          { $project: { id_str: '$id_str', user_screen_name: { $setUnion: [ '$entities.user_mentions.screen_name', ['$retweeted_status.user.screen_name' ], ['$quoted_status.user.screen_name' ]] }}},
          { $unwind: '$user_screen_name' }
        ],
        as : "linked_to"
    }},
    { $unwind: '$linked_to' },
    { $match: { $expr: { $ne: [ '$linked_to.user_screen_name', null ] }}},
    
    // then count all occurences of distinc pairs
    { $group: { 
      _id: { $concat: ['$user_screen_name',' ','$linked_to.user_screen_name' ] }, 
      screen_name_1: { $first: '$user_screen_name' }, 
      screen_name_2: { $first: '$linked_to.user_screen_name' }, 
      count: { $sum: 1 }
    }},
    { $sort : { count : -1 } },
    { $limit: 10000 }
  ]);
}


// return users screen_names across all posts ... both posting and just mentioned

TwitterPostSchema.statics.getAllScreenNames = async function() {
  var screen_names = [];

  try {
    var screen_names = await this.aggregate([
      { $project: { user_screen_name: { $setUnion: [ '$entities.user_mentions.screen_name', ['$user.screen_name' ], ['$retweeted_status.user.screen_name' ], ['$quoted_status.user.screen_name' ]] }}},
      { $unwind: '$user_screen_name' },
      
      // remove all null 
      { $match: { $expr: { $ne: [ '$user_screen_name', null ] }}},
      
      // make a set ... remove duplicates
      { $group: { 
        _id: { $concat: '$user_screen_name' }
      }},
      { $sort : { count : -1 } },
      { $limit: 10000 }
    ]);
  }
  catch(err) {
    console.log('Error in TwitterPostSchema.statics.getAllScreenNames');
    console.log(err.message);
  }
  
  // return array of strings (names) rather than array of objects
  return screen_names.map( name => name._id );
}


TwitterPostSchema.plugin(uniqueValidator);


//Export model
var exports = {};

config.twitter_trackers.forEach(tracker => {
  exports[tracker.id] = mongoose.model('TwitterPost_' + tracker.id, TwitterPostSchema, 'twitterposts_' + tracker.id);
});

module.exports = exports;