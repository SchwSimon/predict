// TODO:	tweak endingKeyRange
//				on large word base the probability of short sentences is still quite high

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/predict-random.css';

/*
 * Random text generator based on the provided words
 */
class PredictRandom extends PureComponent {	
	constructor(props) {
		super(props);

		this.generate = this.generate.bind(this);
	}
	
	// generate a random text
	generate() {
		if (!Object.keys(this.props.words).length) return;
		
			// random index generator for the word key lists
		function randomIndex(length) {
			return Math.floor(Math.random()*length);
		}
		
		const defaultKeyList = Object.keys(this.props.words);
		const startingKeyList = Object.keys(this.props.startingWords);
		const endingKeyList = Object.keys(this.props.endingWords);
		
			// calculate the average weight of the ending words
		// const endingKeyAverage = endingKeyList.map((key) => {
			// return this.props.endingWords[key].weight;
		// }).reduce((acc, curr) => acc + curr) / endingKeyList.length;
		
			// the starting word
		let indexWord = startingKeyList[randomIndex(startingKeyList.length)];
		
			// begin the random text with the first index word as starting word
		let randomText = indexWord.charAt(0).toUpperCase() + indexWord.substr(1);
			
			// sentence ending probability in %
		let endingProbability = 0;
		for( let i = 0; ;i++ ) {
				// increases the probability with each iteration
			endingProbability++;
			
				// if the indexWord does not exist as leading word, generate another one
			if (!this.props.words[indexWord])
				indexWord = defaultKeyList[randomIndex(defaultKeyList.length)];
			
				// get the possible next words
			let possibleNextWords = Object.keys(this.props.words[indexWord]);
				
				// calculate the next name's average weight
			const averageWeight = possibleNextWords.map((subkey) => {
				return this.props.words[indexWord][subkey].weight;
			}).reduce((acc, curr) => acc + curr) / possibleNextWords.length;
				
				// filter the possible next words, by having only words with 
				// a weight higher or equal the local average
			possibleNextWords = possibleNextWords.filter((subkey) => {
				return this.props.words[indexWord][subkey].weight >= averageWeight
			});

				// make a sentence break if there are no possible next words
				// or by hitting the 5% chance
			if (!possibleNextWords.length || Math.ceil(Math.random() * 100) > 95) {
					// get new random starting word
				indexWord = startingKeyList[randomIndex(startingKeyList.length)];
				randomText += ', ' + indexWord;
				continue;
			}
			
				// get possible ending words from the possible next words
			let possibleEnds = possibleNextWords.filter((word) => {
				return endingKeyList.indexOf(word) > -1;
			});
				
				// check if we should end the text
				// if there are possible ending words
				// the word count gets added to the ending probability by 1% per word
			let isEnd;
			if (possibleEnds.length && Math.ceil(Math.random() * 100) <= endingProbability+randomText.split(' ').length) {
				isEnd = true;

				// get a possible ending word
				indexWord = possibleEnds[randomIndex(possibleEnds.length)];
			} else {
				isEnd = false;
				
					// get a possible next word
				indexWord = possibleNextWords[randomIndex(possibleNextWords.length)];
			}

			randomText += ' ' + indexWord;
			
			if (isEnd) {
				randomText += '.';
				
					// if the text contains 4 or less words, build another sentence.
				if (randomText.split(' ').length <= 6) {
						// generate a new starting word
					indexWord = startingKeyList[randomIndex(startingKeyList.length)];
					randomText += ' ' + indexWord.charAt(0).toUpperCase() + indexWord.substr(1);
					i = 0;
					continue;
				}
				break;
			}
			
			if (i > 50)	// assume endless loop, try again..
				return this.generate();
		}
		
		this.output.value = randomText;
	}
	
	render() {
		return (
			<div>
				<div className="PredictRandom">
					<button
						className="PredictRandom-btn"
						onClick={this.generate}
					>Generate<br/>random<br/>text
					</button>
					<textarea
						ref={output => this.output = output}
						className="PredictRandom-ouput"
						readOnly={true}
						spellecheck="false"
					/>
				</div>
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
)(PredictRandom);
