import settings, { settingsInitialState } from '../../reducers/Settings';
import { UPDATE_SETTINGS, LOAD_SETTINGS_DATA } from '../../actions/index';

describe('reducer: settings', () => {
	it('initial state', () => {
		expect(settingsInitialState).toEqual({
			allowNumbers: false,
			allowSpecials: false,
			joinQuotes: true,
			joinRoundBrackets: false,
			joinCurlyBrackets: false,
			joinSquareBrackets: false,
			exclude: []
		});
  });

	it('return initialState on default action', () => {
		expect(settings(undefined, {type: null})).toEqual(settingsInitialState);
  });

	describe('UPDATE_SETTINGS', () => {
		it('must update the given key', () => {
			const updateValue = 'test';
			const updateKey = 'joinRoundBrackets'
			const action = {
				type: UPDATE_SETTINGS,
				update: {
					key: updateKey,
					value: updateValue
				}
			};
			expect(settings(undefined, action)).toEqual(
				Object.assign({}, settingsInitialState, {
					[updateKey]: updateValue
				})
			);
		});
	});

	describe('LOAD_SETTINGS_DATA', () => {
		it('must update the given key', () => {
			const action = {
				type: LOAD_SETTINGS_DATA,
				data: {
					allowNumbers: 'test',
					allowSpecials: 'test',
					joinQuotes: 'test',
					joinRoundBrackets: 'test',
					joinCurlyBrackets: 'test',
					joinSquareBrackets: 'test',
					exclude: ['test','test']
				}
			};
			expect(settings(undefined, action)).toEqual({
				allowNumbers: 'test',
				allowSpecials: 'test',
				joinQuotes: 'test',
				joinRoundBrackets: 'test',
				joinCurlyBrackets: 'test',
				joinSquareBrackets: 'test',
				exclude: 'test,test'
			});
		});
	});
});
