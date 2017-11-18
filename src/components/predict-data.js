import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import FileSaver from 'file-saver';
import { loadWordsFromFile, loadSettingsFromFile } from '../actions/index';

import '../styles/predict-data.css';

export const FILE_PREFIX = '-Simon1991-';

/*
 * Data handler
 * Save and/or restore data
 */
export class Data extends PureComponent {
	constructor(props){
		super(props);

		this.state = {
			preLoadButton: {
				show: true,
				disabled: false,
				content: {
					default: 'Click here to feed ~2.7million words taken from 25 popular books',
					loading: 'Loading...'
				}
			}
		};

		this.onSave = this.onSave.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
		this.onPreFeed = this.onPreFeed.bind(this);
	}

	// save the current state into a json file with a prefix
	onSave() {
		FileSaver.saveAs(
			new Blob(
				[FILE_PREFIX + JSON.stringify(this.props.state)],
				{type: 'text/plain;charset=utf-8'}
			),
			'Predict_data.json'
		);
	}

	onFileLoad(result) {
		let dispatch = this.props.dispatch;

			// return if the file is invalid
		if (result.substr(0, FILE_PREFIX.length) !== FILE_PREFIX)
			return alert('Invalid file, you can only load files you got from here.');

			// maybe a trycatch block to "repair" the data in catch and try again?
		const data = JSON.parse(result.substr(FILE_PREFIX.length));

		dispatch(loadWordsFromFile(data.predict));
		dispatch(loadSettingsFromFile(data.settings));
	}

	// load a saved state
	onFileChange(event) {
		const _this = this;
		const reader = new FileReader();
    reader.addEventListener('load', function onFileLoad() {
			this.removeEventListener('load', onFileLoad, false);
			_this.onFileLoad(this.result);
		}, false);
    reader.readAsText(event.target.files[0]);
	}

	// pre feed loading handlier
	onPreFeed() {
		this.setState(prevState => ({
			preLoadButton: Object.assign({}, prevState.preLoadButton, {
				disabled: true
			})
		}));
		this.loadPreFeedData()
			.then(() => {
				this.setState(prevState => ({
					preLoadButton: Object.assign({}, prevState.preLoadButton, {
						show: false
					})
				}));
			})
			.catch(() => {
				this.setState(prevState => ({
					preLoadButton: Object.assign({}, prevState.preLoadButton, {
						disabled: false
					})
				}));
				alert('An error occured while loading the feed data, try again');
			});
	}

	// load the pre feed
	async loadPreFeedData() {
		return new Promise((resolve, reject) => {
			const dispatch = this.props.dispatch;
			fetch(process.env.PUBLIC_URL + '/preFeedData.json')
				.then(response => {
					response.json().then(result => {
						dispatch(loadWordsFromFile(result.predict));
						dispatch(loadSettingsFromFile(result.settings));
						resolve();
					});
				})
		});
	}

	render() {
		return (
			<div className="Data">
				<div
					className="Data-save"
					onClick={this.onSave}
				>
					Save
					<span role="img" aria-label="save"> &#x1f4be;</span>
				</div>
				<div className="Data-load">
					Load
					<input
						className="Data-loadInput"
						type="file"
						accept="application/json"
						onChange={this.onFileChange}
					/>
				</div>
				{this.state.preLoadButton.show &&
					<button
						disabled={this.state.preLoadButton.disabled}
						style={{
							position: 'absolute',
							top: -44,
							left: 0
						}}
						onClick={this.onPreFeed}
					>{this.state.preLoadButton.disabled
						? this.state.preLoadButton.content.loading
							: this.state.preLoadButton.content.default}</button>
				}
			</div>
		)
	}
}

export default connect(
	state => ({
		state: state
	})
)(Data);
