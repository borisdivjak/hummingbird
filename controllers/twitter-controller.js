var Twitter = require('twit')
 
var twit = new Twitter({
  consumer_key:         process.env.TW_API_KEY,
  consumer_secret:      process.env.TW_API_SECRET,
  access_token:         process.env.TW_TOKEN,
  access_token_secret:  process.env.TW_TOKEN_SECRET
})
 
  
exports.twitterSearch = function(req, res) {
twit.get('search/tweets', { q: '#servicedesign since:2020-05-28', count: 500 }) 
  .catch(function (err) {
    console.log('caught error', err.stack)
    res.end();
  })
  .then(function (result) {
    // `result` is an Object with keys "data" and "resp".
    // See https://github.com/ttezel/twit#tgetpath-params-callback for details.
 
    res.send("Number of retrieved tweets: " + result.data.statuses.length.toString());
  })
};