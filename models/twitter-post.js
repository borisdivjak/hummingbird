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
    in_reply_to_status_id_str:  { type: String },
    in_reply_to_user_id_str:    { type: String },
    in_reply_to_screen_name:    { type: String },
    quoted_status_id_str:       { type: String },
    retweeted_status: {
      id_str:       { type: String }
    }
  }
);

TwitterPostSchema.plugin(uniqueValidator);


//Export model
var exports = {};

config.twitter_trackers.forEach(tracker => {
  exports[tracker.id] = mongoose.model('TwitterPost_' + tracker.id, TwitterPostSchema, 'twitterposts_' + tracker.id);
});

module.exports = exports;