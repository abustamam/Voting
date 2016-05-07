import React, { Component } from 'react';
import PollingPlaceForm from './PollingPlaceForm'
import PlaceMap from './PlaceMap'
import _ from 'lodash'
import FormMap from './FormMap'
import AccessibilityStory from './AccessibilityStory'
import Resources from './Resources'
import About from './About'
import classnames from 'classnames'
require('./../lib/tota11y.min.js')

const sacImage = require('./../assets/images/sacCapitol.jpg')

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentTab: 'find your polling place'
		}
	}

	render() {

		const tabs = ['find your polling place', 'map',  'resources', 'about']

		let renderedTab = (tab) => {
			if (tab === 'map') {
				return <PlaceMap />
			} else if (tab === 'find your polling place') {
				return <div>
					<PollingPlaceForm approxLat={this.props.approxLat} approxLong={this.props.approxLong} />
					<AccessibilityStory />
			        <FormMap approxLat={this.props.approxLat} approxLong={this.props.approxLong} />
				</div>
			} else if (tab === 'resources') {
				return <Resources/>
			} else if (tab === 'about') {
				return <About/>
			}
		}

		const tabStyle = tab => {
			return classnames({tab: true, active: tab === this.state.currentTab})
		}

		return (
			<div className="app-root">
				<div className="header-row" role="header">
					<span className="title">Poll Locations</span>
				</div>
				<div className="tabs" role="navigation">
					{_.map(tabs, tab => {
						return <div className={tabStyle(tab)} key={tab} onClick={()=>this.setState({currentTab: tab})}>
							<span>{_.capitalize(tab)}</span>
						</div>
					})}
				</div>
				<div className="rendered-tab" role="main">
					{ renderedTab(this.state.currentTab) }
				</div>
	  		</div>
		);
	}
}

App.defaultProps = {
  approxLat: '38.5789777', //geocoding bias
  approxLong: '-121.4829292', //geocoding bias
};
