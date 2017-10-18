import { combineReducers } from 'redux';

import { predict } from './Predict';
import { settings } from './Settings';

export const initialState = {
	predict: {
		isLearning: false,		// the current learning state
		startingWords: {},		// starting word list
		endingWords: {},		// ending word list
		words: {},					// word list with next words and its weight value
		wordsWeighted: {},		// word list with sorted next words by its weight
		statistic: {
			inputWords: 0,
			knownWords: 0
		}
	},
	
	settings: {
		allowNumbers: false,
		allowSpecials: false,
		joinQuotes: true,
		joinRoundBrackets: false,
		joinCurlyBrackets: false,
		joinSquareBrackets: false,
		exclude: []
	}
};

const AppStore = combineReducers({
	predict,
	settings
});

export default AppStore;