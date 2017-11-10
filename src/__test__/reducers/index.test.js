import { initialState } from '../../reducers/index';

describe('initialState', () => {
	it('default state', () => {
		expect(initialState).toEqual({
			predict: {
				isLearning: false,
				startingWords: {},
				endingWords: {},
				words: {},
				wordsWeighted: {},
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
		});
  });
});
