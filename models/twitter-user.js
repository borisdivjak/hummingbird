var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// NOTE: we use Strings for twitter IDs, because they are too big to store as Numbers
// Javascript can only handle 53 bit integers, and Twitter IDs are 64 bit

var TwitterUserSchema = new Schema(
  {
    created_at:       { type: Date, required: true },
    id_str:           { type: String, unique: true, required: true }, 
    screen_name:      { type: String, unique: true, required: true },
    name:             { type: String, required: true },
    location:         { type: String },
    description:      { type: String },
    followers_count:  { type: Number },
    verified:         { type: Boolean },
    entities: {
      url: {
        urls: [{
          expanded_url:  { type: String },
          display_url:   { type: String }
        }]
      }
    },
    profile_image_url:  { type: String }
  }
);

TwitterUserSchema.statics.getUsersByScreenName = function( screen_name ) {
  return this.find({'screen_name': { $in: screen_name }});
}

TwitterUserSchema.methods.equalsUserData = function( user_data ) {
  if (
    this.id_str             ===    user_data.id_str           &&
    this.screen_name        ===    user_data.screen_name      &&
    this.name               ===    user_data.name             &&
    this.location           ===    user_data.location         &&
    this.description        ===    user_data.description      &&
    this.followers_count    ===    user_data.followers_count  &&
    this.profile_image_url  ===    user_data.profile_image_url
  ) {
    return true;
  }
  else return false;
}

TwitterUserSchema.plugin(uniqueValidator);


//Export model
module.exports = mongoose.model('TwitterUser', TwitterUserSchema);;