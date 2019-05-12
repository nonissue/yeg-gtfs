var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

// If you want to view the data from a different request
// Just uncomment the one you want to view and make sure
// the other two are commented
var requestSettings = {
  method: 'GET',
  // trip updates:
  url: 'https://data.edmonton.ca/download/uzpc-8bnm/application%2Foctet-stream',

  // vehicle positions:
  //url: 'https://data.edmonton.ca/download/7qed-k2fc/application%2Foctet-stream',

  // trip alerts:
  // url: 'https://data.edmonton.ca/download/rqaa-jae6/application%2Foctet-stream',
  encoding: null,
};
request(requestSettings, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    var filtered = [];
    feed.entity.forEach(function(entity) {
      if (entity) {
        var tripJson = entity.toJSON();
        var tripStops = tripJson.tripUpdate.stopTimeUpdate;
        tripStops.filter(stop => {
          // search for a specific stop
          // I picked the one below at random
          if (stop.stopId === '3121') {
            filtered.push(stop);
          }
        });
      }
    });
    console.log(filtered);
  } else if (error) {
    console.log('error!');
  } else {
    console.log('Request failed?');
  }
});

// console.log("Fetching data...")
