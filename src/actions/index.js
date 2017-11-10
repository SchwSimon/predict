/*
 *	PREDICT
 */
export const TRAIN_FROM_TEXT = 'TRAIN_FROM_TEXT';
export const SET_LEARNING_STATE = 'SET_LEARNING_STATE';
export const LOAD_PREDICT_DATA = 'LOAD_PREDICT_DATA';

export const trainFromText = (text, options) => ({
	type: TRAIN_FROM_TEXT,
	text,
	options
});
export const setLearningState = (state) => ({
	type: SET_LEARNING_STATE,
	state
});
export const loadWordsFromFile = (data) => ({
	type: LOAD_PREDICT_DATA,
	data
});

/*
 *	SETTINGS
 */
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const LOAD_SETTINGS_DATA = 'LOAD_SETTINGS_DATA';

export const updateSettings = (update) => ({
	type: UPDATE_SETTINGS,
	update
});
export const loadSettingsFromFile = (data) => ({
	type: LOAD_SETTINGS_DATA,
	data
});
