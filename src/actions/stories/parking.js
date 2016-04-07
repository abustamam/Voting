module.exports = function(pollingPlace){
  'use strict';
  debugger;
  var site = pollingPlace;
  var mainParking = site.sec_1;
  var moreParking = site['sec_1.2'];
  var dropOff = site['sec_1.1'];
  var response = { summary: 'There is no parking lot.', warnings: new Set() };
  
  var hasParkingLot = mainParking.answer === 'Yes' ? true : false;
  var hasVanParking = mainParking.qid_3a.answer === 'Yes' ? true : false;
  var hasCarParking = mainParking.qid_3b.answer === 'Yes' ? true : false;
  var numVanParking = mainParking.qid_3a.data || 0;
  var numCarParking = mainParking.qid_3b.data || 0;
  
  if (hasVanParking && hasCarParking) {
    response.summary = 'There is a parking lot with safe and handicap-accessible van and car parking.';
  } else if (hasVanParking || hasCarParking) {
    response.summary = `There is a parking lot with safe and handicap-accissible ${hasVanParking? 'van' : 'car'} parking, `;
    if (hasVanParking >= 1 && hasCarParking >= 1) {
      let plural = ((hasVanParking && numCarParking >= 2) || (hasCarParking && numVanParking >= 2)) ? 's' : '';
      response.summary += `but only ${hasVanParking? numCarParking : numVanParking} space${plural}.`;
    } else {
      response.summary += `but no accessible ${!hasVanParking? 'van' : 'car'} spaces.`;
    }
  } else if (hasParkingLot) {
    response.summary = 'The parking lot does not have safe and handicap-accessible var or car parking spaces.';
  }
  
  var poorReadabilityISA = 'The reserved parking sign may not be visible.';

  if (hasVanParking) {
    //Accessible van parking expected, list any van-specific caveats
    if (mainParking.qid_13.answer === 'No') {
      response.warnings.add(poorReadabilityISA);
    }
  }
  if (hasCarParking) {
    //Accessible car parking expected, list any car-specific caveats. 
  }
  if (hasCarParking || hasVanParking) {
    //List caveats which apply to both van and car parking.
    if (mainParking.qid_12.answer === 'No' || mainParking.qid_14.answer === 'No' || mainParking.qid_15.answer === 'No') {
      response.warnings.add(poorReadabilityISA);
    }
    if (mainParking.qid_16.answer === 'Yes') {
      response.warnings.add('Beware wheeling or walking behind other parked cars.');
    }
    if (mainParking.qid_17.answer === 'No') {
      response.warnings.add('The path from the parking space to the entrance may be indirect.');
    }
    if (mainParking.qid_18.answer === 'No') {
      response.warnings.add('Tall vehicles (8\'2" or higher) may not park in reserved spaces.');
    }
  }
  response.warnings = Array.from(response.warnings);
  return response;
};