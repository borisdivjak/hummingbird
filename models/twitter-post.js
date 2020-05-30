var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var TwitterPostSchema = new Schema(
  {
    created_at:       { type: Date, required: true },
    id:               { type: Number, unique: true, required: true }, 
    full_text:        { type: String, maxlength: 280, required: true },
    entities: {
      hashtags: [{
        text:         { type: String }
      }],
      user_mentions: [{
        screen_name:  { type: String },
        id:           { type: Number }
      }]
    }
  }
);

TwitterPostSchema.plugin(uniqueValidator);


//Export model
module.exports = mongoose.model('TwitterPost', TwitterPostSchema);