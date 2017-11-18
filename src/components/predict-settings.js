import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { updateSettings } from '../actions/index';

import '../styles/predict-settings.css';

	// settings with theyr corresponding view title
export const SETTING_TITLES = {
	allowNumbers: 'Allow numbers',
	allowSpecials: 'Allow special characters',
	joinQuotes: 'Include quotes',
	joinRoundBrackets: 'Include round brackets',
	joinCurlyBrackets: 'Include curly brackets',
	joinSquareBrackets: 'Include square brackets'
};

export class Settings extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			showSettings: false,
			excludeText: ''
		}

		this.onCheckboxChange = this.onCheckboxChange.bind(this);
		this.onExcludeTextChange = this.onExcludeTextChange.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
	}

	componentWillUpdate(nextProps) {
			// if file data gets loaded exclude will be passed as string
		if (typeof nextProps.settings.exclude === 'string')
			this.setState({excludeText: nextProps.settings.exclude});
	}

	// on bool setting toggle
	onCheckboxChange(event) {
		this.props.dispatch(updateSettings({
			key: event.target.dataset.settingskey,
			value: event.target.checked
		}));
	}

	// on exclude input change
	onExcludeTextChange(event) {
		const excludeText = event.target.value.trim();

		this.setState({excludeText: excludeText});

		this.props.dispatch(updateSettings({
			key: 'exclude',
			value: excludeText.split(',')
		}));
	}

	toggleSettings() {
		this.setState({showSettings: !this.state.showSettings});
	}

	render() {
		return (
			<div className="Settings">
				<div className={'Settings-main' + ((this.state.showSettings) ? ' Settings-show' : '')}>
					{Object.keys(SETTING_TITLES).map((key, index) => {
						return (
							<div
								className={'Settings-btn ' + ((this.props.settings[key]) ? 'true' : 'false')}
								key={index}
							>
								{SETTING_TITLES[key]}
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
						value={this.state.excludeText}
						onChange={this.onExcludeTextChange}
						data-iscontent={(this.state.excludeText === '') ? false : true}
						className="Settings-exclude"
						placeholder="Exclude this text, for multiple excludes separate with a comma (case insensitive)"
						spellecheck="false"
					/>
				</div>
				<div className={'Settings-trigger' + ((this.state.showSettings) ? ' Settings-trigger-open' : '')} onClick={this.toggleSettings}>
					<div className="Settings-trigger-label">S E T T I N G S</div>
					<div className="vCenterer"></div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		settings: state.settings
	})
)(Settings);
