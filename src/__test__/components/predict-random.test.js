import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { PredictRandom, randomIndex } from '../../components/predict-random';
import { parseText } from '../../reducers/predict/TextParser';
import { assignWords, nextWordsToSortedArray, assignLeadingWords } from '../../reducers/predict/WordsAssigner';

describe('function randomIndex()', () => {
	it('must return 0', () => {
		const stub = sinon.stub(Math, 'random').returns(0);
		expect(randomIndex(4)).toBe(0);
		stub.restore();
	});

	it('must return 3', () => {
		const stub = sinon.stub(Math, 'random').returns(0.9);
		expect(randomIndex(4)).toBe(3);
		stub.restore();
	});
});

describe('<PredictRandom />', () => {
	const wrapper = shallow(<PredictRandom words={{}} startingWords={{}} endingWords={{}}/>);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	describe('interation', () => {
		it('must trigger onGenerate() -> generateRandomText() -> setText()', () => {
			sinon.spy(PredictRandom.prototype, 'generateRandomText');
			sinon.spy(PredictRandom.prototype, 'setText');

			wrapper.find('.PredictRandom-btn').simulate('click');

			expect(PredictRandom.prototype.generateRandomText.called).toBeTruthy();
			expect(PredictRandom.prototype.setText.called).toBeTruthy();
		});
	});

	describe('function setText()', () => {
		it('must set the state correctly', () => {
			wrapper.instance().setText('Set Text')
			expect(wrapper.state('text')).toBe('Set Text')
		});
	});

	describe('function generateRandomText()', () => {
		it('must return empty string on 0 args or empty object(s)', () => {
			expect(wrapper.instance().generateRandomText()).toBe('');
		});

		const textData = parseText('Start middle ending.');
		const randomData = {
			words: assignWords(textData.words).words,
			startingWords: assignLeadingWords(textData.starting),
			endingWords: assignLeadingWords(textData.ending)
		};
		const randomMatch = (match, substrArgs) => {
			for(let i = 0; i < 100; i++) {
				if (match !== wrapper.instance().generateRandomText(randomData).substr(...substrArgs))
					return false;
			}
			return true;
		}

		it('must always return the same starting word', () => {
			expect(randomMatch('Start', [0, 5])).toBe(true);
		});

		it('must always return the same ending word', () => {
			expect(randomMatch('ending.', [-7])).toBe(true);
		});
	});
});
