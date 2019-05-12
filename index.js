var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

const dataEndpoints = [
  { name: 'tripUpdates', url: 'https://data.edmonton.ca/download/uzpc-8bnm/application%2Foctet-stream'},
  { name: 'vehiclePos', url: 'https://data.edmonton.ca/download/7qed-k2fc/application%2Foctet-stream'},
  { name: 'alerts', url: 'https://data.edmonton.ca/download/rqaa-jae6/application%2Foctet-stream'},
]

function getData(url) {
  const requestSettings = {
    method: 'GET',
    url: url,
    encoding: null,
  };
  
  request(requestSettings, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      var filtered = [];
      feed.entity.forEach(function(entity) {
        // console.log(entity)
        if (entity) {
          var resJSON = entity.toJSON();
          if (resJSON.tripUpdate) {
            var tripStops = resJSON.tripUpdate.stopTimeUpdate;
            tripStops.filter(stop => {
              // search for a specific stop
              // I picked the one below at random
              if (stop.stopId) {
                filtered.push(stop);
              }
            });
          } else {
            console.log(resJSON);
          }
        }
      });
      if (filtered.length != 0) {
        console.log(filtered);
      }
    } else if (error) {
      console.log('error!');
    } else {
      console.log('Request failed?');
    }
  });
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  `\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ Which data do you want?\t\t┃\n┃ Enter 1, 2 or 3 \t\t\t┃\n┃ 1: tripUpdates, 2: vehicle, 3: alerts ┃ \n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n-> `,
  dataType => {
    console.log(`Fetching ${dataEndpoints[parseInt(dataType) - 1].name}!`);
    getData(dataEndpoints[parseInt(dataType) - 1].url);
    readline.close();
  }
);
