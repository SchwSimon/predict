import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/Settings.css';

class Settings extends PureComponent {	
	render() {
		return (
			<div className="Settings">
				
			</div>
		)
	}
}

export default connect(
	state => ({
		nextWords: state.predict.wordsWeighted
	})
)(Settings);
