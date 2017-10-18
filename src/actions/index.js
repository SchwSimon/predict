/*
 *	PREDICT
 */
export const TRAIN_FROM_TEXT = 'TRAIN_FROM_TEXT';
export const SET_LEARNING_STATE = 'SET_LEARNING_STATE';
export const LOAD_PREDICT_DATA = 'LOAD_PREDICT_DATA';

export function trainFromText(text, options) {
	return { type: TRAIN_FROM_TEXT, text, options }
}
export function setLearningState(state) {
	return { type: SET_LEARNING_STATE, state }
}
export function loadWordsFromFile(data) {
	return { type: LOAD_PREDICT_DATA, data }
}

/*
 *	SETTINGS
 */
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const LOAD_SETTINGS_DATA = 'LOAD_SETTINGS_DATA';

export function updateSettings(update) {
	return { type: UPDATE_SETTINGS, update }
}
export function loadSettingsFromFile(data) {
	return { type: LOAD_SETTINGS_DATA, data }
}