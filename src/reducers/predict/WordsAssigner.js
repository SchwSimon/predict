
export const assignWords = (newWords, words = {}) => {
	words = Object.assign({}, words);

		// assign unknown words / next words
		// increment the occurrences
	Object.keys(newWords).forEach((key) => {
		if (!words[key])	// new word
			words[key] = {};
		Object.keys(newWords[key]).forEach((subkey) => {
			if (!words[key][subkey])	// new next word
				words[key][subkey] = {count: 0};

				// increment next word occurrence count
				// when loading data from file the count key will be provided!
			words[key][subkey].count += newWords[key][subkey].count || newWords[key][subkey];
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
		}).reduce((acc, curr) => acc + curr, 0);
			// calculate the new next word weights
		subKeys.forEach((subkey) => {
			words[key][subkey].weight = (words[key][subkey].count / total).toFixed(2)*1;
		});
	});

	return {
		words: words,
		wordCount: wordsKeys.length
	}
}

export const nextWordsToSortedArray = (words) => {
	const sorted = {};
	Object.keys(words).forEach((key) => {
		let wordWeightArray = [];
		Object.keys(words[key]).forEach((subkey) => {
			wordWeightArray.push({
				word: subkey,
				weight: words[key][subkey].weight
			})
		});
		sorted[key] = wordWeightArray.sort((a, b) => {
			return a.weight < b.weight;
		}).map(element => element.word);
	});

	return sorted;
}

export const assignLeadingWords = (newWords, words = {}) => {
	words = Object.assign({}, words);

	Object.keys(newWords).forEach((key) => {
		if (!words[key])
			words[key] = {count:0};
		words[key].count = words[key].count + newWords[key].count;	// increment next word occurrence count
	});

	// calculate the word's probability as leading (starting/ending) word
	// prob(a) = num(a) / total
	const wordKeys = Object.keys(words);
		// count the total of next word occurrences
	let total = wordKeys.map((key) => {
		return words[key].count;
	}).reduce((acc, curr) => acc + curr, 0);
		// calculate the new next word weights
	wordKeys.forEach((key) => {
		words[key].weight = (words[key].count / total).toFixed(2)*1;
	});

	return words;
}
