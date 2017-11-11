import predict, { predictInitialState } from '../../reducers/Predict';
import { TRAIN_FROM_TEXT, SET_LEARNING_STATE, LOAD_PREDICT_DATA } from '../../actions/index';
import { parseText } from '../../reducers/predict/TextParser';
import { assignWords, nextWordsToSortedArray, assignLeadingWords } from '../../reducers/predict/WordsAssigner';

describe('reducer: predict', () => {
	it('initial state', () => {
		expect(predictInitialState).toEqual({
			isLearning: false,
			startingWords: {},
			endingWords: {},
			words: {},
			wordsWeighted: {},
			statistic: {
				inputWords: 0,
				knownWords: 0
			}
		});
  });

	it('return initialState on default action', () => {
		expect(predict(undefined, {type: null})).toEqual(predictInitialState);
  });

	const actionText = 'text text';
	const parsed = parseText(actionText);
	const assignedWords = assignWords(parsed.words);
	const stateOnDefaultAssign = {
		isLearning: false,
		startingWords: assignLeadingWords(parsed.starting),
		endingWords: assignLeadingWords(parsed.ending),
		words: assignedWords.words,
		wordsWeighted: nextWordsToSortedArray(assignedWords.words),
		statistic: {
			inputWords: parsed.inputWords,
			knownWords: assignedWords.wordCount
		}
	};

	describe('TRAIN_FROM_TEXT', () => {
		it('must return the same state on empty text', () => {
			const action = {
				type: TRAIN_FROM_TEXT,
				text: ''
			};
			expect(predict(undefined, action)).toEqual(predictInitialState);
		});

		const action = {
			type: TRAIN_FROM_TEXT,
			text: actionText
		};

		it('must assign right on default', () => {
			expect(predict(undefined, action)).toEqual(stateOnDefaultAssign);
		});

		it('must assign right on second assign', () => {
			expect(predict(stateOnDefaultAssign, action)).toEqual({
				isLearning: false,
				startingWords: assignLeadingWords(parsed.starting, stateOnDefaultAssign.startingWords),
				endingWords: assignLeadingWords(parsed.ending, stateOnDefaultAssign.endingWords),
				words: assignedWords.words,
				wordsWeighted: nextWordsToSortedArray(assignedWords.words),
				statistic: {
					inputWords: parsed.inputWords + stateOnDefaultAssign.statistic.inputWords,
					knownWords: assignedWords.wordCount
				}
			});
		});
	});

	describe('SET_LEARNING_STATE', () => {
		it('must set the learning state', () => {
			const newState = 'learning state';
			const action = {
				type: SET_LEARNING_STATE,
				state: newState
			};
			expect(predict(undefined, action)).toEqual(Object.assign({}, predictInitialState, {
				isLearning: newState
			}));
		});
	});

	describe('LOAD_PREDICT_DATA', () => {
		it('must correctly load the data', () => {
			const action = {
				type: LOAD_PREDICT_DATA,
				data: stateOnDefaultAssign
			};
			expect(predict(undefined, action)).toEqual(stateOnDefaultAssign);
		});
	});
});
