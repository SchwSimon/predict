import * as actions from '../../actions/index';

describe('constants', () => {
	it('TRAIN_FROM_TEXT', () => {
		expect(actions.TRAIN_FROM_TEXT).toBe('TRAIN_FROM_TEXT');
  });

	it('SET_LEARNING_STATE', () => {
		expect(actions.SET_LEARNING_STATE).toBe('SET_LEARNING_STATE');
  });

	it('LOAD_PREDICT_DATA', () => {
		expect(actions.LOAD_PREDICT_DATA).toBe('LOAD_PREDICT_DATA');
  });

	it('UPDATE_SETTINGS', () => {
		expect(actions.UPDATE_SETTINGS).toBe('UPDATE_SETTINGS');
  });

	it('LOAD_SETTINGS_DATA', () => {
		expect(actions.LOAD_SETTINGS_DATA).toBe('LOAD_SETTINGS_DATA');
  });
});

describe('actions', () => {
	it('trainFromText', () => {
		const text = 'text';
		const options = 'options';
		expect(actions.trainFromText(text, options)).toEqual({
      type: actions.TRAIN_FROM_TEXT,
      text,
			options
    });
	});

	it('setLearningState', () => {
		const state = 'state';
		expect(actions.setLearningState(state)).toEqual({
      type: actions.SET_LEARNING_STATE,
      state
    });
	});

	it('loadWordsFromFile', () => {
		const data = 'data';
		expect(actions.loadWordsFromFile(data)).toEqual({
      type: actions.LOAD_PREDICT_DATA,
      data
    });
	});

	it('updateSettings', () => {
		const update = 'update';
		expect(actions.updateSettings(update)).toEqual({
      type: actions.UPDATE_SETTINGS,
      update
    });
	});

	it('loadSettingsFromFile', () => {
		const data = 'data';
		expect(actions.loadSettingsFromFile(data)).toEqual({
      type: actions.LOAD_SETTINGS_DATA,
      data
    });
	});
});
