import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/RandomText.css';

class RandomText extends PureComponent {	
	constructor(props) {
		super(props);

		this.generate = this.generate.bind(this);
	}
	
	generate() {
		if (!Object.keys(this.props.words).length) return;
		
		function randomIndex(length) {
			return Math.floor(Math.random()*length);
		}
		
		const defaultKeyList = Object.keys(this.props.words);
		const startingKeyList = Object.keys(this.props.startingWords);
		const endingKeyList = Object.keys(this.props.endingWords);
		
		let indexWord = startingKeyList[randomIndex(startingKeyList.length)];
		
		let randomText = indexWord;
		for(let i = 0, len = Math.ceil(Math.random()*(20-6)+6); i < len; i++) {
			if (!this.props.words[indexWord])	// if the indexWord does not exist, generate another one
				indexWord = defaultKeyList[randomIndex(defaultKeyList.length)];
			
			//let nextWordsCount = this.props.words[indexWord].length;
			let subKeys = Object.keys(this.props.words[indexWord]);
				
				// calculate the next name's average weight
			let averageWeight = subKeys.map((subkey) => {
				return this.props.words[indexWord][subkey].weight;
			}).reduce((acc, curr) => acc + curr) / subKeys.length;
				
				// the possible next index word must be weighted equal or over the average next word weight
			let possibleNextWords = subKeys.filter((subkey) => {
				return this.props.words[indexWord][subkey].weight >= averageWeight
			});
				
				// continue if there are no words
			if (!possibleNextWords.length) continue;
			
			if (i+1 === len) {
				const possibleEnds = possibleNextWords.filter((word) => {
					return endingKeyList.indexOf(word) > -1;
				});
				
				indexWord = (possibleEnds.length > 0)
					? possibleEnds[randomIndex(possibleEnds.length)]
						: endingKeyList[randomIndex(endingKeyList.length)];
			} else {
				indexWord = possibleNextWords[randomIndex(possibleNextWords.length)];
			}
			
			randomText += ' ' + indexWord;
		}
		randomText = randomText.charAt(0).toUpperCase() + randomText.substr(1) + '.';
		
		this.output.textContent = randomText;
	}
	
	render() {
		return (
			<div className="RandomText">
				<div ref={div => this.output = div}></div>
				<button onClick={this.generate}>Random Text</button>
			</div>
		)
	}
}

export default connect(
	state => ({
		startingWords: state.predict.startingWords,
		endingWords: state.predict.endingWords,
		words: state.predict.words
	})
)(RandomText);
