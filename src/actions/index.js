/**
 *		Predict
 */
export const TRAIN_FROM_TEXT = 'TRAIN_FROM_TEXT';

export function trainFromText(text, options = {}) {
	return { type: TRAIN_FROM_TEXT, text, options }
}