import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { boolSettingTitles, Settings } from '../../components/predict-settings';

describe('boolSettingTitles constant', () => {
	it('must match the props/values', () => {
		expect(boolSettingTitles).toEqual({
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
	const wrapper = shallow(<Settings settings={{}}/>);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(wrapper.state()).toEqual({
			showSettings: false,
			excludeText: ''
		});
	});

	describe('interaction', () => {
		describe('function onCheckboxChange()', () => {
			const dispatch = sinon.spy();
			sinon.spy(Settings.prototype, 'onCheckboxChange');
			const wrapper = shallow(<Settings settings={{}} dispatch={dispatch}/>);
			wrapper.find('.Settings-checkbox').first().simulate('change', {target: {checked: true , dataset: {settingskey: 1}}});

			it('must trigger function', () => {
				expect(Settings.prototype.onCheckboxChange.called).toBeTruthy();
		  });

			it('function must trigger dispatch', () => {
				expect(dispatch.called).toBeTruthy();
		  });
		});

		describe('function onExcludeTextChange()', () => {
			const dispatch = sinon.spy();
			const wrapper = shallow(<Settings settings={{}} dispatch={dispatch}/>);
			const input = wrapper.find('.Settings-exclude');

			it('must set state:excludeText to "test"', () => {
				input.simulate('change', {target: {value: 'test'}});
				expect(wrapper.state('excludeText')).toBe('test');
		  });

			it('function must trigger dispatch', () => {
				input.simulate('change', {target: {value: ''}});
				expect(dispatch.called).toBeTruthy();
		  });
		});
	});

	describe('functionality', () => {
		describe('function toggleSettings()', () => {
			it('must toggle the state', () => {
				const showSettings = wrapper.state('showSettings');
				wrapper.instance().toggleSettings();
				expect(wrapper.state('showSettings')).toBe(!showSettings);
			});
		});

		describe('function componentWillUpdate()', () => {
			it('must set state:excludeText', () => {
				const wrapper = shallow(<Settings settings={{}}/>);
				wrapper.instance().componentWillUpdate({settings: {exclude: 'set'}});
				expect(wrapper.state('excludeText')).toBe('set');
			});
		});
	});
});
