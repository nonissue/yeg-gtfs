var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

var requestSettings = {
  method: 'GET',
  // trip updates:
  // url: 'https://data.edmonton.ca/download/uzpc-8bnm/application%2Foctet-stream',

  // vehicle positions:
  url: 'https://data.edmonton.ca/download/7qed-k2fc/application%2Foctet-stream',
  
  // alerts:
  // url: 'https://data.edmonton.ca/download/rqaa-jae6/application%2Foctet-stream',
  encoding: null
};
request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    // var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.toJSON(body);
    feed.entity.forEach(function(entity) {
      if (entity) {
        console.log(entity.toJSON());
      }
    });
  }
  if (error) {
    console.log("error!");
  };
  // console.log("Body!" + body);
});

console.log("running!")