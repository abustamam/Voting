import React, {Component} from 'react';
import store from '../stores/pollStore.js';
import getAccessibility from '../actions/fetchAccessibilityObject.js'
import createStoriesObject from '../actions/createStoriesObject.js'
import $ from 'jquery'

export default class AccessibilityStory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ppid: 0,
      stories: null,
      ppName: null,
      acName: null,
      acPpid: null,
      accessibilityError: null
    };
  }
  render() {
    var styles = this.props.styles;
    var name = this.state.ppName || this.state.acName;
    var stories = [];
    var accordionCounter = 0;
    for (var section in this.state.stories) {
      accordionCounter++;
      let warnings = this.state.stories[section].warnings.map((val, index) => (
        <li className="accessibilityWarning" style={styles.warningListItem} key={index}>
          <span style={styles.beforeWarning}>⚠   </span>
          {val}
        </li>))
      let id = `panel${accordionCounter}a`;
      let href = '#' + id;
      stories.push(
        <li key={`${this.state.ppid}-${section}-${id}`} className="accordion-navigation">
          <a href={href}>{section}</a>
          <div id={id} className="content active">
            {this.state.stories[section].summary}
            <ul>
              {warnings}
            </ul>
          </div>
        </li>
      )
    }
    let placeDetails = (<h2>Search or select a site to view accessibility information.</h2>)
    if (name && stories.length === 0) {
      placeDetails = (<h2>{`Looking up site accessibility for ${name}...`}</h2>)
    } else if (name && stories.length > 0) {
      placeDetails = (<div><h2>{`Accessibility of ${name}`}</h2>
        <p>If any of the following pose a problem, please call one of the following numbers:</p>
        <ul>
          <li>Voter Registration & Elections Office Main Line: (916) 875-6451</li>
          <li>Voter Registration & Elections Office-Español: (916) 876-6688</li>
          <li>Voter Registration & Elections Office-中文: (916) 876-8402</li>
        </ul>
      </div>)
    } else if (this.state.accessibilityError === true) {
      let aeplacename = name || 'your polling place';
      placeDetails = (<div><h2>{`Unable to find details for ${aeplacename}.`}</h2>
        <p>For assistance with your polling place or registration, please call one of the following numbers:</p>
        <ul>
          <li>Voter Registration & Elections Office Main Line: (916) 875-6451</li>
          <li>Voter Registration & Elections Office-Español: (916) 876-6688</li>
          <li>Voter Registration & Elections Office-中文: (916) 876-8402</li>
        </ul>
      </div>)
    } else if (this.state.ppid) {
      placeDetails = (<h2>{`Looking up site accessibility for your polling place...`}</h2>)
    }
    return (
      <div style={{padding: 15}}>
        {placeDetails}
        <ul className="accordion" data-accordion>
          {stories}
        </ul>
      </div>
    )
  }
  componentDidMount() {
    // console.log('this getStoreState: ' + this.getStoreState());
    store.observeChanges(this.getStoreState.bind(this));
    // $(document).foundation();
  }
  componentWillUnmount() {
    store.unobserveChanges(this.getStoreState.bind(this));
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.ppid && parseInt(nextState.ppid) > 0 && nextState.ppid !== this.state.ppid) {
      this.setState({accessibilityError: null});
      getAccessibility(nextState.ppid)
      .then((accessibilityResponse) => {
        var stories = createStoriesObject(accessibilityResponse[nextState.ppid]);
        let acName = stories.Info.name;
        let acPpid = stories.Info.ppid;
        delete stories.Info;
        this.setState({stories: stories, accessibilityError: false, acName: acName, acPpid: acPpid})
      }).catch(err => this.setState({accessibilityError: true}));
    }
  }
  getStoreState(o) {
    console.log(this.state, o)
    if (o.ppid !== this.state.ppid) {
      this.setState({ppid: o.ppid, stories: null, ppName: o.ppName});
    }
  }

}

AccessibilityStory.defaultProps = {
  styles: {
    beforeWarning: {
      color: 'red'
    },
    warningListItem: {
      listStyleType: 'none'
    }
  }
};
