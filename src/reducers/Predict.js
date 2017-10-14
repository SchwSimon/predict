import { initialState } from './index';
import {
	TRAIN_FROM_TEXT
} from '../actions/index';

import parseText from './predict/TextParser';
import {
	assignNewWords,
	assignLeadingWords
} from './predict/WordsAssigner';

export function predict(state = initialState, action) {
	switch(action.type) {
		case TRAIN_FROM_TEXT: {			
				// extend the current words object with the new data
			const parsed = parseText(action.text, action.options);	// options na net do
			
			const assigned = assignNewWords(state.words, parsed.words);

			return Object.assign({}, state, {
				startingWords: assignLeadingWords(state.startingWords, parsed.starting),
				endingWords: assignLeadingWords(state.endingWords, parsed.ending),
				words: assigned.words,
				wordsWeighted: assigned.wordsWeighted
			});
		}
		default: return state;
	}
}