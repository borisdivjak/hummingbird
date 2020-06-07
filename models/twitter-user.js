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


TwitterUserSchema.virtual('profile_image_url_200x200').get( function() {
  if (this.profile_image_url !== undefined) {
    return this.profile_image_url.replace('normal.', '200x200.'); 
  }
  else {
    return undefined;
  }
});


TwitterUserSchema.methods.equalsUserData = function( user_data ) {
  if (
    this.id_str             ===    user_data.id_str               &&
    this.screen_name        ===    user_data.screen_name          &&
    this.name               ===    user_data.name                 &&
    this.location           ===    user_data.location             &&
    this.description        ===    user_data.description          &&
    // keep follower count within tollerance of 100 ... we don't want to update DB too often
    this.followers_count    <      user_data.followers_count+100  &&
    this.followers_count    >      user_data.followers_count-100  &&
    this.profile_image_url  ===    user_data.profile_image_url
  ) {
    return true;
  }
  else return false;
}


// extract mentions / twitter handles from user's description field

TwitterUserSchema.methods.getDescriptionMentions = function() {
  return this.description.match(/\@[A-Za-z0-9_]+/g);
}


TwitterUserSchema.statics.getUsersByScreenName = function( screen_name ) {
  return this.find({'screen_name': { $in: screen_name }});
}


// go through users' descriptions to extract mentions of other accounts
// then put together top 10 list

TwitterUserSchema.statics.getTopDescriptionMentions = async function( screen_names ) {
  var users = [];
  var mentions_count = [];
  
  try {
    users = await this.find({'screen_name': { $in: screen_names }}, 'description' );

    users.forEach( user => {
      var mentions = user.getDescriptionMentions();
      
      if (mentions !== null) mentions.forEach( mention => {
        existing_mention = mentions_count.find( mnt => mnt.screen_name.toLowerCase() === mention.toLowerCase() );
        if ( existing_mention !== undefined ) existing_mention.count++;
        else {
          mentions_count.push( { screen_name: mention, count: 1 });
        }
      });
      
    });

    mentions_count.sort( (a,b) => b.count - a.count );    
    return mentions_count.slice(0,10);
  }
  catch(err) {
    console.log('Error in TwitterUserSchema.statics.getTopAssocAccounts');
    console.log(err.message);
  }
}


TwitterUserSchema.plugin(uniqueValidator);


//Export model
module.exports = mongoose.model('TwitterUser', TwitterUserSchema);;