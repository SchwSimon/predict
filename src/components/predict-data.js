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
	}
	
	onSave() {
		var blob = new Blob(
			[	blobPrefix +
				JSON.stringify(this.props.state)
			],
			{type: 'text/plain;charset=utf-8'}
		);
		FileSaver.saveAs(blob, 'Predict_data.json');
	}
	
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
			</div>
		)
	}
}

export default connect(
	state => ({
		state: state
	})
)(Data);
