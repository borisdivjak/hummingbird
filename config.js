var hummmconfig = {
  twitter_trackers: [
    {
      id:           '1',
      name:         'Service design UK (searching keywords and hashtags)',
      type:         'search',
      parameters: {
        q:            '#servicedesign OR "service design" OR "designing services" OR "designing public services" OR "digital discovery" OR "design research" OR "user research" OR "user centred" OR "human centred" OR "user-centred" OR "human-centred" OR "experience design"', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },
    {
      id:           'sdmelb',
      name:         'Service design Melbourne',
      type:         'search',
      parameters: {
        q:            '#servicedesign OR "service design" OR "designing services" OR "designing public services" OR "digital discovery" OR "design research" OR "user research" OR "user centred" OR "human centred" OR "user-centred" OR "human-centred" OR "experience design"', 
        geocode:      '"-37.79 144.98 200km"'
      }
    },
    {
      id:           '2',
      name:         'Ruby on Rails UK (limited to searching #rubyonrails at the moment)',
      type:         'search',
      parameters: {
        q:            '"ruby on rails" OR #rubyonrails OR from:lrug OR @lrug', 
        geocode:      '"52.5 -1.5 200km"'
      }
    },            
    {
      id:           'lrug',
      name:         'El Rug',
      type:         'timeline',
      parameters: {
        screen_name: 'lrug', 
      }
    },            
    {
      id:           'ubxdt',
      name:         'Unboxed tweets and mentions',
      type:         'timeline',
      parameters: {
        screen_name: 'ubxd', 
      }
    },
    {
      id:           'LDgovUK',
      name:         'Local Digital Collaboration Unit - tweets and mentions ',
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
      name:         '@LeedsCC_News tweets and mentions',
      type:         'timeline',
      parameters: {
        screen_name: 'LeedsCC_News', 
      }
    },
    {
      id:           'Leeds 2',
      name:         'Leeds digital (keyword search for "leeds and digital")',
      type:         'search',
      parameters: {
        q: 'leeds digital', 
      }
    },
    {
      id:           'Leeds 3',
      name:         'Leeds.gov (keyword search for "leeds.gov")',
      type:         'search',
      parameters: {
        q: 'leeds.gov', 
      }
    },
    {
      id:           'Leeds 4',
      name:         '@leedsgovdesign tweets and mentions',
      type:         'timeline',
      parameters: {
        screen_name: 'leedsgovdesign', 
      }
    },
    {
      id:           'DXW',
      name:         'DXW tweets and mentions',
      type:         'timeline',
      parameters: {
        screen_name: 'dxw', 
      }
    },
    {
      id:           'k_grace',
      name:         'Kathryn Grace - tweets and mentions',
      type:         'timeline',
      parameters: {
        screen_name: 'IamKathrynGrace', 
      }
    },
    {
      id:           'hact',
      name:         'HACT - tweets and mentions',
      type:         'timeline',
      parameters: {
        screen_name: 'hacthousing', 
      }
    },
    {
      id:           'local_gov_list',
      name:         'Jo\'s local gov list',
      type:         'list',
      parameters: {
        list_id: '1235246896605732868', 
      }
    },
    {
      id:           'incl_recruit',
      name:         'Inclusive recruitment',
      type:         'list',
      parameters: {
        list_id: '1283063796827852800', 
      }
    }
  ],
  top_list_limit: 20
}
  

module.exports = hummmconfig;