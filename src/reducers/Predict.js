import { initialState } from './index';
import {
	TRAIN_FROM_TEXT,
	SET_LEARNING_STATE,
	LOAD_PREDICT_DATA
} from '../actions/index';

import parseText from './predict/TextParser';
import { assignWords, nextWordsToSortedArray, assignLeadingWords } from './predict/WordsAssigner';

export const predict = (state = initialState.predict, action) => {
	switch(action.type) {
		case TRAIN_FROM_TEXT: {
				// parse the training text
			const parsed = parseText(
				action.text,
				action.options
			);

				// return if output contains no words
			if (!parsed.inputWords) return Object.assign({}, state, {
				isLearning: false	// reset learning state
			});

				// apply the new words
			const assignedWords = assignWords(parsed.words, state.words);

			return Object.assign({}, state, {
				isLearning: false,	// reset learning state
				startingWords: assignLeadingWords(parsed.starting, state.startingWords),
				endingWords: assignLeadingWords(parsed.ending, state.endingWords),
				words: assignedWords.words,
				wordsWeighted: nextWordsToSortedArray(assignedWords.words),
				statistic: {
					inputWords: parsed.inputWords + state.statistic.inputWords,
					knownWords: assignedWords.wordCount
				}
			});
		}

		case SET_LEARNING_STATE:
			return Object.assign({}, state, {
				isLearning: action.state
			})

		case LOAD_PREDICT_DATA: {
				// apply the loaded words data
			const assignedWords = assignWords(action.data.words, state.words);

			return Object.assign({}, state, {
				startingWords: assignLeadingWords(action.data.startingWords, state.startingWords),
				endingWords: assignLeadingWords(action.data.endingWords, state.endingWords),
				words: assignedWords.words,
				wordsWeighted: nextWordsToSortedArray(assignedWords.words),
				statistic: {
					inputWords: state.statistic.inputWords + action.data.statistic.inputWords,
					knownWords: assignedWords.wordCount
				}
			});
		}

		default: return state;
	}
}

export default predict;
