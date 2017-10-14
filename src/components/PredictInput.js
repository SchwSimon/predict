import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { trainFromText } from '../actions/index';

import '../styles/PredictInput.css';

function WordPredictions(props) {
	if (!props.nextWords[props.word]) return null;	// return if the word does not yet exist
	let list = [];
	for(let i = 0; i < props.max; i++) {
		if (!props.nextWords[props.word][i]) break;
		list.push(
			<div
				key={i}
				onClick={props.onWordSelect}
			>{props.nextWords[props.word][i]}
			</div>
		);
	}
	return (
		<div className="PredictInput-prediction" >
			{list}
		</div>
	)
}

class PredictInput extends PureComponent {	
	constructor(props) {
		super(props);
		
		this.state = {
			word: ''
		}
		
		this.onInputChange = this.onInputChange.bind(this);
		this.onInputEnter = this.onInputEnter.bind(this);
		this.onWordSelect = this.onWordSelect.bind(this);
	}
	
	// on text input change handler
	onInputChange() {
		let inputText = this.input.value.trim();

		this.setState({
			word: inputText.slice(-inputText.length + inputText.lastIndexOf(' ')+1)
		});
	}
	
	onInputEnter(event) {
		if (event.key === 'Enter' && this.input.value.trim() !== '') {
			this.props.dispatch(trainFromText(this.input.value));
			this.input.value = '';
		}
	}
	
	// inject the selected word
	onWordSelect(event) {
		this.input.value = this.input.value.replace(/ +$/g,"") +	// remove the whitespace at the end of the string
			' ' + event.target.textContent + ' '; 							// concat the selected word with a leading whitespace
			
		this.onInputChange();	// trigger onInputChange manually
	}
	
	render() {
		//<PredictSettings />
		return (
			<div className="PredictInput-con">
				<textarea
					ref={input => this.input = input}
					className="PredictInput-input"
					onChange={this.onInputChange}
					onKeyDown={(this.props.isTrainInput) ? this.onInputEnter : null}
				/>
				<WordPredictions
					word={this.state.word}
					nextWords={this.props.nextWords}
					max={this.props.maxPredictions || 10}
					onWordSelect={this.onWordSelect}
				/>
			</div>
		)
	}
}

export default connect(
	state => ({
		nextWords: state.predict.wordsWeighted
	})
)(PredictInput);
