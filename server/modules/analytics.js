
const CoinMarketCap = require("node-coinmarketcap");
const coinmarketcap = new CoinMarketCap();
const CronJob = require('cron').CronJob;

const {google} = require('googleapis');

const key = require('../config/coinmarketpedia-39653f23f246.json');
const VIEW_ID = 'ga:168586947';

var jwtClient = new google.auth.JWT(
  key.client_email, null, key.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'], null);
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  }
  var analytics = google.analytics('v3');
  queryData(analytics);
});


function queryData(analytics) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': VIEW_ID,
    'metrics': 'ga:uniquePageviews',
    'dimensions': 'ga:pagePath',
    'start-date': '3daysAgo',
    'end-date': 'today',
    'sort': '-ga:uniquePageviews',
    'max-results': 6,
    'filters': 'ga:pagePath=~/coin/',
  }, function (err, response) {
    if (err) {
      console.log(err);
      return;
    }

    row = response.data.rows
  });
}

// refresh uniquepageviews
var row = []
new CronJob('00 00 * * * *', function() {
  function queryData(analytics) {
    analytics.data.ga.get({
      'auth': jwtClient,
      'ids': VIEW_ID,
      'metrics': 'ga:uniquePageviews',
      'dimensions': 'ga:pagePath',
      'start-date': '3daysAgo',
      'end-date': 'today',
      'sort': '-ga:uniquePageviews',
      'max-results': 6,
      'filters': 'ga:pagePath=~/coin/',
    }, function (err, response) {
      if (err) {
        console.log(err);
        return;
      }


      response.data.rows.map(coin => {
        var name = coin[0]
        const coinname = name.substring(6,name.length);

        coinList.push({coinname: coinname});


      })
    });
  }


}, null, true, 'America/Los_Angeles');




var coinList = [{coinname:'genesis-vision'},{coinname:'bitcoin'},{coinname:'ethereum'},{coinname:'district0x'}]

new CronJob('0 01 * * * *', function() {

  if (coinList.length >= 4){
    coinList = [];
    row.map(coin => {
      var name = coin[0]
      const coinname = name.substring(6,name.length);
      coinList.push({coinname: coinname});


    })
  } else {
    row.map(coin => {
      var name = coin[0]

      const coinname = name.substring(6,name.length);

      coinList.push({coinname: coinname});


    })
  }

}, null, true, 'America/Los_Angeles');



module.exports = coinList;
