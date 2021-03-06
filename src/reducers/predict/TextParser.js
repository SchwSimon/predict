// TODO: parseText() needs more refinement

export const PHRASE_END_PUNCTUATION = '.';
export const PHRASE_BREAK_PUNCTUATION = ',';

/*
 * Firefox only issue, when the words "watch" or "unwatch" are getting assigned,
 * it will cause a TypeError later when parsing the object.
 * Because we handle all text in lower case only the other prototypes are not an issue because they are camelcased
 * Except for the constructor, so we just regex that word out..
 */
delete Object.prototype.watch;
delete Object.prototype.unwatch;

/*
 * extract text between the given marks
 * return the text with or without the extracted text
 */
export const extractMarkedPhrases = (text, mark, join = false, markedTexts = []) => {
		// force array for start & ending mark
	mark = (typeof mark === 'string') ? [mark,mark] : mark;

	if (!mark || !Array.isArray(mark) || !mark[0] || !mark[1])
		throw new Error('mark must be a non-empty string or array of non-empty strings of length 2');

		// get the starting mark position
	let markStart = text.indexOf(mark[0]);
	if (markStart > -1) {
			// get the ending mark position
		let markEnd = text.indexOf(mark[1], markStart+1);

		if (markEnd > -1) {
				// extract the text between the 2 marks
			let markedText = text.substr(markStart+1, markEnd-markStart-1).trim();
				// push it to the marked texts array
				// set a phrase end punctuation if none is given at the end of the marked text
			markedTexts.push((markedText.slice(-1) !== PHRASE_END_PUNCTUATION) ? markedText + PHRASE_END_PUNCTUATION : markedText);

				// put the text together without the marked text
			text = text.substr(0, markStart) + PHRASE_END_PUNCTUATION + text.substr(markEnd+1);

				// repeat till no more marks are given
			return extractMarkedPhrases(text, mark, join, markedTexts);
		}

			// concat the rest without the starting mark to the text if no ending mark is given
		text = text.substr(0, markStart) + text.substr(markStart+1);
	}

	if (join)	// append the marked phrase(s) to the text without marks
		text += '. ' + markedTexts.join(' ');

	return text;
}

export const excludeText = (text = '', exclude = []) => {
	if (typeof exclude === 'string')
		exclude = [exclude];
	else if (!Array.isArray(exclude))
		throw new Error('exclude argument must be String or Array');

		// remove @exclude strings
	exclude.forEach((str) => {
		str = str.trim();
		if (!str) return;	// return on empty string
		text = text.replace(new RegExp(str.toLowerCase(), 'g'), ' ');
	});

	return text;
}

export const sanitizeTextBeforeExtract = (text, allowNumbers = false, allowSpecials = false) => {
	text = text.replace(/constructor/g, ' ')				// remove the word "constructor", see the issue described at the beginning of the script
		.replace(/(?:https?):\/\/[\n\S]+/g, ' ')			// remove urls (https:// & http://)
		.replace(/(?:www?).[\n\S]+/g, ' ')						// remvove urls (www.)
		.replace(/[”“«»]/g, '"')											// replace quotation marks to default: "
		.replace(/[´`’‘]/g, "'")											// replace apostrophe marks to default: '
		.replace(/[?;!:]/g, PHRASE_END_PUNCTUATION)		// replace sentence ending or sentence breaking marks to default phrase ending punctuation
		.replace(/\n\s*\n/g, PHRASE_END_PUNCTUATION);	// replace double new lines to default phrase ending punctuation

	if (!allowNumbers)
		text = text.replace(/[0-9]/g, ' ');	// remove numbers

	if (!allowSpecials)
		text = text.replace(/[^0-9a-zöäüéèôêëç.,'"-]/g, ' ');	// remove non alphanumeric characters

	return text;
}

export const sanitizeTextAfterExtract = (text) => (
	text.replace(/'+/g, "'")			// remove multiple apostrophes
		.replace(/-+/g, '-')				// remove multiple hyphens
		.replace(/\.+/g, '.')				// remove multiple dots
		.replace(/,+/g, ',')				// remove multiple commas
		.replace(/[.]/g, PHRASE_END_PUNCTUATION + ' ')		// put a space after dots
		.replace(/[,]/g, PHRASE_BREAK_PUNCTUATION + ' ')	// put a space after commas
			// floating replaces are all made twice
			// because shit does not work as it should...
		.replace(/(^|\s+)'(\s+|$)/g, ' ')		// remove floating apostrophes
			.replace(/(^|\s+)'(\s+|$)/g, ' ')
		.replace(/(^|\s+)-(\s+|$)/g, ' ')		// remove floating hyphens
			.replace(/(^|\s+)-(\s+|$)/g, ' ')
		.replace(/(^|\s+)\.(\s+|$)/g, ' ')	// remove floating dots
			.replace(/(^|\s+)\.(\s+|$)/g, ' ')
		.replace(/(^|\s+),(\s+|$)/g, ' ')		// remove floating commas
			.replace(/(^|\s+),(\s+|$)/g, ' ')
		.replace(/\s+/g, ' ')								// remove multiple spaces
)

/*
 * feed text parser
 * return a proper parsed text ready for training
 */
export const parseText = (text, options = {}) => {
	options = (typeof options !== 'object') ? {} : options;
	
	text = text.toLowerCase();	// treat input text in lowercase only

	if (options.exclude)
		text = excludeText(text, options.exclude);

	text = sanitizeTextBeforeExtract(text, options.allowNumbers, options.allowSpecials);

	text = extractMarkedPhrases(text, '"', options.joinQuotes);
	text = extractMarkedPhrases(text, ['(',')'], options.joinRoundBrackets);
	text = extractMarkedPhrases(text, ['{','}'], options.joinCurlyBrackets);
	text = extractMarkedPhrases(text, ['[',']'], options.joinSquareBrackets);

	text = sanitizeTextAfterExtract(text);

	let wordsFeed = {};
	let startingWords = {};
	let endingWords = {};
	let isStartingWord = true;
	let inputWords = text.split(' ').filter((word) => {
		return !(word === '' || word === '.');	// filter empty array elements
	});

		// count the new input words
	const inputWordsCount = inputWords.length;

		// compute the input words
	inputWords.forEach((word, index, array) => {
			// remove the word punctuation if needed and set the word position meaning
		let isEndingWord;
		switch(word.slice(-1)) {
			case PHRASE_END_PUNCTUATION:
			case PHRASE_BREAK_PUNCTUATION:
				word = word.slice(0, -1);
				isEndingWord = isStartingWord = true;
				break;
			default: isEndingWord = false;
		}

		if (!wordsFeed[word])
			wordsFeed[word] = {};

		if (isEndingWord) {
			if (!endingWords[word])
				endingWords[word] = {count: 0};
			endingWords[word].count++;
			return;	// return on sentence end
		} else if (isStartingWord) {
			isStartingWord = false;
			if (!startingWords[word])
				startingWords[word] = {count: 0};
			startingWords[word].count++;
		}

		let nextWord = array[index+1];	// get this word's follow up
		if (typeof nextWord === 'undefined') {
			if (!endingWords[word])
				endingWords[word] = {count: 0};
			endingWords[word].count++;
			return;	// return on last word
		}

			// slice the next word's punctuation if needed
		switch(nextWord.slice(-1)) {
			case PHRASE_END_PUNCTUATION:
			case PHRASE_BREAK_PUNCTUATION:
				nextWord = nextWord.slice(0, -1);
				break;
			default: break;
		}

			// add to the words feed and increment the appearence counter
		wordsFeed[word][nextWord] = (wordsFeed[word][nextWord] || 0) + 1;	// increment the next word count for this word by 1
	});

	return {
		words: wordsFeed,
		starting: startingWords,
		ending: endingWords,
		inputWords: inputWordsCount
	}
}

export default parseText;
