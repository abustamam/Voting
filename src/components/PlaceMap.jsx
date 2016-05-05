import React, {Component} from 'react';
import _ from 'lodash'
import $ from 'jquery'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import locationsData from './../datasets/locations.js'
import store from '../stores/pollStore.js'
import getAccessibility from '../actions/fetchAccessibilityObject.js'
import createStoriesObject from '../actions/createStoriesObject.js'

export default class PlaceMap extends Component {
  constructor(props) {
    super(props)

    let places = []
    _(locationsData).chunk(6).map((location) => {
      const ppid = location[0][0]
      const address = `${location[2][0]} ${location[3][0]}`
      const latLng = [_.toNumber(location[4][0]), _.toNumber(location[5][0])]
      const placeName = location[1][0]
      const placeObj = {ppid, placeName, address, latLng}
      places.push(placeObj)
    }).value()
    this.state = {places}
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.ppid !== this.state.ppid) {
      getAccessibility(nextState.ppid)
        .then((accessibilityResponse) => {
          var stories = createStoriesObject(accessibilityResponse[nextState.ppid]);
          this.setState({acName: stories.Info.name, acPpid: stories.Info.ppid});
          delete stories.Info;
          this.setState({stories});
      })
    }
  }

  getStyles() {
    return {
      root: {
        height: '100%',
        width: '100%'
      },
      header: {
        fontSize: 40,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'center'
      },
      beforeWarning: {
        color: 'red'
      },
      warningListItem: {
        listStyleType: 'none'
      },
      ul: {
        margin: 0,
        padding: 0,
      }
    }
  }

  handleMarkerClick(event, ppid, userPpid, placeName) {

    var markerPpid = ppid || 0;
    var uPpid = userPpid || 0;
    markerPpid = parseInt(ppid)
    uPpid = parseInt(uPpid)
    console.log('PlaceMap marker clicked with ppid: ' + ppid, uPpid);
    if (markerPpid !== userPpid) {
      //Change the caption and accessibility data
      store.setPPID(markerPpid);
      //Make clear this is definitely not the user's assigned polling place
      //this.setState({caption: ''})
    }
    this.setState({ppid, placeName, loading: true})

    _.delay(() => this.setState({loading: false}), 2500)
  }

  getStories() {
    const styles = this.getStyles()
    const stories = _.map(this.state.stories, (section, key) => {
      const warnings = _.map(section.warnings, (val) => (
        <li key={`${this.state.ppid}-${key}-warning`} className="accessibilityWarning" style={styles.warningListItem}>
          <span style={styles.beforeWarning}>⚠   </span>
          {val}
        </li>)
      )
      return (
      <li key={`${this.state.ppid}-${key}`}>
          {`${key} for ${this.state.placeName}`}
          <div>
            {section.summary}
            <ul>
              {warnings}
            </ul>
          </div>
        </li>
        )
    })

    return <ul style={styles.ul}>
      {stories}
    </ul>
  }

  render() {
    const styles = this.getStyles()

    const north = [38.721915564, -121.390968136]
    const east = [38.6648806855, -121.133173599]
    const south = [38.2571979184, -121.303787278]
    const west = [38.5026946913, -121.522912009]
    const bounds = [north, east, south, west]

    const storyText = this.state.loading ? 
      <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}><span>Loading information for {this.state.placeName}</span></div> : 
      this.getStories()

    const markers = _.map(this.state.places, (location) => {
      return (
        <Marker
          color={this.state.ppid === location.ppid ? this.props.activeColor : this.props.light}
          key={'marker-'+location.ppid}
          ppid={location.ppid}
          userPpid={this.state.userPpid}
          position={location.latLng}
          onLeafletClick={(e)=>this.handleMarkerClick(e, location.ppid, this.state.userPpid, location.placeName)}
        >
          <Popup key={'popup-'+location.ppid}
            minWidth={400}
            minHeight={400}
          >
            {storyText}
          </Popup>
        </Marker>
      )
    })

    return (
      <div style={styles.root}>
        <h1 style={styles.header}>Polling Place Map</h1>
          <Map 
            bounds={bounds} 
            style={{height: '100vh'}}
            scrollWheelZoom={false}
          >
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers}
          </Map>
      </div>
    )
  }
};

PlaceMap.defaultProps = {
  light: '#D3F2BE',
  activeColor: '#37AF14'
}
