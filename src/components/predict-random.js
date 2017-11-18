// TODO:	tweak endingKeyRange
//				on large word base the probability of short sentences is still quite high
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/predict-random.css';

// random index generator for the word key lists
export const randomIndex = (length) => Math.floor(Math.random()*length)

/*
 * Random text generator based on the provided words
 */
export class PredictRandom extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			text: ''
		};

		this.onGenerate = this.onGenerate.bind(this);
	}

	// generate a random text
	generateRandomText(wordsData = {words: {}, startingWords: {}, endingWords: {}}) {
		const words = wordsData.words;
		const wordsList = Object.keys(wordsData.words);
		const startingWordsList = Object.keys(wordsData.startingWords);
		const endingWordsList = Object.keys(wordsData.endingWords);

		if (!wordsList.length || !startingWordsList.length || !endingWordsList.length)
			return '';

			// the starting word
		let indexWord = startingWordsList[randomIndex(startingWordsList.length)];

			// begin the random text with the first index word as starting word
		let randomText = indexWord.charAt(0).toUpperCase() + indexWord.substr(1);

			// sentence ending probability in %
		let endingProbability = 0;
		for(let i = 0; ;i++) {
				// increases the probability with each iteration
			endingProbability++;

				// if the indexWord does not exist as leading word, generate another one
			if (!words[indexWord])
				indexWord = wordsList[randomIndex(wordsList.length)];

				// get the possible next words
			let possibleNextWords = Object.keys(words[indexWord]);
			let nextWords = words[indexWord];

				// calculate the next name's average weight
			let averageWeight = possibleNextWords.map((subkey) => {
				return nextWords[subkey].weight;
			}).reduce((acc, curr) => acc + curr, 0) / possibleNextWords.length;

				// filter the possible next words, by having only words with
				// a weight higher or equal the local average
			possibleNextWords = possibleNextWords.filter((subkey) => {
				return nextWords[subkey].weight >= averageWeight
			});

				// make a sentence break if there are no possible next words
				// or by hitting the 5% chance
			if (!possibleNextWords.length || Math.ceil(Math.random() * 100) > 95) {
					// get new random starting word
				indexWord = startingWordsList[randomIndex(startingWordsList.length)];
				randomText += ', ' + indexWord;
				continue;
			}

				// get possible ending words from the possible next words
			let possibleEnds = possibleNextWords.filter((word) => {
				return endingWordsList.indexOf(word) > -1;
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
					indexWord = startingWordsList[randomIndex(startingWordsList.length)];
					randomText += ' ' + indexWord.charAt(0).toUpperCase() + indexWord.substr(1);
					i = 0;
					continue;
				}
				break;
			}

			if (i > 50)	// assume endless loop for whatever reason..., try again..
				return this.generate(wordsData);
		}

		return randomText;
	}

	onGenerate() {
		this.setText(
			this.generateRandomText({
				words: this.props.words,
				startingWords: this.props.startingWords,
				endingWords: this.props.endingWords
			})
		)
	}

	setText(text) {
		this.setState({text: text});
	}

	render() {
		return (
			<div>
				<div className="PredictRandom">
					<button
						className="PredictRandom-btn"
						onClick={this.onGenerate}
					>Generate<br/>random<br/>text
					</button>
					<textarea
						value={this.state.text}
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
		words: state.predict.words,
		startingWords: state.predict.startingWords,
		endingWords: state.predict.endingWords
	})
)(PredictRandom);
