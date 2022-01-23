function checkMatch(searchBuffer, lookahead) {
	if (searchBuffer.charAt(0) !== lookahead.charAt(0)) {
		return null;
	}

	let length = 0;
	let searching = true;
	while (searching) {
		for (let i = 0; i < searchBuffer.length; i += 1) {
			const schar = searchBuffer.charAt(i);
			const mchar = lookahead.charAt(length);

			if (schar !== mchar) {
				searching = false;
				break;
			}

			length += 1;
		}
	}

	return length;
}

function repeat(match, length) {
	const repeats = Math.floor(length / match.length);
	const remainder = length % match.length;

	return match.repeat(repeats) + match.slice(0, remainder);
}

class Compressor {
	static compress(windowSize, searchBufferSize, raw) {
		let data = '';

		let counter = 0;
		while (counter < raw.length) {
			let incr = 1;

			const offset = counter < searchBufferSize ? 0 : counter - searchBufferSize;
			const searchBuffer = raw.slice(offset, counter);
			const lookahead = raw.slice(counter, counter + windowSize - searchBufferSize);

			let match = { offset: 0, length: 0 };
			for (let i = 0; i < searchBuffer.length; i += 1) {
				const length = checkMatch(searchBuffer.slice(i), lookahead);
				if (!length || length <= match.length) {
					continue;
				}

				match = { offset: searchBuffer.length - i, length };
			}

			if (match.length) {
				const chunk = `(${match.offset.toString(BASE)},${match.length.toString(BASE)})`;
				if (chunk.length < match.length) {
					data += chunk;
					counter += match.length;
					continue;
				}
			}

			let char = lookahead.charAt(0);
			if (char === '(') {
				char = `\\${char}`;
			}

			data += char;
			counter += incr;
		}

		return data;
	}

	static decompress(raw) {
		let tx = raw;

		// decode data
		let data = '';

		while (tx.length) {
			// add escaped chars
			const char = tx.charAt(0);
			if (char === '\\') {
				const nchar = tx.charAt(1);
				if (nchar === '(') {
					data += '(';
					tx = tx.slice(2);
					continue;
				}
			}

			// add non-encoded chars
			if (char !== '(') {
				data += char;
				tx = tx.slice(1);
				continue;
			}

			// decode slice
			let eSlice = '';
			for (let i = 0; i < tx.length; i += 1) {
				const echar = tx.charAt(i);

				eSlice += echar;
				if (echar ===  ')') {
					break;
				}
			}

			let [offset, length] = eSlice.slice(1, -1).split(',');
			offset = parseInt(offset, BASE);
			length = parseInt(length, BASE);

			const start = data.length - offset;
			const match = data.slice(start, start + length);

			data += repeat(match, length);
			tx = tx.slice(eSlice.length);
		}

		return data;
	}
}

module.exports = Compressor;
