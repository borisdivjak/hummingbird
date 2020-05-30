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
    "created_at": "Fri May 29 10:28:21 +0000 2020",
    "id": 1266315435223507000,
    "id_str": "1266315435223506944",
    "text": "RT @icoo: Find out where we're (@Ubxd) at with building a more efficient and user-centred back office planning system by checking out this…",
    "truncated": false,
    "entities": {
      "hashtags": [],
      "symbols": [],
      "user_mentions": [
        {
          "screen_name": "icoo",
          "name": "Michelle Isme",
          "id": 831531,
          "id_str": "831531",
          "indices": [
            3,
            8
          ]
        },
        {
          "screen_name": "Ubxd",
          "name": "Unboxed",
          "id": 46690889,
          "id_str": "46690889",
          "indices": [
            32,
            37
          ]
        }
      ],
      "urls": []
    },
    "metadata": {
      "iso_language_code": "en",
      "result_type": "recent"
    },
    "source": "<a href=\"http://twitter.com/download/iphone\" rel=\"nofollow\">Twitter for iPhone</a>",
    "in_reply_to_status_id": null,
    "in_reply_to_status_id_str": null,
    "in_reply_to_user_id": null,
    "in_reply_to_user_id_str": null,
    "in_reply_to_screen_name": null,
    "user": {
      "id": 46690889,
      "id_str": "46690889",
      "name": "Unboxed",
      "screen_name": "Ubxd",
      "location": "London, E1",
      "description": "A service design and digital product development agency. Agile, service design and Ruby on Rails experts. Working with @sh24_nhs, @char_gy, @GSTTnhs and others.",
      "url": "https://t.co/i54B2Hkq3Q",
      "entities": {
        "url": {
          "urls": [
            {
              "url": "https://t.co/i54B2Hkq3Q",
              "expanded_url": "http://unboxed.co",
              "display_url": "unboxed.co",
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
      "followers_count": 3272,
      "friends_count": 1990,
      "listed_count": 157,
      "created_at": "Fri Jun 12 16:40:52 +0000 2009",
      "favourites_count": 1275,
      "utc_offset": null,
      "time_zone": null,
      "geo_enabled": true,
      "verified": false,
      "statuses_count": 3754,
      "lang": null,
      "contributors_enabled": false,
      "is_translator": false,
      "is_translation_enabled": false,
      "profile_background_color": "F5F8FA",
      "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
      "profile_background_tile": false,
      "profile_image_url": "http://pbs.twimg.com/profile_images/892012646073069572/jkgPdXuh_normal.jpg",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/892012646073069572/jkgPdXuh_normal.jpg",
      "profile_banner_url": "https://pbs.twimg.com/profile_banners/46690889/1580303482",
      "profile_link_color": "923384",
      "profile_sidebar_border_color": "FFFFFF",
      "profile_sidebar_fill_color": "FFFFFF",
      "profile_text_color": "92278E",
      "profile_use_background_image": true,
      "has_extended_profile": false,
      "default_profile": false,
      "default_profile_image": false,
      "following": true,
      "follow_request_sent": false,
      "notifications": false,
      "translator_type": "none"
    },
    "geo": null,
    "coordinates": null,
    "place": null,
    "contributors": null,
    "retweeted_status": {
      "created_at": "Fri May 29 10:27:52 +0000 2020",
      "id": 1266315315383804000,
      "id_str": "1266315315383803906",
      "text": "Find out where we're (@Ubxd) at with building a more efficient and user-centred back office planning system by chec… https://t.co/qTqZ9oxSw9",
      "truncated": true,
      "entities": {
        "hashtags": [],
        "symbols": [],
        "user_mentions": [
          {
            "screen_name": "Ubxd",
            "name": "Unboxed",
            "id": 46690889,
            "id_str": "46690889",
            "indices": [
              22,
              27
            ]
          }
        ],
        "urls": [
          {
            "url": "https://t.co/qTqZ9oxSw9",
            "expanded_url": "https://twitter.com/i/web/status/1266315315383803906",
            "display_url": "twitter.com/i/web/status/1…",
            "indices": [
              117,
              140
            ]
          }
        ]
      },
      "metadata": {
        "iso_language_code": "en",
        "result_type": "recent"
      },
      "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>",
      "in_reply_to_status_id": null,
      "in_reply_to_status_id_str": null,
      "in_reply_to_user_id": null,
      "in_reply_to_user_id_str": null,
      "in_reply_to_screen_name": null,
      "user": {
        "id": 831531,
        "id_str": "831531",
        "name": "Michelle Isme",
        "screen_name": "icoo",
        "location": "London",
        "description": "Northerner in the big smoke... Traveling, learning, exploring (◍•ᴗ•◍). Senior Product person. Previously: Product consultant, GDS, tech start-up...",
        "url": null,
        "entities": {
          "description": {
            "urls": []
          }
        },
        "protected": false,
        "followers_count": 1896,
        "friends_count": 2456,
        "listed_count": 146,
        "created_at": "Fri Mar 09 13:29:28 +0000 2007",
        "favourites_count": 7676,
        "utc_offset": null,
        "time_zone": null,
        "geo_enabled": true,
        "verified": false,
        "statuses_count": 10070,
        "lang": null,
        "contributors_enabled": false,
        "is_translator": false,
        "is_translation_enabled": false,
        "profile_background_color": "FFFFFF",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme17/bg.gif",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme17/bg.gif",
        "profile_background_tile": true,
        "profile_image_url": "http://pbs.twimg.com/profile_images/1201131573443256320/cr_HMn5h_normal.jpg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/1201131573443256320/cr_HMn5h_normal.jpg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/831531/1562259523",
        "profile_link_color": "1B95E0",
        "profile_sidebar_border_color": "000000",
        "profile_sidebar_fill_color": "8ACAB9",
        "profile_text_color": "CC3366",
        "profile_use_background_image": true,
        "has_extended_profile": true,
        "default_profile": false,
        "default_profile_image": false,
        "following": true,
        "follow_request_sent": false,
        "notifications": false,
        "translator_type": "none"
      },
      "geo": null,
      "coordinates": null,
      "place": null,
      "contributors": null,
      "is_quote_status": true,
      "quoted_status_id": 1266109765844906000,
      "quoted_status_id_str": "1266109765844905984",
      "quoted_status": {
        "created_at": "Thu May 28 20:51:06 +0000 2020",
        "id": 1266109765844906000,
        "id_str": "1266109765844905984",
        "text": "I thought I'd go gently into the Medium... and just published BoPS: The  story of a back office planning system https://t.co/AD5fnPDdKM",
        "truncated": false,
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [],
          "urls": [
            {
              "url": "https://t.co/AD5fnPDdKM",
              "expanded_url": "https://link.medium.com/NeSTGG6GR6",
              "display_url": "link.medium.com/NeSTGG6GR6",
              "indices": [
                112,
                135
              ]
            }
          ]
        },
        "metadata": {
          "iso_language_code": "en",
          "result_type": "recent"
        },
        "source": "<a href=\"http://twitter.com\" rel=\"nofollow\">Twitter Web Client</a>",
        "in_reply_to_status_id": null,
        "in_reply_to_status_id_str": null,
        "in_reply_to_user_id": null,
        "in_reply_to_user_id_str": null,
        "in_reply_to_screen_name": null,
        "user": {
          "id": 1073181279804383200,
          "id_str": "1073181279804383232",
          "name": "Jack Ricketts",
          "screen_name": "JackRicketts8",
          "location": "SE1",
          "description": "Town Planner",
          "url": "https://t.co/K3DVZ6cghz",
          "entities": {
            "url": {
              "urls": [
                {
                  "url": "https://t.co/K3DVZ6cghz",
                  "expanded_url": "http://www.southwark.gov.uk/innovate",
                  "display_url": "southwark.gov.uk/innovate",
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
          "followers_count": 237,
          "friends_count": 187,
          "listed_count": 4,
          "created_at": "Thu Dec 13 11:42:10 +0000 2018",
          "favourites_count": 518,
          "utc_offset": null,
          "time_zone": null,
          "geo_enabled": false,
          "verified": false,
          "statuses_count": 347,
          "lang": null,
          "contributors_enabled": false,
          "is_translator": false,
          "is_translation_enabled": false,
          "profile_background_color": "F5F8FA",
          "profile_background_image_url": null,
          "profile_background_image_url_https": null,
          "profile_background_tile": false,
          "profile_image_url": "http://pbs.twimg.com/profile_images/1178260559189434369/KVL8tHX0_normal.jpg",
          "profile_image_url_https": "https://pbs.twimg.com/profile_images/1178260559189434369/KVL8tHX0_normal.jpg",
          "profile_banner_url": "https://pbs.twimg.com/profile_banners/1073181279804383232/1569754184",
          "profile_link_color": "1DA1F2",
          "profile_sidebar_border_color": "C0DEED",
          "profile_sidebar_fill_color": "DDEEF6",
          "profile_text_color": "333333",
          "profile_use_background_image": true,
          "has_extended_profile": false,
          "default_profile": true,
          "default_profile_image": false,
          "following": true,
          "follow_request_sent": false,
          "notifications": false,
          "translator_type": "none"
        },
        "geo": null,
        "coordinates": null,
        "place": null,
        "contributors": null,
        "is_quote_status": false,
        "retweet_count": 7,
        "favorite_count": 11,
        "favorited": false,
        "retweeted": false,
        "possibly_sensitive": false,
        "lang": "en"
      },
      "retweet_count": 2,
      "favorite_count": 5,
      "favorited": false,
      "retweeted": false,
      "possibly_sensitive": false,
      "lang": "en"
    },
    "is_quote_status": true,
    "quoted_status_id": 1266109765844906000,
    "quoted_status_id_str": "1266109765844905984",
    "retweet_count": 2,
    "favorite_count": 0,
    "favorited": false,
    "retweeted": false,
    "lang": "en"
  }
]

*/