
export function assignNewWords(words, nWords) {
	words = Object.assign({}, words);
	
	Object.keys(nWords).forEach((key) => {
		Object.keys(nWords[key]).forEach((subkey) => {
			if (!words[key])	// new word
				words[key] = {};
			if (!words[key][subkey])	// new next word
				words[key][subkey] = {count: 0};
			words[key][subkey].count += nWords[key][subkey];	// increment next word occurrence count
		});
	});		
	
	// prob(a)=num(a)/total
	Object.keys(words).forEach((key) => {
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
	
	let wordsWeighted = {};
	Object.keys(words).forEach((key) => {
		let wordWeightArray = [];
		Object.keys(words[key]).forEach((subkey) => {
			wordWeightArray.push({
				word: subkey,
				weight: words[key][subkey]
			})
		});
		wordsWeighted[key] = wordWeightArray.sort((a, b) => {
			return a.weight < b.weight;
		}).map((element) => {
			return element.word;
		});
	});
	
	return {
		words: words,
		wordsWeighted: wordsWeighted
	}
}

export function assignLeadingWords(words, nWords) {
	words = Object.assign({}, words);
	
	Object.keys(nWords).forEach((key) => {
		words[key] = (words[key] || 0) + nWords[key];	// increment next word occurrence count
	});
	
	return words;
}