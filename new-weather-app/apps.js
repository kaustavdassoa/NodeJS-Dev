const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl)
.then((response)=>{

  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`;
  console.log('Address '+response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
})
.then((response)=>{
  //console.log(response);
  console.log("wether Summary :"+response.data.daily.summary);
//  console.log("wether Summary :"+response.data.currently.summary);

})
.catch((error)=>{
 console.log('Something went wrong :'+error);

});
