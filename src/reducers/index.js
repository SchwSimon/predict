import { combineReducers } from 'redux';

import { predict } from './Predict';

export const initialState = {
	startingWords: {},		// starting word list
	endingWords: {},		// ending word list
	words: {},					// word list with next words and its weight value
	wordsWeighted: {},		// word list with sorted next words by its weight
};

const AppStore = combineReducers({
	predict
});

export default AppStore;