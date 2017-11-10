import {
	PHRASE_END_PUNCTUATION,
	PHRASE_BREAK_PUNCTUATION,
	extractMarkedPhrases,
	excludeText,
	sanitizeTextBeforeExtract,
	sanitizeTextAfterExtract,
	parseText
} from '../../../reducers/predict/TextParser';

describe('constants', () => {
	it('PHRASE_END_PUNCTUATION must be "."', () => {
		expect(PHRASE_END_PUNCTUATION).toBe('.');
	});

	it('PHRASE_BREAK_PUNCTUATION must be ","', () => {
		expect(PHRASE_BREAK_PUNCTUATION).toBe(',');
	});
});

describe('function extractMarkedPhrases()', () => {
	it('must throw error if mark is not a string or array', () => {
		expect(() => extractMarkedPhrases('')).toThrow();
	});

	it('must throw error if mark is an empty string', () => {
		expect(() => extractMarkedPhrases('', '')).toThrow();
	});

	it('must throw error if mark is an array of length < 2', () => {
		expect(() => extractMarkedPhrases('', [''])).toThrow();
	});

	it('must throw error if mark is an array of empty strings', () => {
		expect(() => extractMarkedPhrases('', ['', ''])).toThrow();
	});

	it('must return empty string on empty string argument', () => {
		expect(extractMarkedPhrases('', '"')).toBe('');
	});

	describe('exclude / include by markers', () => {
		const textA = 'one "a b c" two';
		const textB = 'one "a b c" two, three: "a b c".';
		const textC = 'one [a b c] two';
		const textD = 'one [a b c] two, three: [a b c].';

		it('must exclude', () => {
			const resultA = 'one . two';
			const resultB = 'one . two, three: ..'
			expect(extractMarkedPhrases(textA, '"')).toBe(resultA);
			expect(extractMarkedPhrases(textB, '"')).toBe(resultB);
			expect(extractMarkedPhrases(textC, ['[',']'])).toBe(resultA);
			expect(extractMarkedPhrases(textD, ['[',']'])).toBe(resultB);
		});

		it('must include', () => {
			const resultA = 'one . two. a b c.';
			const resultB = 'one . two, three: ... a b c. a b c.';
			expect(extractMarkedPhrases(textA, '"', true)).toBe(resultA);
			expect(extractMarkedPhrases(textB, '"', true)).toBe(resultB);
			expect(extractMarkedPhrases(textC, ['[',']'], true)).toBe(resultA);
			expect(extractMarkedPhrases(textD, ['[',']'], true)).toBe(resultB);
		});
	});
});

describe('function excludeText()', () => {
	it('return empty string', () => {
		expect(excludeText()).toBe('');
		expect(excludeText('')).toBe('');
	});

	it('must throw error if exclude is not an array', () => {
		expect(() => excludeText('', false)).toThrow();
	});

	it('must throw error if exclude array element is not string', () => {
		expect(() => excludeText('', [1])).toThrow();
	});

	it('must exclude right', () => {
		expect(excludeText('one two three four five', ['one two', 'five'])).toBe('  three four  ');
		expect(excludeText('one two three four five', ['five'])).toBe('one two three four  ');
		expect(excludeText('one two three four five', 'one')).toBe('  two three four five');
		expect(excludeText('one two three four five', 'one')).toBe('  two three four five');
	});
});

describe('function sanitizeTextBeforeExtract()', () => {
	it('must throw error if argument is not a string', () => {
		expect(() => sanitizeTextBeforeExtract()).toThrow();
	});

	it('must return without sanitation', () => {
		expect(sanitizeTextBeforeExtract('text word')).toBe('text word');
	});

	describe('replacements', () => {
		const result = '  word';

		it('must remove "constructor"', () => {
			expect(sanitizeTextBeforeExtract('constructor word')).toBe(result);
		});

		it('must remove urls', () => {
			expect(sanitizeTextBeforeExtract('https://abc.com word')).toBe(result);
			expect(sanitizeTextBeforeExtract('https://www.abc.com word')).toBe(result);
			expect(sanitizeTextBeforeExtract('http://abc.com word')).toBe(result);
			expect(sanitizeTextBeforeExtract('http://www.abc.com word')).toBe(result);
			expect(sanitizeTextBeforeExtract('www.abc.com word')).toBe(result);
		});

		it('must replace quotation marks to: "', () => {
			expect(sanitizeTextBeforeExtract('”“«»')).toBe('""""');
		});

		it('must replace apostrophe marks to: \'', () => {
			expect(sanitizeTextBeforeExtract('´`’‘')).toBe("''''");
		});

		it('must replace sentence ending characters to: .', () => {
			expect(sanitizeTextBeforeExtract('?;!:')).toBe("....");
		});

		it('must replace double lines breaks to: .', () => {
			expect(sanitizeTextBeforeExtract('\n\n')).toBe(".");
		});

		it('must replace double lines breaks to: .', () => {
			expect(sanitizeTextBeforeExtract('\n\n')).toBe(".");
		});

		it('must disallow numbers by default', () => {
			expect(sanitizeTextBeforeExtract('12 34')).toBe('     ');
		});
		it('must allow numbers', () => {
			expect(sanitizeTextBeforeExtract('12 34', true)).toBe('12 34');
		});

		it('must disallow special characters by default', () => {
			expect(sanitizeTextBeforeExtract('$§&_')).toBe('    ');
		});
		it('must allow special', () => {
			expect(sanitizeTextBeforeExtract('$§&_', false, true)).toBe('$§&_');
		});
	});
});

describe('function sanitizeTextAfterExtract()', () => {
	it('must throw error if argument is not a string', () => {
		expect(() => sanitizeTextAfterExtract()).toThrow();
	});

	it('must return without sanitation', () => {
		expect(sanitizeTextAfterExtract('text word')).toBe('text word');
	});

	describe('replacements', () => {
		it('must replace multiple apostrophes to a single one', () => {
			expect(sanitizeTextAfterExtract("a'''b")).toBe("a'b");
		});

		it('must replace multiple hyphens to a single one', () => {
			expect(sanitizeTextAfterExtract("a---b")).toBe("a-b");
		});

		it('must replace multiple dots to a single one with a trailing space', () => {
			expect(sanitizeTextAfterExtract("a...b")).toBe("a. b");
			expect(sanitizeTextAfterExtract("a.b.c.")).toBe("a. b. c. ");
		});

		it('must replace multiple commas to a single one with a trailing space', () => {
			expect(sanitizeTextAfterExtract("a,,,b")).toBe("a, b");
			expect(sanitizeTextAfterExtract("a,b,c,")).toBe("a, b, c, ");
		});

		it('must remove floating apostrophes', () => {
			expect(sanitizeTextAfterExtract(" ' ' ' ")).toBe(' ');
		});

		it('must remove floating hyphens', () => {
			expect(sanitizeTextAfterExtract("- - -")).toBe(' ');
		});

		it('must remove floating dots', () => {
			expect(sanitizeTextAfterExtract(". . .")).toBe(' ');
		});

		it('must remove floating commas', () => {
			expect(sanitizeTextAfterExtract(", , ,")).toBe(' ');
		});

		it('must remove multiple spaces', () => {
			expect(sanitizeTextAfterExtract("     ")).toBe(' ');
		});
	});
});

describe('function parseText()', () => {
	it('must return an empty object structure on empty text', () => {
		expect(parseText('')).toEqual({
			words: {},
			starting: {},
			ending: {},
			inputWords: 0,
		});
	});

	it('must parse right', () => {
		expect(parseText('a B c b c D. d. x Y, X y')).toEqual({
			words: {
				a: {b: 1}, b: {c: 2},
				c: {b: 1, d: 1}, d: {},
				x: {y: 2}, y: {}
			},
			starting: {a: {count: 1}, x: {count: 2}},
			ending: {d: {count: 2}, y: {count: 2}},
			inputWords: 11,
		});
	});
});
