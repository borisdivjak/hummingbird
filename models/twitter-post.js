var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var TwitterPostSchema = new Schema(
  {
    created_at:   { type: Date, required: true },
    id:           { type: Number, unique: true, required: true }, 
    full_text:    { type: String, max: 280, required: true }
/*
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
*/
  }
);

TwitterPostSchema.plugin(uniqueValidator);


//Export model
module.exports = mongoose.model('TwitterPost', TwitterPostSchema);




/*
  
  EXAMPLE API OUTPUT FOR A TWEET
  
[
  {
    "created_at": "Sat May 30 11:00:08 +0000 2020",
    "id": 1266685820574093300,
    "id_str": "1266685820574093312",
    "full_text": "As the UK Government tests the NHS Track and Trace app, we look back on the 10 fundamental principles of designing services in a crisis by Lou Downe, Director of Housing and Land Transformation for the UK Government: https://t.co/aVyQGuPKo7 https://t.co/EFrNH95chO",
    "truncated": false,
    "display_text_range": [
      0,
      240
    ],
    "entities": {
      "hashtags": [],
      "symbols": [],
      "user_mentions": [],
      "urls": [
        {
          "url": "https://t.co/aVyQGuPKo7",
          "expanded_url": "https://fal.cn/38mW3",
          "display_url": "fal.cn/38mW3",
          "indices": [
            217,
            240
          ]
        }
      ],
      "media": [
        {
          "id": 1266685817445113900,
          "id_str": "1266685817445113856",
          "indices": [
            241,
            264
          ],
          "media_url": "http://pbs.twimg.com/media/EZQsCi7XYAAk3rc.jpg",
          "media_url_https": "https://pbs.twimg.com/media/EZQsCi7XYAAk3rc.jpg",
          "url": "https://t.co/EFrNH95chO",
          "display_url": "pic.twitter.com/EFrNH95chO",
          "expanded_url": "https://twitter.com/dandad/status/1266685820574093312/photo/1",
          "type": "photo",
          "sizes": {
            "medium": {
              "w": 700,
              "h": 474,
              "resize": "fit"
            },
            "thumb": {
              "w": 150,
              "h": 150,
              "resize": "crop"
            },
            "small": {
              "w": 680,
              "h": 460,
              "resize": "fit"
            },
            "large": {
              "w": 700,
              "h": 474,
              "resize": "fit"
            }
          }
        }
      ]
    },
    "extended_entities": {
      "media": [
        {
          "id": 1266685817445113900,
          "id_str": "1266685817445113856",
          "indices": [
            241,
            264
          ],
          "media_url": "http://pbs.twimg.com/media/EZQsCi7XYAAk3rc.jpg",
          "media_url_https": "https://pbs.twimg.com/media/EZQsCi7XYAAk3rc.jpg",
          "url": "https://t.co/EFrNH95chO",
          "display_url": "pic.twitter.com/EFrNH95chO",
          "expanded_url": "https://twitter.com/dandad/status/1266685820574093312/photo/1",
          "type": "photo",
          "sizes": {
            "medium": {
              "w": 700,
              "h": 474,
              "resize": "fit"
            },
            "thumb": {
              "w": 150,
              "h": 150,
              "resize": "crop"
            },
            "small": {
              "w": 680,
              "h": 460,
              "resize": "fit"
            },
            "large": {
              "w": 700,
              "h": 474,
              "resize": "fit"
            }
          }
        }
      ]
    },
    "metadata": {
      "iso_language_code": "en",
      "result_type": "recent"
    },
    "source": "<a href=\"http://www.falcon.io\" rel=\"nofollow\">Falcon Social Media Management </a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
      "id": 16631172,
      "id_str": "16631172",
      "name": "D&AD",
      "screen_name": "dandad",
      "location": "London, UK",
      "description": "Celebrating, inspiring and nurturing creative excellence.  Awarding the world's best in design & advertising.",
      "url": "https://t.co/k7WUtQHCtv",
      "entities": {
        "url": {
          "urls": [
            {
              "url": "https://t.co/k7WUtQHCtv",
              "expanded_url": "https://www.dandad.org/",
              "display_url": "dandad.org",
              "indices": [
                0,
                23
              ]
            }
          ]
        },
        "description": {
          "urls": []
        }
      },
      "protected": false,
      "followers_count": 179942,
      "friends_count": 12709,
      "listed_count": 4006,
      "created_at": "Tue Oct 07 15:23:45 +0000 2008",
      "favourites_count": 8466,
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": true,
      "verified": true,
      "statuses_count": 27046,
      "lang": null,
      "contributors_enabled": false,
      "is_translator": false,
      "is_translation_enabled": false,
      "profile_background_color": "FFFFFF",
      "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_tile": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/654399937724194816/P5NUvPJb_normal.png",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/654399937724194816/P5NUvPJb_normal.png",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/16631172/1586878757",
      "profile_link_color": "FAB81E",
      "profile_sidebar_border_color": "FFFFFF",
      "profile_sidebar_fill_color": "F2F2F2",
      "profile_text_color": "333333",
      "profile_use_background_image": false,
      "has_extended_profile": false,
      "default_profile": false,
      "default_profile_image": false,
      "following": false,
      "follow_request_sent": false,
      "notifications": false,
      "translator_type": "none"
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "is_quote_status": false,
    "retweet_count": 0,
    "favorite_count": 0,
    "favorited": false,
    "retweeted": false,
    "possibly_sensitive": false,
    "lang": "en"
  }
]
*/