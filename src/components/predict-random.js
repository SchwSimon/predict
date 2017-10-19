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
		
			// the highest ending word weight
		let endingKeyHigh = 0;
			// calculate the average weight of the ending words
		const endingKeyAverage = endingKeyList.map((key) => {
			endingKeyHigh = (this.props.endingWords[key].weight > endingKeyHigh) ? this.props.endingWords[key].weight : endingKeyHigh;
			return this.props.endingWords[key].weight;
		}).reduce((acc, curr) => acc + curr) / endingKeyList.length;
		
			// if the highest ending key weight is bigger then double the average weight of the ending words
			// add around 60% of the average weight
			// this lowers the probability of short sentences on large word base
		const endingKeyRange = (endingKeyHigh >= (endingKeyAverage*2)) ? endingKeyAverage + (endingKeyAverage*0.6) : endingKeyAverage;
		
			// the starting word
		let indexWord = startingKeyList[randomIndex(startingKeyList.length)];
		
			// begin the random text with the first index word as starting word
		let randomText = indexWord.charAt(0).toUpperCase() + indexWord.substr(1);
		
		for( let i = 0; ;i++ ) {
			if (!this.props.words[indexWord])	// if the indexWord does not exist, generate another one
				indexWord = defaultKeyList[randomIndex(defaultKeyList.length)];
			
			//let nextWordsCount = this.props.words[indexWord].length;
			let subKeys = Object.keys(this.props.words[indexWord]);
				
				// calculate the next name's average weight
			let averageWeight = subKeys.map((subkey) => {
				return this.props.words[indexWord][subkey].weight;
			}).reduce((acc, curr) => acc + curr) / subKeys.length;
				
				// get possible next words
				// they must be weighted equal or over the average next word weight
			let possibleNextWords = subKeys.filter((subkey) => {
				return this.props.words[indexWord][subkey].weight >= averageWeight
			});

				// make a sentence break if there are no possible next words
			if (!possibleNextWords.length) {
					// get new random starting word
				indexWord = startingKeyList[randomIndex(startingKeyList.length)];
				randomText += ', ' + indexWord;
				continue;
			}
			
				// get possible ending words
				// they must be weighted equal or over the ending key range
				// after 20 words they can also be lower than average weight
			let possibleEnds = possibleNextWords.filter((word) => {
				return endingKeyList.indexOf(word) > -1 && (i > 20 || this.props.endingWords[word].weight >= endingKeyRange);
			});
			
			let isEnd;
				// do we have good ending words?
			if (possibleEnds.length > 0) {
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
				if (randomText.split(' ').length <= 4) {
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
