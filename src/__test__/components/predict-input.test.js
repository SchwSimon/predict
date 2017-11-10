import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { PredictInput, PredictionWords, PredictionWord } from '../../components/predict-input';

describe('<PredictionWord />', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<PredictionWord />);
		expect(wrapper.length).toBe(1);
  });

	it('must trigger onSelect()', () => {
		const onSelect = sinon.spy();
		const wrapper = mount(<PredictionWord onWordSelect={onSelect}/>);
		wrapper.simulate('click');
		expect(onSelect.called).toBeTruthy();
  });

	it('must set the text content to "word"', () => {
		const wrapper = mount(<PredictionWord word="word"/>);
		expect(wrapper.text()).toBe('word');
	});
});

describe('<PredictionWords />', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<PredictionWords />);
		expect(wrapper.length).toBe(1);
  });

	describe('component functionality', () => {
		it('return null on prop:word => empty or undefined', () => {
			expect(PredictionWords({
				word:''
			})).toBeNull()
	  });

		it('return null on prop:words => empty or undefined', () => {
			expect(PredictionWords({
				word: 'test',
				words: {}
			})).toBeNull()
	  });

		it('return null when prop:word not in prop:words', () => {
			expect(PredictionWords({
				word: 'test',
				words: {one: ['two']}
			})).toBeNull()
	  });

		describe('rendering', () => {
			const props = {
				word: 'one',
				words: {one: ['two','three','four']}
			};

			it('render 3 children', () => {
				const wrapper = shallow(<PredictionWords {...props}/>);
				expect(wrapper.find('.PredictInput-prediction').props().children.length).toBe(3)
		  });

			it('render 1 child', () => {
				const wrapper = shallow(<PredictionWords {...props} max={1}/>);
				expect(wrapper.find('.PredictInput-prediction').props().children.length).toBe(1)
		  });
		});
	});
});

describe('<PredictInput />', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<PredictInput />);
		expect(wrapper.length).toBe(1);
  });

	sinon.spy(PredictInput.prototype, 'setWord');
	const wrapper = shallow(<PredictInput />);
	const input = wrapper.find('textarea');

	it('default state', () => {
		expect(wrapper.state()).toEqual({
			value: '',
			word: ''
		})
	});

	describe('component functionality', () => {
		describe('function setWord()', () => {
			it('must set the state:word to "setWord"', () => {
				wrapper.instance().setWord('setWord');
				expect(wrapper.state('word')).toBe('setWord');
			});
		});

		describe('function onInputChange()', () => {
			it('must call setWord() with "spy1"', () => {
				input.simulate('change', {target: {value: 'SPY1'}});
		    expect(PredictInput.prototype.setWord.calledWith('spy1')).toBeTruthy();
			});

			it('must update state:value to "theValue"', () => {
				input.simulate('change', {target: {value: 'theValue'}});
				expect(wrapper.state('value')).toBe('theValue');
			});

			it('state:word must update to "test"', () => {
				input.simulate('change', {target: {value: 'TEST'}});
				expect(wrapper.state('word')).toBe('test');
			});

			it('state:word must update to "jest"', () => {
				input.simulate('change', {target: {value: 'TEST Two jest'}});
				expect(wrapper.state('word')).toBe('jest');
			});

			it('state:word must update to "newline"', () => {
				input.simulate('change', {target: {value: 'the\nnewline'}});
				expect(wrapper.state('word')).toBe('newline');
			});
		});

		describe('function onWordSelect()', () => {
			it('state:value must update to "one three "', () => {
				wrapper.state().value = 'one';
				wrapper.instance().onWordSelect('three');
				expect(wrapper.state('value')).toBe('one three ')
			});

			it('must call setWord() with "spy2"', () => {
				wrapper.instance().onWordSelect('spy2');
		    expect(PredictInput.prototype.setWord.calledWith('spy2')).toBeTruthy();
			});
		});
	});
});
