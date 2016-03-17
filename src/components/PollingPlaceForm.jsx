import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import pollingPlaceRequests from '../actions/pollingPlaceRequests';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import AutoComplete from 'material-ui/lib/auto-complete';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export default class PollingPlaceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      house: null,
      zip: null,
      dob: null,
      place: null,
      address: null,
      latitude: null,
      longitude: null,
    };
  }

  getStyles() {
    return {
      root: {

      },
      input: {
        display: 'flex',
        flexDirection: 'column',
      },
      button: {
        margin: 12
      }
    }
  }

  render() {
    var caption = this.state.caption || this.props.caption;
    var addressLink = this.state.address ? <a href={'http://maps.google.com/?q='+encodeURI(this.state.address)}>➶</a> : null;
    //var map = (this.state.latitude && this.state.longitude) ? <h1>Map!!</h1> : null;

    let styles = this.getStyles()
    let zipCodes = ['95616','95673','95816','95834','95835','95838'];

    if (!this.state.latitude || !this.state.longitude) var map = null;
    else {
      var map = (
        <div style={this.props.styles.root}>
          <Map center={[this.state.latitude, this.state.longitude]} zoom={15} style={this.props.styles.map}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          <Marker position={[this.state.latitude, this.state.longitude]}>
              <Popup>
                <span>{this.state.place}</span>
              </Popup>
            </Marker>
          </Map>
        </div>
      );
    }
    return (
      <div className="polling-place-form row">
        <div className="medium-12 columns">
          <h1>Polling Place Form</h1>
          <div style={styles.input}>
            <TextField
              hintText="House Number"
              onChange={(e) => this.setState({house: e.target.value})}
            />
            <AutoComplete
              hintText="Zip Code"
              dataSource={zipCodes}
              openOnFocus={true}
              onUpdateInput={(val) => this.setState({zip: val})}
              onNewRequest={(val) => this.setState({zip: val})}
            />
            <DatePicker 
              hintText="Date of Birth"
              onChange={(n, date) => this.setState({dob: date})}
            />
            <RaisedButton 
              label="Submit" 
              style={styles.button} 
              onTouchEnd={()=>this.handleSubmit()}
              onMouseUp={()=>this.handleSubmit()}
            />
          </div>
          <p>{caption} {addressLink}</p>
          {map}
        </div>
      </div>
    );
  }
  handleSubmit() {
    pollingPlaceRequests.voter(this.state.house, this.state.zip, this.state.dob, this.props.fusionkey)
    .then(function(data){
      if (data.MailDate && data.MailDate != '') {
        this.setState({caption: `Your absentee ballot was mailed to this address on ${data.MailDate}. You may still vote at your polling place on election day.`, mailDate: data.MailDate})
      }
      return data.PollName;
    }.bind(this))
    .then(pollingPlaceRequests.place.bind(this))
    .then(function(place){
      this.setState({place: place['Polling place'], address: `${place.Address} ${place.City}, ${this.props.stateAbbr} ${place.Zip}`, latitude: place.Lat, longitude: place.Long});
      var caption = '';
      if (this.state.mailDate && this.state.mailDate != '') caption += `Your absentee ballot was mailed to this address on ${this.state.mailDate}. You may still vote at your polling place on election day. `;
      caption += `Your polling place is located at ${place['Polling place']}.`;
      this.setState({caption: caption});
      if (!place.Lat || !place.Long) {
        pollingPlaceRequests.geocode(this.state.address, this.props.mapboxkey, this.props.approxLat, this.props.approxLong)
        .then(function(result){
          this.setState({latitude: result.center[1], longitude: result.center[0]});
        }.bind(this));
      }
    }.bind(this))
    .catch(function(err){
      this.setState({caption: `There was an error finding your polling place: ${err}`});
      this.setState({place: null, address: null});
    }.bind(this));
  }
  handleHouseChange(e) {
    this.setState({house: e.target.value});
  }
  handleZipChange(e) {
    this.setState({zip: e.target.value});
  }
}

PollingPlaceForm.defaultProps = {
  fusionkey: 'AIzaSyBXp2otyudYdGVmWC498IsawNeStFRuJBk', //read-only access
  mapboxkey: 'pk.eyJ1IjoiYnJvb2tzbiIsImEiOiJjaWpkbmkzMDEwMDh3dGdra2Y0OHYwbjViIn0.gqY3_NGpI96FuDQ7csaOUw', //geocoding API
  caption: 'Enter hour house number, zip code, and date of birth to find your polling place.',
  stateAbbr: 'CA',
  approxLat: '38.5789777', //geocoding bias
  approxLong: '-121.4829292', //geocoding bias
  styles: {
    root: {
      height: '10em'
    },
    map: {
      height: '100%'
    }
  }
};
