import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import pollingPlaceRequests from '../actions/pollingPlaceRequests';
import _ from 'lodash'
import store from '../stores/pollStore.js';
import preFetchedPollingPlaces from '../map/preFetchedPollingPlaces.js'

export default class PollingPlaceForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userPpid: null,
      house: null,
      zip: null,
      dob: null,
      place: null,
      address: null,
      store: store
    };
  }

  render() {
    var caption = this.state.caption || this.props.caption;
    var addressLink = this.state.address ? <a href={'http://maps.google.com/?q='+encodeURI(this.state.address)}>➶</a> : null;

    return (
      <div className="polling-place-form-row row">
        <div className="medium-12 columns form">
          <div>
            <h1 className="title-text">Polling Place Form</h1>
          </div>
          <p>{caption} {addressLink}</p>
          <form id="polling-place-form" data-abide role="form">
            <div className="form">
              <div className="form-group">
                <label htmlFor="house">House Number</label>
                <input className="form-input" type="number" name="house" id="house" placeholder="e.g. '1234'" required onChange={this.handleHouseChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="zip">5-Digit Zip Code</label>
                <input className="form-input" type="number" name="zip" id="zip" placeholder="e.g. '54321'" required onChange={this.handleZipChange.bind(this)}/>
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth <small>(MM/DD/YYYY)</small></label>
                <input className="form-input" type="date" placeholder="MM/DD/YYYY" name="dob" id="dob" required onChange={this.handleDobChange.bind(this)}/>
              </div>
              <div className="form-group">
                <button className="form-input button" onClick = {(e) => this.handleSubmit(e)}>Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  handleSubmit(event) {
    event.preventDefault();
    pollingPlaceRequests.voter(this.state.house, this.state.zip, this.state.dob, this.props.fusionkey)
    .then((data) =>{
      if (data.MailDate && data.MailDate != '') {
        this.setState({caption: `Your absentee ballot was mailed to this address on ${data.MailDate}. You may still vote at your polling place on election day.`, mailDate: data.MailDate})
      }
      return data.PollName;
    })
    .then((pollid) =>{
      this.setState({userPpid: pollid});
      store.setPPID(pollid);
      return pollingPlaceRequests.place(pollid);
    })
    .then((place) => {
      var vals = {ppName: place['Polling place'], ppAddress: `${place.Address} ${place.City}, ${this.props.stateAbbr} ${place.Zip}`, ppLat: place.Lat, ppLong: place.Long};
      store.setVals(vals);
      this.setState({place: place['Polling place'], address: `${place.Address} ${place.City}, ${this.props.stateAbbr} ${place.Zip}`, latitude: place.Lat, longitude: place.Long});
      var caption = '';
      if (this.state.mailDate && this.state.mailDate != '') caption += `Your absentee ballot was mailed to this address on ${this.state.mailDate}. You may still vote at your polling place on election day. `;
      caption += `Your polling place is located at ${place['Polling place']}.`;
      this.setState({caption});
      if (!place.Lat || !place.Long) {
        pollingPlaceRequests.geocode(this.state.address, this.props.mapboxkey, this.props.approxLat, this.props.approxLong)
        .then((result) =>{
          this.setState({latitude: result.center[1], longitude: result.center[0]});
          store.setVals({ppLat: result.center[1], ppLong: result.center[0]});
        });
      }
    })
    .catch((err) => {
      this.setState({caption: `There was an error finding your polling place.`});
      this.setState({place: null, address: null, latitude: null, longitude: null, userPpid: null});
    });
  }
  handleHouseChange(e) {
    this.setState({house: e.target.value});
  }
  handleZipChange(e) {
    this.setState({zip: e.target.value});
  }
  handleDobChange(e) {
    this.setState({dob: e.target.value});
  }
}

PollingPlaceForm.defaultProps = {
  fusionkey: 'AIzaSyDRoMwLIG_AcxMeha5PIv9lWnM0AwWRsCM', //read-only access
  mapboxkey: 'pk.eyJ1IjoiYnJvb2tzbiIsImEiOiJjaWpkbmkzMDEwMDh3dGdra2Y0OHYwbjViIn0.gqY3_NGpI96FuDQ7csaOUw', //geocoding API
  caption: 'Enter your house number, zip code, and date of birth to find your polling place.',
  stateAbbr: 'CA'
};
