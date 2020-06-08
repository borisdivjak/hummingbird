var hummmconfig = {
  twitter_trackers: [
    {
      id:           '1',
      name:         'Service design UK',
      type:         'search',
      parameters: {
        q:            '#servicedesign OR "service design" OR "designing services" OR "designing public services" OR "digital discovery" OR "design research" OR "user research" OR "user centred" OR "human centred" OR "user-centred" OR "human-centred" OR "experience design"', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },
    {
      id:           '2',
      name:         'Ruby on Rails UK',
      type:         'search',
      parameters: {
        q:            '"ruby on rails" OR #rubyonrails', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },            
    {
      id:           'ubxd',
      name:         'Unboxed tweets and mentions',
      type:         'search',
      parameters: {
        q:            'from:ubxd OR to:ubxd OR @ubxd', 
      }
    },            
    {
      id:           'ubxdt',
      name:         'Unboxed timeline',
      type:         'timeline',
      parameters: {
        screen_name: 'ubxd', 
      }
    },
    {
      id:           'LDgovUK',
      name:         'Local Gov Digital',
      type:         'timeline',
      parameters: {
        screen_name: 'LDgovUK', 
        // timeline also calls a search query, so we can specify it here
        q:           'digital localgov OR "local digital" OR #localdigital OR @LDgovUK OR @LocalGovDigital', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },
    {
      id:           'Leeds 1',
      name:         'LeedsCC_News: timeline',
      type:         'timeline',
      parameters: {
        screen_name: 'LeedsCC_News', 
      }
    },
    {
      id:           'Leeds 2',
      name:         'Search: leeds digital',
      type:         'search',
      parameters: {
        q: 'leeds digital', 
      }
    },
    {
      id:           'Leeds 3',
      name:         'Search: leeds.gov',
      type:         'search',
      parameters: {
        q: 'leeds.gov', 
      }
    },
    {
      id:           'Leeds 4',
      name:         '@leedsgovdesign',
      type:         'timeline',
      parameters: {
        screen_name: 'leedsgovdesign', 
      }
    },
    {
      id:           'DXW',
      name:         'DXW',
      type:         'timeline',
      parameters: {
        screen_name: 'dxw', 
      }
    },
    {
      id:           'k_grace',
      name:         'Kathryn Grace',
      type:         'timeline',
      parameters: {
        screen_name: 'IamKathrynGrace', 
      }
    },
    {
      id:           'hact',
      name:         'HACT',
      type:         'timeline',
      parameters: {
        screen_name: 'hacthousing', 
      }
    }
    
    
    
  ]
}
  

module.exports = hummmconfig;