import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import FileSaver from 'file-saver';

import {
	loadWordsFromFile,
	loadSettingsFromFile
} from '../actions/index';

import '../styles/predict-data.css';


const blobPrefix = '-Simon1991-';

/*
 * Data handler
 * Save and/or restore data
 */
class Data extends PureComponent {
	constructor(props){
		super(props);
		
		this.onSave = this.onSave.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.onPreFeed = this.onPreFeed.bind(this);
	}
	
	// save the current state into a json file with a prefix
	onSave() {
		var blob = new Blob(
			[	blobPrefix +
				JSON.stringify(this.props.state)
			],
			{type: 'text/plain;charset=utf-8'}
		);
		FileSaver.saveAs(blob, 'Predict_data.json');
	}
	
	// load a saved state
	onLoad() {
		let dispatch = this.props.dispatch;
		
		const reader = new FileReader();
        reader.addEventListener('load', function onLoad(result) {
			this.removeEventListener('load', onLoad, false);
			
				// return if the file is invalid
			if (this.result.substr(0, blobPrefix.length) !== blobPrefix)
				return alert('Invalid file, you can only load files you got from here.');
				
				// maybe a trycatch block to "repair" the data in catch and try again?
			const data = JSON.parse(this.result.substr(blobPrefix.length));

			dispatch(loadWordsFromFile(data.predict));
			dispatch(loadSettingsFromFile(data.settings));
        }, false);
        reader.readAsText(this.fileInput.files[0]);
	}
	
	// pre feed loading handlier
	onPreFeed() {
		this.preLoadButton.disabled = true;
		this.preLoadButton.setAttribute('data-txtcnt', this.preLoadButton.textContent)
		this.preLoadButton.textContent = 'Loading...';
		this.loadPreFeedData()
			.then(() => {
				this.preLoadButton.parentNode.removeChild(this.preLoadButton);
			})
			.catch(() => {
				this.preLoadButton.disabled = false;
				this.preLoadButton.textContent = this.preLoadButton.dataset.txtcnt;
				alert('An error occured while loading the feed data, try again');
			});
	}
	
	// load the pre feed
	async loadPreFeedData() {
		return new Promise((resolve, reject) => {
			let dispatch = this.props.dispatch;
			fetch(process.env.PUBLIC_URL + '/preFeedData.json').then((response) => {
				response.json().then(result => {
					dispatch(loadWordsFromFile(result.predict));
					dispatch(loadSettingsFromFile(result.settings));
					resolve();
				});
			}).catch(() => reject());
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
						ref={input => this.fileInput = input}
						className="Data-loadInput"
						type="file"
						accept="application/json"
						onChange={this.onLoad}
					/>
				</div>
				<button
					ref={button => this.preLoadButton = button}
					style={{
						position: 'absolute',
						top: -44,
						left: 0
					}}
					onClick={this.onPreFeed}
				>Click here to feed ~2.7million words taken from 25 popular books</button>
			</div>
		)
	}
}

export default connect(
	state => ({
		state: state
	})
)(Data);
