import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { Settings, SETTING_TITLES } from '../../components/predict-settings';
import { updateSettings } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('SETTING_TITLES constant', () => {
	it('must match', () => {
		expect(SETTING_TITLES).toEqual({
			allowNumbers: 'Allow numbers',
			allowSpecials: 'Allow special characters',
			joinQuotes: 'Include quotes',
			joinRoundBrackets: 'Include round brackets',
			joinCurlyBrackets: 'Include curly brackets',
			joinSquareBrackets: 'Include square brackets'
		});
	});
});

describe('<Settings />', () => {
	const dispatchSpy = sinon.spy();
	const props = {
		dispatch: dispatchSpy,
		settings: {}
	};
	const wrapper = shallow(<Settings {...props} />);
	const defaultState = wrapper.state();

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(defaultState).toEqual({
			showSettings: false,
			excludeText: ''
		});
	});

	describe('Lifecycle', () => {
		describe('function componentWillUpdate()', () => {
			it('must set the state correctly', () => {
				wrapper.instance().componentWillUpdate({settings: {exclude: 'set'}});
				expect(wrapper.state().excludeText).toBe('set');
			});
		});
	});

	describe('functionality', () => {
		describe('function onCheckboxChange()', () => {
			it('must trigger dispatch with updateSettings', () => {
				wrapper.find('.Settings-checkbox').first()
					.simulate('change', {target: {checked: true , dataset: {settingskey: 1}}});
				expect(dispatchSpy.calledWith(updateSettings({
					key: 1,
					value: true
				}))).toBeTruthy();
		  });
		});

		describe('function onExcludeTextChange()', () => {
			const value = 'a, b';
			wrapper.find('.Settings-exclude').simulate('change', {target: {value: value}})
			const state = wrapper.state().excludeText;

			it('must set the state correctly', () => {
				expect(state).toBe(value);
		  });

			it('must trigger dispatch with updateSettings', () => {
				expect(dispatchSpy.calledWith(updateSettings({
					key: 'exclude',
					value: value.split(',')
				}))).toBeTruthy();
		  });
		});

		describe('function toggleSettings()', () => {
			it('must set the state correctly', () => {
				wrapper.state().showSettings = true;
				wrapper.instance().toggleSettings();
				expect(wrapper.state().showSettings).toBe(false);
			});
		});
	});
});
