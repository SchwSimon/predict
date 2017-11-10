import {
	assignWords,
	nextWordsToSortedArray,
	assignLeadingWords
} from '../../../reducers/predict/WordsAssigner';

import { parseText } from '../../../reducers/predict/TextParser';

const parsedText = parseText('a b a b a b c a c b. c c c a. f');
const assignedWords = {
	a: {
		b: {count: 6, weight: 0.75},
		c: {count: 2, weight: 0.25}
	},
	b: {
		a: {count: 4, weight: 0.67},
		c: {count: 2, weight: 0.33}
	},
	c: {
		a: {count: 3, weight: 0.5},
		b: {count: 1, weight: 0.17},
		c: {count: 2, weight: 0.33},
	},
	f: {}
};

describe('function assignWords()', () => {
	const oldWords = {
		a: {
			b: {count: 3, weight: 0.75},
			c: {count: 1, weight: 0.25}
		},
		b: {
			a: {count: 2, weight: 0.67},
			c: {count: 1, weight: 0.33}
		},
		c: {
			a: {count: 1, weight: 1.00}
		}
	};

	it('must correctly assign parsed words', () => {
		const assigned = assignWords(parseText('a b a b a b c a c').words);
		expect(assigned.words).toEqual(oldWords);
		expect(assigned.wordCount).toBe(3);
	});

	it('must correctly assign parsed words on existing object', () => {
		const assigned = assignWords(parsedText.words, oldWords);
		expect(assigned.words).toEqual(assignedWords);
		expect(assigned.wordCount).toBe(4);
	});
});

describe('function nextWordsToSortedArray()', () => {
	it('must return correctly sorted next words', () => {
		expect(nextWordsToSortedArray(assignedWords)).toEqual({
			a: ['b','c'],
			b: ['a','c'],
			c: ['a','c','b'],
			f: []
		})
	});
});

describe('function assignLeadingWords()', () => {
	it('must correctly assign words', () => {
		expect(assignLeadingWords(parsedText.starting)).toEqual({
			a: {count: 1, weight: 0.33},
			c: {count: 1, weight: 0.33},
			f: {count: 1, weight: 0.33}
		});
	});

	it('must correctly assign words on existing object', () => {
		expect(assignLeadingWords(parsedText.starting, parseText('a b. a c. a d. f').starting)).toEqual({
			c: {count: 1, weight: 0.14},
			a: {count: 4, weight: 0.57},
			f: {count: 2, weight: 0.29}
		});
	});
});
