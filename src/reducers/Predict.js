import { initialState } from './index';
import {
	TRAIN_FROM_TEXT,
	SET_LEARNING_STATE,
	LOAD_PREDICT_DATA
} from '../actions/index';

import parseText from './predict/TextParser';

import {
	assignNewWords,
	assignLeadingWords
} from './predict/WordsAssigner';

export function predict(state = initialState.predict, action) {
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
			
				// apply the new words data
			const assigned = assignNewWords(state.words, parsed.words);

			return Object.assign({}, state, {
				isLearning: false,	// reset learning state
				startingWords: assignLeadingWords(state.startingWords, parsed.starting),
				endingWords: assignLeadingWords(state.endingWords, parsed.ending),
				words: assigned.words,
				wordsWeighted: assigned.wordsWeighted,
				statistic: {
					inputWords: state.statistic.inputWords + parsed.inputWords,
					knownWords: assigned.wordsCount
				}
			});
		}
		
		case SET_LEARNING_STATE:
			return Object.assign({}, state, {
				isLearning: action.state
			})
			
		case LOAD_PREDICT_DATA: {
				// apply the loaded words data
			const assigned = assignNewWords(state.words, action.data.words);
			
			return Object.assign({}, state, {
				startingWords: assignLeadingWords(state.startingWords, action.data.startingWords),
				endingWords: assignLeadingWords(state.endingWords, action.data.endingWords),
				words: assigned.words,
				wordsWeighted: assigned.wordsWeighted,
				statistic: {
					inputWords: state.statistic.inputWords + action.data.statistic.inputWords,
					knownWords: assigned.wordsCount
				}
			});
		}

		default: return state;
	}
}