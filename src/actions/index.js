export const TRAIN_FROM_TEXT = 'TRAIN_FROM_TEXT';

export function trainFromText(text, options, exclude) {
	return { type: TRAIN_FROM_TEXT, text, options, exclude }
}