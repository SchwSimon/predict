import { initialState } from './index';

import {
	UPDATE_SETTINGS,
	LOAD_SETTINGS_DATA
} from '../actions/index';

export function settings(state = initialState.settings, action) {
	switch(action.type) {
		case UPDATE_SETTINGS:
			return Object.assign({}, state, {
				[action.update.key]: action.update.value
			})
		
		case LOAD_SETTINGS_DATA:
			return Object.assign({}, state, {
				allowNumbers: action.data.allowNumbers,
				allowSpecials: action.data.allowSpecials,
				joinQuotes: action.data.joinQuotes,
				joinRoundBrackets: action.data.joinRoundBrackets,
				joinCurlyBrackets: action.data.joinCurlyBrackets,
				joinSquareBrackets: action.data.joinSquareBrackets,
				exclude: action.data.exclude.join(',')	// pass as string, see @components/predict-settings::componentWillUpdate()
			});
			
		default: return state;
	}
}