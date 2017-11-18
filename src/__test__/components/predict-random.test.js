import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { PredictRandom, randomIndex } from '../../components/predict-random';
import { parseText } from '../../reducers/predict/TextParser';
import { assignWords, nextWordsToSortedArray, assignLeadingWords } from '../../reducers/predict/WordsAssigner';

Enzyme.configure({ adapter: new Adapter() });

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
	const props = {
		words: {},
		startingWords: {},
		endingWords: {}
	}
	const wrapper = shallow(<PredictRandom {...props} />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(wrapper.state()).toEqual({
			text: ''
		});
  });

	describe('functionality', () => {
		describe('function generateRandomText()', () => {
			it('must return empty string on 0 words', () => {
				expect(wrapper.instance().generateRandomText({
					words: {},
					startingWords: {a:''},
					endingWords: {b:''}
				})).toBe('');
			});

			it('must return empty string on 0 starting words', () => {
				expect(wrapper.instance().generateRandomText({
					words: {a:''},
					startingWords: {},
					endingWords: {b:''}
				})).toBe('');
			});

			it('must return empty string on 0 endingwords', () => {
				expect(wrapper.instance().generateRandomText({
					words: {a:''},
					startingWords: {b:''},
					endingWords: {}
				})).toBe('');
			});


			const randomMatch = (match, substrArgs) => {
				for(let i = 0; i < 100; i++) {
					if (match !== wrapper.instance().generateRandomText(randomData).substr(...substrArgs))
						return false;
				}
				return true;
			}

			it('must contain each word atleast once', () => {
				const parsed = parseText('Start middle ending.');
				const data = {
					words: assignWords(parsed.words).words,
					startingWords: assignLeadingWords(parsed.starting),
					endingWords: assignLeadingWords(parsed.ending)
				};
				const randomText = wrapper.instance().generateRandomText(data);
				expect(randomText).toMatch(/Start/);
				expect(randomText).toMatch(/middle/);
				expect(randomText).toMatch(/ending/);
				expect(randomText).toMatch(/\./);
			});
		});

		describe('function onGenerate()', () => {
			const setTextStub = sinon.stub(wrapper.instance(), 'setText');
			const generateRandomTextStub = sinon.stub(wrapper.instance(), 'generateRandomText')
				.returns(123);
			wrapper.find('.PredictRandom-btn').simulate('click');
			setTextStub.restore();
			generateRandomTextStub.restore();

			it('must trigger setText with args', () => {
				expect(setTextStub.calledWith(123)).toBeTruthy();
			});

			it('must trigger generateRandomText with args', () => {
				expect(generateRandomTextStub.calledWith({
					words: props.words,
					startingWords: props.startingWords,
					endingWords: props.endingWords
				})).toBeTruthy();
			});
		});

		describe('function setText()', () => {
			it('must set the state correctly', () => {
				wrapper.instance().setText('text')
				expect(wrapper.state().text).toBe('text')
			});
		});
	});
});
