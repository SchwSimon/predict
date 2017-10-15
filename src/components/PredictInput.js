import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/PredictInput.css';

/*
 * Returns a list of possible next words for a given word
 */
function WordPredictions(props) {
		// return if the word does exist
	if (!props.words[props.word]) return null;	
	
		// show the most common next words for the input word
	let list = [];
	for(let i = 0; i < props.max; i++) {
			// break if there are no more possible next words for this word
		if (!props.words[props.word][i]) break;
		
		list.push(
			<div
				key={i}
				onClick={props.onWordSelect}
			>{props.words[props.word][i]}
			</div>
		);
	}
	
	return (
		<div className="PredictInput-prediction" >
			{list}
		</div>
	)
}

/*
 * Render a text input/textare field which shows possible next words for the last entered word
 */
class PredictInput extends PureComponent {	
	constructor(props) {
		super(props);
		
		this.state = {
			word: ''	// the current last word
		}
		
		this.onInputChange = this.onInputChange.bind(this);
		this.onWordSelect = this.onWordSelect.bind(this);
	}
	
	// on text input change handler
	onInputChange() {
		let inputText = this.input.value.trim();
			
			// set the last entered word
		this.setState({
			word: inputText.slice(-inputText.length + inputText.lastIndexOf(' ')+1)
		});
	}
	
	// inject the selected word
	onWordSelect(event) {
		this.input.value = this.input.value.replace(/ +$/g,"") +	// remove the whitespace at the end of the string
			' ' + event.target.textContent + ' '; 							// concat the selected word with a leading & trailing whitespace
			
		this.onInputChange();	// trigger the text input change manually
	}
	
	render() {
		return (
			<div className="PredictInput-con">
				<textarea
					ref={input => this.input = input}
					className="PredictInput-input"
					onChange={this.onInputChange}
				/>
				<WordPredictions
					word={this.state.word}
					words={this.props.words}
					max={this.props.maxPredictions || 10}
					onWordSelect={this.onWordSelect}
				/>
			</div>
		)
	}
}

export default connect(
	state => ({
		words: state.predict.wordsWeighted
	})
)(PredictInput);
