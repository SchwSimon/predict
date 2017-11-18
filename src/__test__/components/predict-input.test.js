import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { PredictInput, PredictionWords, PredictionWord } from '../../components/predict-input';

Enzyme.configure({ adapter: new Adapter() });

describe('<PredictionWord />', () => {
	const onWordSelectSpy = sinon.spy();
	const wrapper = shallow(<PredictionWord onWordSelect={onWordSelectSpy} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('must trigger onWordSelect with args', () => {
		wrapper.simulate('click', {target: {textContent: 'text'}});
		expect(onWordSelectSpy.calledWith('text')).toBeTruthy();
  });
});

describe('<PredictionWords />', () => {
	const props = {
		word: 'word',
		words: {
			word: ['1', '2', '3', '4', '5']
		},
		max: 3
	};
	const wrapper = shallow(<PredictionWords {...props}/>);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('must render 3 list items', () => {
		expect(wrapper.find('.PredictInput-prediction').props().children.length).toBe(3)
  });

	it('must return null on !props.word', () => {
		expect(PredictionWords(
			Object.assign({}, props, {
				word: ''
			})
		)).toBeNull()
  });

	it('must return null on !props.words', () => {
		expect(PredictionWords(
			Object.assign({}, props, {
				words: {}
			})
		)).toBeNull()
  });

	it('must return null on !props.words', () => {
		expect(PredictionWords(
			Object.assign({}, props, {
				words: {abc: []}
			})
		)).toBeNull()
  });
});

describe('<PredictInput />', () => {
	const wrapper = shallow(<PredictInput />);
	const defaultState = wrapper.state();

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(defaultState).toEqual({
			value: '',
			word: ''
		});
  });

	describe('functionality', () => {
		describe('function onInputChange()', () => {
			const value = ' VALUE ';
			wrapper.find('.PredictInput-input').simulate('change', {
				target: {value: value}
			});
			const state = Object.assign({}, wrapper.state());

			it('must set the correct state', () => {
				const lastWord = value.trim().replace(/\n(?=[^\n]*$)/, ' ');
				expect(state).toEqual({
					value: value,
					word: lastWord.slice(-lastWord.length + lastWord.lastIndexOf(' ')+1).toLowerCase()
				});
			});
		});

		describe('function onWordSelect()', () => {
			const prevValue = 'prevValue';
			const word = 'word';
			wrapper.state().value = prevValue;
			wrapper.instance().onWordSelect(word);

			it('must set the correct state', () => {
				expect(wrapper.state()).toEqual({
					value: prevValue.replace(/ +$/g,"") + ' ' + word + ' ',
					word: word
				});
			});
		});
	});
});
