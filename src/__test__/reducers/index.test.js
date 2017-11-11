import { createStore } from 'redux';
import AppStore from '../../reducers/index';
import { predictInitialState } from '../../reducers/Predict';
import { settingsInitialState } from '../../reducers/Settings';

describe('store', () => {
	it('must create a correct store', () => {
		const store = createStore(AppStore)
		expect(store.getState()).toEqual({
			predict: predictInitialState,
			settings: settingsInitialState
		});
  });
});
