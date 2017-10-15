import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import {	trainFromText } from '../actions/index';

import '../styles/Trainer.css';

// Train options @reducer->TextParser
export const TRAIN_OPTIONS_DEFAULT = {
	joinQuotes: true,
	joinRoundBrackets: false,	
	joinCurlyBrackets: false,
	joinSquareBrackets: false,
	allowNumbers: false,
	allowSpecials: false
}

class Trainer extends PureComponent {	
	constructor(props) {
		super(props);
		
		this.onTextEnter = this.onTextEnter.bind(this);
		this.onUrlEnter = this.onUrlEnter.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
	}
	
	// learn from input text
	onTextEnter(event) {
		if (event.key === 'Enter' && this.textInput.value.trim() !== '') {
			this.props.dispatch(trainFromText(this.textInput.value, TRAIN_OPTIONS_DEFAULT));
			this.textInput.value = '';
		}
	}
	
	onFileChange() {
		let dispatch = this.props.dispatch;
		
		const reader = new FileReader();
        reader.addEventListener('load', function onLoad(result) {
			this.removeEventListener('load', onLoad, false);
			
			dispatch(trainFromText(this.result, TRAIN_OPTIONS_DEFAULT));
        }, false);
        reader.readAsText(this.fileInput.files[0]);
	}
	
	// learn from provided url
	onUrlEnter(event) {
		if (event.key === 'Enter' && this.urlInput.value.trim() !== '') {
			fetch(this.urlInput.value.trim()).then((response) => {
				response.text().then((result) => {
					while(this.urlPrintCon.firstChild)	// empty the print container
						this.urlPrintCon.removeChild(this.urlPrintCon.firstChild)

					this.urlPrintCon.innerHTML = result;
					
					let textContent = '';
					this.urlPrintCon.querySelectorAll('*').forEach((node) => {
						switch(node.tagName.toLowerCase()) {
							case 'title':
							case 'script':
							case 'style':
							case 'meta':
							case 'link':
							case 'head':
							case 'iframe':
							case 'noscript':
								node.parentNode.removeChild(node);
								break;
							default:
								textContent += node.textContent;
						}
					})
					
					this.props.dispatch(trainFromText(textContent, TRAIN_OPTIONS_DEFAULT));
				})
			}).catch((error) => {
				console.log("error", error)
			});
		}
	}
	
	render() {
		return (
			<div className="PredictInput-con" hidden>
				<input
					ref={input => this.urlInput = input}
					type="text"
					onKeyDown={this.onUrlEnter}
				/>
				<input
					ref={input => this.fileInput = input}
					accept="text/plain"
					type="file"
					onChange={this.onFileChange}
				/>
				<textarea
					ref={input => this.textInput = input}
					className="Trainer-input"
					onKeyDown={this.onTextEnter}
				/>
				<div
					ref={div => this.urlPrintCon = div}
					hidden
				/>
			</div>
		)
	}
}

export default connect()(Trainer);
