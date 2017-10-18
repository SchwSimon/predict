
export function assignNewWords(words, nWords) {
	words = Object.assign({}, words);
	
		// assign unknown words / next words
		// increment the occurrences
	Object.keys(nWords).forEach((key) => {
		Object.keys(nWords[key]).forEach((subkey) => {
			if (!words[key])	// new word
				words[key] = {};
			if (!words[key][subkey])	// new next word
				words[key][subkey] = {count: 0};
				
				// increment next word occurrence count
				// when loading data from file the count key will be provided!
			words[key][subkey].count += nWords[key][subkey].count || nWords[key][subkey];
		});
	});		
	
		// an array containing the words as keys
	const wordsKeys = Object.keys(words);
		// calculate the next word's occurrence probability
		// prob(a) = num(a) / total
	wordsKeys.forEach((key) => {
		let subKeys = Object.keys(words[key]);
			// count the total of next word occurrences
		let total = subKeys.map((subkey) => {
			return words[key][subkey].count;
		}).reduce((acc, curr) => acc + curr);
			// calculate the new next word weights
		subKeys.forEach((subkey) => {
			words[key][subkey].weight = words[key][subkey].count / total;
		});
	});
	
		// precalculate the words next words occurrence probability sequence
	let wordsWeighted = {};
	wordsKeys.forEach((key) => {
		let wordWeightArray = [];
		Object.keys(words[key]).forEach((subkey) => {
			wordWeightArray.push({
				word: subkey,
				weight: words[key][subkey].weight
			})
		});
		wordsWeighted[key] = wordWeightArray.sort((a, b) => {
			return a.weight < b.weight;
		}).map(element => element.word);
	});
	
	return {
		words: words,
		wordsWeighted: wordsWeighted,
		wordsCount: wordsKeys.length
	}
}

export function assignLeadingWords(words, nWords) {
	words = Object.assign({}, words);
	
	Object.keys(nWords).forEach((key) => {
		if (!words[key])
			words[key] = {count:0};
		words[key].count = words[key].count + nWords[key];	// increment next word occurrence count
	});
	
	// calculate the word's probability as leading (starting/ending) word
	// prob(a) = num(a) / total
	const wordKeys = Object.keys(words);
		// count the total of next word occurrences
	let total = wordKeys.map((key) => {
		return words[key].count;
	}).reduce((acc, curr) => acc + curr);
		// calculate the new next word weights
	wordKeys.forEach((key) => {
		words[key].weight = words[key].count / total;
	});
	
	
	return words;
}