import React, {Component} from 'react'
import _ from 'lodash'

export default class Resources extends Component {
	render() {
		const headers = [
			"our-mission",
			"voting-options",
			"election-resources",
			"other-info",
			"office-location",
		]

		let toc = _.map(headers, (header) => {
			return <div key={header}>
				<a href={`#${header}`}>{
					_.map(_.split(header, '-'), _.capitalize).join(' ')
				}</a>
			</div>
		})

		const svgTopIcon = (<svg className="svg-icon" width="24" height="24" viewBox="0 0 24 24">
			<path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z"/>
		</svg>)

		return (<div className="resources">
			<div className="resources-info">
				<h1 id="top" className="title-text">Acessibility Resources</h1>
				<h2>Jump to...</h2>
				{toc}
			</div>

			<div className="resources-info">
				<h2 id="our-mission" className="resources-header">Our Mission</h2>
				<br/>
				<h3 className="resources-header">People First</h3>
				<p>Sacramento County Voter Registration and Elections staff understands that voters
				with specific needs are people, and their disability does not define them.</p>
				<h3 className="resources-header">Precinct Officer Training</h3>
				<p>All Precinct Officers working at a polling place on Election Day are trained to provide assistance to
				voters with specific needs. Our goal is to allow every voter to vote independently and privately.</p>
				<h3 className="resources-header">Polling Place Accessibility</h3>
				<p>Each election, polling places are selected using the Americans with Disabilities Act (ADA)
				guidelines. If you have any questions regarding polling place accessibility, contact us at
				(916) 875-6100.</p>
				<h3 className="resources-header">Accessible Voting Supplies</h3>
				<p>All polling places have a wheelchair accessible voting booth and a magnifying glass to ensure
				voters with specific needs have the tools necessary to cast their vote.</p>
				<div>
					<a className="resources-back-to-top" href="#">Back To Top {svgTopIcon}</a>
				</div>
			</div>

			<div className="resources-info">
				<h2 id="voting-options" className="resources-header">Voting Options</h2>
				<br/>
				<h3 className="resources-header">Polling Place</h3>
				<br/>
				<h4 className="resources-header">AutoMARK™:</h4>
				<p>The ES&S AutoMARK™ voter assist terminal is a ballot-marking system designed to provide:</p>
				<ul>
					<li>Privacy</li>
					<li>Accessibility</li>
					<li>Size adjustment of</li>
					<li>ballot display</li>
					<li>The Official Ballot in English, Spanish, & Chinese</li>
				</ul>
				<h4 className="resources-header">AutoMARK™ features:</h4>
				<ul>
					<li>Braille touchpad</li>
					<li>Headphones</li>
					<li>Stylus</li>
				</ul>
				<h4 className="resources-header">Curbside Voting</h4>
				<p>Sacramento County offers curbside voting for any voter who is unable to
				reasonably access a polling place. A voter may call our office at (916) 875-6377 on Election Day
				to request curbside voting at their polling place.</p>

				<h3 className="resources-header">Vote by Mail</h3>
				<p>Every registered voter in Sacramento County has the option to receive their official ballot by mail.
				Vote by Mail voting provides a means for eligible voters to participate in elections even though they
				may not be able to go to the polls on Election Day.</p>

				<h3 className="resources-header">In Office Voting</h3>
				<p>Starting 29 days before an election, voters may come to the Sacramento County Voter
				Registration and Elections office during business hours and vote. This service is provided through
				the close of polls at 8:00 p.m. Election Day.</p>
				<div>
					<a className="resources-back-to-top" href="#">Back To Top {svgTopIcon}</a>
				</div>
			</div>

			<div className="resources-info">
				<h2 id="election-resources" className="resources-header">Election Resources</h2>
				<br/>
				<h3 className="resources-header">Sample Ballot Booklet</h3>
				<p>Before every election, a sample ballot booklet is
				mailed to every voter who has registered by the
				29th day before an election. Voters may also
				access the Sample Ballot Booklet on our website
				at www.elections.saccounty.net.</p>
				<div className="resources-image">
					<a href="http://www.valcomnews.com/?p=7294">
						<img
							width="380"
							height="206"

							src={"https://raw.githubusercontent.com/abustamam/polling-place-accessibility/master/public/images/I-Voted-Proof-rev-copy.jpg"}
							alt="I voted sticker: attritbution Alicia Chan"
						/>
					</a>
				</div>

				<h3 className="resources-header">Voter Information Guide</h3>
				<p>The California Secretary of State mails one Voter
				Information Guide to every household with a
				registered voter. This guide covers all propositions
				and candidate statements for statewide elections.</p>

				<h3 className="resources-header">Alternative formats</h3>
				<p>The Voter Information Guide is also available in
				large print and audio format. Sacramento County
				also provides local Measures in audio format.
				These materials may be requested by contacting
				our office at (916) 875-6053. </p>
				<div>
					<a className="resources-back-to-top" href="#">Back To Top {svgTopIcon}</a>
				</div>
			</div>

			<div>
				<h2 id="other-info" className="resources-header">Other Info</h2>
				<br/>
				<h3 className="resources-header">Where do I register to vote?</h3>
				<ul>
					<li>Registrar of Voters’ Office</li>
					<li>Libraries</li>
					<li>Post Offices</li>
					<li>Department of Motor Vehicles</li>
					<li>Social Security Offices</li>
					<li>Board of Equalization</li>
					<li>Social Service Offices</li>
					<li>WIC Offices</li>
					<li>Contact the Voter Registration and Elections Office, and a registration form
					will be mailed to you.</li>
				</ul>

				<h3 className="resources-header">Register to vote online</h3>

				<p>The California Secretary of State offers an online
				voter registration form and downloadable forms
				that are also available in Spanish. Go to
				www.registertovote.ca.gov today and register to vote online.</p>


				<h3 className="resources-header">Important Telephone Numbers:</h3>
				<ul>
					<li>Voter Registration & Elections Office Main Line: (916) 875-6451</li>
					<li>Voter Registration & Elections Office-Español: (916) 876-6688</li>
					<li>Voter Registration & Elections Office-中文: (916) 876-8402</li>
					<li>Vote by Mail Voter Information: (916) 875-6155</li>
					<li>Request for Voter Registration Card(s): (916) 875-5596</li>
					<li>Precinct Officers or Polling Places: (916) 875-6100</li>
					<li>Main Fax Number: (916) 875-6516</li>
					<li>Toll Free Number: 1-800-762-8019</li>
					<li>California Relay Service: 1-888-877-5379</li>
				</ul>
				<div>
					<a className="resources-back-to-top" href="#">Back To Top {svgTopIcon}</a>
				</div>
			</div>

			<div className="resources-info">
				<h2 id="office-location" className="resources-header">Office Location:</h2>
				<br/>
				<span>Voter Registration and Elections</span>
				<span>7000 65th Street, Suite A</span>
				<span>Sacramento, CA 95823</span>
				<span>(916) 875-6451</span>
				<span>www.elections.saccounty.net</span>
				<h3>Hours:</h3>
				<span>8:00 a.m. - 5:00 p.m.</span>
				<span>Monday through Friday</span>
				<span>(Excluding Holidays)</span>
				<div>
					<a className="resources-back-to-top" href="#">Back To Top {svgTopIcon}</a>
				</div>
			</div>
		</div>)
	}
}
