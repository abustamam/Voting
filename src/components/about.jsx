import React from 'react';

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'About';
    }
    
    render() {
        return <div className="resources">
        	<div className="resources-info">
    			<h1 className="title-text">About</h1>
        	</div>
        	<div className="resources-info">
        		<h2 className="resources-header">Our Mission</h2>
        		<p>This app was created as a part of Hack4Sac's county innovation challenge.</p>
        		<p>We believe that voters with specific needs are people too, and that they are often cast aside when creating
        		products or services.</p>
          <p>That's why we created this app. We tried our best to design the app to be easy for
        		people with special needs to use. </p>
        		<p>One very helpful tool that we recommend all developers use is <a href="http://khan.github.io/tota11y/">Khan Academy's tota11y</a>.</p>
        	</div>
        	<div className="resources-info">
        		<h2 className="resources-header">Giving Back</h2>
        		<p>We believe in our mission so much, we will put our money where our mouth is.</p>
        		<p>If we win the Hack4Sac challenge, we will donate 20% of our winnings to the <a href="http://www.aapd.com/">American Association
        		of People with Disabilities (AAPD)</a>.</p>
        		<p>If you'd like to donate now, please click <a href="https://aapd.kindful.com/?campaign=238334">here to donate to the AAPD</a></p>
        	</div>
        	<div className="resources-info">
        		<h2 className="resources-header">Our Team</h2>
        		<p>Rasheed Bustamam, software engineer at CoNarrative</p>
        		<p><a href="https://github.com/brooksn">Brooks Newberry</a>, environmental sciences major at UC Davis</p>
        		<p>Nate Cornell, software developer</p>
        		<p>Hans Chun, software developer</p>
        	</div>
        </div>
    }
}
