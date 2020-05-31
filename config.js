var hummmconfig = {
  twitter_trackers: [
    {
      id:           1,
      name:         'service design tracker',
      parameters: {
        q:            '#servicedesign OR "service design"', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },
    {
      id:           2,
      name:         'rails tracker',
      parameters: {
        q:            '"ruby on rails"', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },            
    {
      id:           'ubxd',
      name:         'from ubxd',
      parameters: {
        q:            'from:ubxd', 
      }
    }            
  ]
}
  

module.exports = hummmconfig;