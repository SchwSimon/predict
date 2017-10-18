import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { updateSettings } from '../actions/index';

import '../styles/predict-settings.css';

	// settings with theyr corresponding view title
const boolSettingTitles = {
	allowNumbers: 'Allow numbers',
	allowSpecials: 'Allow special characters',
	joinQuotes: 'Include quotes',
	joinRoundBrackets: 'Include round brackets',
	joinCurlyBrackets: 'Include curly brackets',
	joinSquareBrackets: 'Include square brackets'
};

class Settings extends PureComponent {
	constructor(props) {
		super(props);
		
		this.onCheckboxChange = this.onCheckboxChange.bind(this);
		this.onExcludeChange = this.onExcludeChange.bind(this);
	}
	
	// on bool setting toggle
	onCheckboxChange(event) {
		this.props.dispatch(updateSettings({
			key: event.target.dataset.settingskey,
			value: event.target.checked
		}));
	}
	
	// on exclude input change
	onExcludeChange() {
		const val = this.excludeInput.value.trim();
		
			// only for the visuals
		if (val)
			this.excludeInput.setAttribute('isContent', '')
		else
			this.excludeInput.removeAttribute('isContent');
		
		this.props.dispatch(updateSettings({
			key: 'exclude',
			value: val.split(',')
		}));
	}
	
	componentWillUpdate(nextProps) {
		if (typeof nextProps.settings.exclude === 'string') {
				// if file data gets loaded exclude will be passed as string
				// to trigger the value input here
			this.excludeInput.value = nextProps.settings.exclude;
				// trigger onExcludeChange manually for updating the visuals
			this.onExcludeChange();
		}
	}
	
	render() {
		return (
			<div className="Settings">
				{Object.keys(boolSettingTitles).map((key, index) => {
					return (
						<div
							className={'Settings-btn ' + ((this.props.settings[key]) ? 'true' : 'false')}
							key={index}
						>
							{boolSettingTitles[key]}
							<input
								className="Settings-checkbox"
								type="checkbox"
								data-settingskey={key}
								onChange={this.onCheckboxChange}
							/>
						</div>
					);
				})}
				<textarea
					ref={input => this.excludeInput = input}
					className="Settings-exclude"
					placeholder="Exclude this text, for multiple excludes separate with a comma (case insensitive)"
					onKeyUp={this.onExcludeChange}
					spellecheck="false"
				/>
			</div>
		)
	}
}

export default connect(
	state => ({
		settings: state.settings
	})
)(Settings);
