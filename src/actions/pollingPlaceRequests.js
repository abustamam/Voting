import request from 'superagent';

let pollingPlaceRequests = {
  mapResults: function(columns, rows){
    let result = {};
    columns.forEach(function(val, ind, arr){
      result[val] = rows[0][ind];
    });
    return result;
  },
  voter: function(house, zip, dob){
    //takes a house number, zip code, and date of birth as a Date object or in the format: 'MM/DD/YYYY'
    var p = new Promise(function(resolve, reject){
      var now = new Date();
      if (typeof dob.getMonth == 'function') {
        if (dob.getMonth() > 12 || dob.getMonth() <= 0) reject('Month was out of range: ' + dob.getMonth());
        if (dob.getDate() >= 32) reject('Date was out of range: ' + dob.getDate());
        if (dob.getFullYear() > now.getFullYear()-16 || dob.getFullYear() < now.getFullYear()-120) reject('Year was out of range: ' + dob.getFullYear());
        
        let month = dob.getMonth() <= 9 ? '' + 0 + '' + dob.getMonth() : '' + dob.getMonth();
        let date = '' + dob.getDate();
        let year = '' + dob.getFullYear();
        dob = `${month}/${date}/${year}`;
      }
      var mapResults = pollingPlaceRequests.mapResults;
      
      request
      .get('https://voterreg.saccounty.net/VREMobileAPI/api/Voter/initializeZip')
      .query({zipCode: zip})
      .query({houseNum: house})
      .query({birthDate: dob})
      .end(function(err, res){
        if (err || !res.ok) {
          reject(err);
        } else if (res.body.length !== 1) {
          reject(res.body);
        } else {
          alert('looking good!!');
          alert(JSON.stringify(res.body[0], null, '  '));
          resolve(res.body[0]);
        }
      });
    });
    return p;
  },
  place: function(pollid, apikey){
    apikey = apikey || this.props.fusionkey;
    var p = new Promise(function(resolve, reject){
      // poll address from pollname ID
      var mapResults = pollingPlaceRequests.mapResults;
      
      request
      .get('https://www.googleapis.com/fusiontables/v1/query')
      .query({sql: `SELECT  'Polling place', Address, City, Zip, Lat, Long FROM 1Sr6r-0V5njdzHp9cGNbqS5qljj9qJH7mn__HsHbL WHERE ID='${pollid}'`})
      .query({key: apikey})
      .end(function(err, res){
        if (err || !res.ok) {
          reject(err);
        } else {
          if (res.body.columns && res.body.rows && res.body.rows.length == 1) {
            resolve(mapResults(res.body.columns, res.body.rows));
          } else if (res.body.rows && res.body.rows.length > 1) {
            reject('Too many polling places were found with id: ' + pollid);
          } else reject(res.body);
        }
      });
    });
    return p;
  },
  geocode: function(location, mapboxkey, approxLat, approxLong){
    var p = new Promise(function(resolve, reject){
      mapboxkey = mapboxkey || this.props.mapboxkey;
      approxLat = approxLat || this.props.approxLat;
      approxLong = approxLong || this.props.approxLong;
      // mapbox geocode
      request
      .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(location)}.json`)
      .query({access_token: "pk.eyJ1IjoiYnJvb2tzbiIsImEiOiJjaWpkbmkzMDEwMDh3dGdra2Y0OHYwbjViIn0.gqY3_NGpI96FuDQ7csaOUw"})
      .query({proximity: `${approxLong},${approxLat}`})
      .end(function(err, res){
        if (err || !res.ok) {
          reject(err);
        } else {
          resolve(JSON.parse(res.text).features[0]);
        }
      });
    });
    return p;
  }
};

export default pollingPlaceRequests;
