import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/predict-input.css';

/**
 * Return a Predict word
 */
export const PredictionWord = (props) => (
	<div onClick={event => props.onWordSelect(event.target.textContent)}>
		{props.word}
	</div>
);

/*
 * Returns a list of possible predict words
 */
export const PredictionWords = (props) => {
	if (!props.word
			|| !props.words
				|| !props.words[props.word]) return null;

		// show the most common next words for the input word
	let list = [];
	for(let i = 0, max = props.max || 10; i < max; i++) {
			// break if there are no more possible next words for this word
		if (!props.words[props.word][i]) break;

		list.push(<PredictionWord
			key={i}
			onWordSelect={props.onWordSelect}
			word={props.words[props.word][i]}
		/>);
	}

	return (
		<div className="PredictInput-prediction">
			{list}
		</div>
	)
}

/*
 * Render a text input/textare field which shows possible
 * next words for the last entered word
 */
export class PredictInput extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			word: ''	// the current last word
		};

		this.onInputChange = this.onInputChange.bind(this);
		this.onWordSelect = this.onWordSelect.bind(this);
	}

	// on text input change handler
	onInputChange(event) {
			// trim and replace the last occurence of a newline with ' '
		const inputText = event.target.value.trim().replace(/\n(?=[^\n]*$)/, ' ');
		this.setState({
			value: event.target.value,
			word: inputText.slice(-inputText.length + inputText.lastIndexOf(' ')+1).toLowerCase()
		});
	}

	// inject the selected word
	onWordSelect(word) {
		// remove the whitespace at the end of the string
		// concat the selected word with a leading & trailing whitespace
		this.setState(prevState => ({
			value: prevState.value.replace(/ +$/g,"") + ' ' + word + ' ',
			word: word
		}));
	}

	render() {
		return (
			<div>
				<div className="PredictInput">
					<div className="PredictInput-label">Write something here.<br/>If you have fed enough words, it will predict you some possible words you may want to write next.</div>
					<textarea
						className="PredictInput-input onInputFocus"
						value={this.state.value}
						onChange={this.onInputChange}
						spellecheck="false"
					/>
					<PredictionWords
						word={this.state.word}
						words={this.props.words}
						max={this.props.maxPredictions}
						onWordSelect={this.onWordSelect}
					/>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		words: state.predict.wordsWeighted
	})
)(PredictInput);
