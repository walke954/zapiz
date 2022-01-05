class Heap {
	constructor(compFn, branches = 3) {
		if (typeof compFn !== 'function') {
			throw new Error('must define a compare function');
		}

		// compare function should return true if
		// param1 is higher priority than param2
		this._compFn = compFn;
		this._branches = branches;
		this._items = [];
	}

	peek() {
		const v = this._items[0];
		return v === undefined ? null : v;
	}

	take() {
		const v = this._items[0];
		if (v === undefined) {
			return null;
		}

		this._items[0] = this._items[this._items.length - 1];
		this._items.pop();

		this._pushDown(0);

		return v;
	}

	insert(v) {
		this._items.push(v);
		this._bubbleUp(this._items.length - 1);
	}

	remove(v) {
		const i = this._findIndex(v);
		if (i < 0) {
			return null;
		}

		this._items[i] = this._items[this._items.length - 1];
		this._items.pop();

		this._pushDown(i);

		return v;
	}

	update(val, newVal) {
		const i = this._findIndex(val);
		if (newVal !== null) {
			this._items[i] = newVal;
		}

		const parentIndex = Math.floor((i - 1) / this._branches);
		if (parentIndex < 0) {
			this._pushDown(i);
			return;
		}

		const comp = this._compFn(
			newVal ? newVal : val,
			this._items[parentIndex]
		);
		if (comp) {
			this._bubbleUp(i);
		} else {
			this._pushDown(i);
		}
	}

	show() {
		return this._items;
	}

	// NOTE: index is found using depth search
	_findIndex(v) {
		let queue = [0];
		while (queue.length) {
			const index = queue.pop();
			const item = this._items[index];
			if (item === v) {
				return index;
			}

			const comp = this._compFn(v, item);
			if (comp) {
				continue;
			}

			const start = (index * 3) + 1;
			if (start >= this._items.length) {
				continue;
			}

			let end = start + this._branches;
			end = end < this._items.length ? end : this._items.length;
			for (let i = start; i < end; i += 1) {
				queue.push(i);
			}
		}

		return -1;
	}

	_bubbleUp(index) {
		const v = this._items[index];

		let currentIndex = index;
		while (currentIndex !== 0) {
			const parentIndex = Math.floor((currentIndex - 1) / this._branches);

			const comp = this._compFn(v, this._items[parentIndex]);
			if (comp) {
				this._items[currentIndex] = this._items[parentIndex];
				currentIndex = parentIndex;
				continue;
			}

			break;
		}

		this._items[currentIndex] = v;
	}

	_pushDown(index) {
		const v = this._items[index];

		let currentIndex = index;
		while (currentIndex < this._items.length) {
			const start = (currentIndex * this._branches) + 1;
			const end = start + this._branches;

			let highestVal = this._items[start];
			if (highestVal === undefined) {
				break;
			}

			let highestIndex = start;
			for (let i = start + 1; i < end; i += 1) {
				const item = this._items[i];
				if (item === undefined) {
					break;
				}

				const comp = this._compFn(item, highestVal);
				if (comp) {
					highestIndex = i;
					highestVal = this._items[i];
				}
			}

			const comp = this._compFn(highestVal, v);
			if (!comp) {
				break;
			}

			this._items[currentIndex] = highestVal;
			currentIndex = highestIndex;
		}

		this._items[currentIndex] = v;
	}

	get size() {
		return this._items.length;
	}
}

module.exports = Heap;
