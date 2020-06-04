var hummmconfig = {
  twitter_trackers: [
    {
      id:           '1',
      name:         'Service design UK',
      parameters: {
        q:            '#servicedesign OR "service design" OR "designing services" OR "designing public services" OR "digital discovery" OR "design research" OR "user research" OR "user centred" OR "human centred" OR "user-centred" OR "human-centred" OR "experience design"', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },
    {
      id:           '2',
      name:         'Ruby on Rails UK',
      parameters: {
        q:            '"ruby on rails" OR #rubyonrails', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },            
    {
      id:           'ubxd',
      name:         'Unboxed tweets and mentions',
      parameters: {
        q:            'from:ubxd OR to:ubxd OR @ubxd', 
      }
    }            
  ]
}
  

module.exports = hummmconfig;