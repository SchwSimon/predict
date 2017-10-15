import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/Settings.css';

class Settings extends PureComponent {	
	constructor(props) {
		super(props);
		
		this.state = {
			word: ''
		}
		
		this.onInputChange = this.onInputChange.bind(this);
		this.onWordSelect = this.onWordSelect.bind(this);
	}
	
	// on text input change handler
	onInputChange() {
		let inputText = this.input.value.trim();

		this.setState({
			word: inputText.slice(-inputText.length + inputText.lastIndexOf(' ')+1)
		});
	}
	
	// inject the selected word
	onWordSelect(event) {
		this.input.value = this.input.value.replace(/ +$/g,"") +	// remove the whitespace at the end of the string
			' ' + event.target.textContent + ' '; 							// concat the selected word with a leading whitespace
			
		this.onInputChange();	// trigger onInputChange manually
	}
	
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
