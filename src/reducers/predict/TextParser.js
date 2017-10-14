
const PHRASE_END_PUNCTUATION = '.';
const PHRASE_BREAK_PUNCTUATION = ',';

// extract & return the quoted text passages and the input text without them
function extractMarkedPhrases(text, mark, join, markedPhrases = []) {
	mark = (typeof mark === 'string') ? [mark,mark] : mark;
		// get the first quote position
	let quoteStart = text.indexOf(mark[0]);
	if (quoteStart > -1) {				
			// get the second quote position
		let quoteEnd = text.indexOf(mark[1], quoteStart+1);

		if (quoteEnd > -1) {
				// extract the text between 2 marks
			let quote = text.substr(quoteStart+1, quoteEnd-quoteStart-1).trim();
				// push new marked phrases to the marked text array, optionally set the phrase end punctuation if none is given
			markedPhrases.push((quote.slice(-1) !== PHRASE_END_PUNCTUATION) ? quote + PHRASE_END_PUNCTUATION : quote);
			
				// put the text together without the current mark
			text = text.substr(0, quoteStart) + text.substr(quoteEnd+1);
				
				// repeat till no more marked are given
			return extractMarkedPhrases(text, mark, join, markedPhrases);
		}
		
			// concat the rest of the text to the text if no dialog ending quote exists
		text = text.substr(0, quoteStart) + text.substr(quoteStart+1);
	}
	
	if (join)	// join the marked phrase(s) with the return text?
		text += ' ' + markedPhrases.join(' ');
	
	return text;
}

// parse the input text
// return 
export default function parseText(text, options = {}) {
	text = text.toLowerCase();	// treat input text in lowercase only
	
	console.log( text)
	
	text = text.replace(/[”“‘’«»]/g, '"')	// replace quotation marks to default: "
					.replace(/[´`’]/g, "'")		// replace apostrophe marks to default: ' 
					.replace(/[;?!:.]/g, PHRASE_END_PUNCTUATION)	// replace sentence ending or sentence breaking marks to default: . 
					.replace(/\n\s*\n/g, PHRASE_END_PUNCTUATION)	// replace double new lines to default: .
					.replace(/[,]/g, PHRASE_BREAK_PUNCTUATION);	// replace sentence break mark to default: ,

	text = extractMarkedPhrases(text, '"', options.joinQuoted || true);			// extract quoted phrases from the normal ones
	text = extractMarkedPhrases(text, ['(',')'], options.joinBraced || false);
	text = extractMarkedPhrases(text, ['{','}'], options.joinBrackets || false);	//...
	
	if (options.alnumOnly)
		text = text.replace(/[^0-9a-zöäü.,']/g, ' ')
	else if (options.lettersOnly)
		text = text.replace(/[^a-zöäü.,']/g, ' ')
		
	if (options.exclude) {
		options.exclude = (typeof options.exclude === 'string') ? [options.exclude] : options.exclude;
		options.exclude.forEach((str) => {
			text = text.replace(str, ' ');
		});
	}
	
	text = text.replace(/\.+/g, '.')		// remove multiple dots
					.replace(/\,+/g, ',')		// remove multiple commas
					.replace(/\s+/g, ' ')		// remove multiple spaces
					.replace(/[.]/g, PHRASE_END_PUNCTUATION + ' ')			// put a space after dots
					.replace(/[,]/g, PHRASE_BREAK_PUNCTUATION + ' ');	// 					... commas
	
	console.log( text )
	
	let wordsFeed = {};
	let startingWords = {};
	let endingWords = {};
	let isStartingWord = true;
	text.split(' ').forEach((word, index, array) => {
		if (!word) return;	// return if the word is empty
		
		let isEndingWord;
		switch(word.slice(-1)) {
			case PHRASE_END_PUNCTUATION: {
				word = word.slice(0, -1);
				isEndingWord = isStartingWord = true;
			} break;
			case PHRASE_BREAK_PUNCTUATION: {
				word = word.slice(0, -1);
				isEndingWord = isStartingWord = false;
			} break;
			default: isEndingWord = false;
		}
		
		if (!wordsFeed[word])	// do we know the word already?
			wordsFeed[word] = {};
		
		if (isEndingWord) {
			endingWords[word] = (endingWords[word] || 0) + 1;
			return;	// return on sentence end
		} else if (isStartingWord) {
			isStartingWord = false;
			startingWords[word] = (startingWords[word] || 0) + 1;
		}
		
		let nextWord = array[index+1];	// the next word of the current phrase
		if (typeof nextWord === 'undefined') {
			endingWords[word] = (endingWords[word] || 0) + 1;
			return;	// return on end of text
		}
		
		if (!nextWord) return;	// return if the word is empty
		
		switch(nextWord.slice(-1)) {
			case PHRASE_END_PUNCTUATION:
			case PHRASE_BREAK_PUNCTUATION: {
				nextWord = nextWord.slice(0, -1);
			} break;
			default: break;
		}

		wordsFeed[word][nextWord] = (wordsFeed[word][nextWord] || 0) + 1;	// increment the next word count for this word by 1
	});
	
	return {
		words: wordsFeed,
		starting: startingWords,
		ending: endingWords
	}
}
