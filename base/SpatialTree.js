const Intersect = require('./Intersect');

function validateParams(obj) {
	return typeof obj === 'object'
		&& typeof obj.x === 'number'
		&& typeof obj.y === 'number'
		&& typeof obj.w === 'number'
		&& typeof obj.h === 'number'
		&& obj.w >= 0
		&& obj.h >= 0;
}

class SpatialTree {
	constructor(x, y, w, h, bucket = 4, depth = 6) {
		const valid = validateParams({ x, y, w, h });
		if (!valid) {
			throw new Error('invalid parameters');
		}

		this._x = x;
		this._y = y;
		this._w = w;
		this._h = h;
		this._bucket = bucket;
		this._depth = depth;

		this._items = new Set();
		this._nodes = null;
	}

	insert(obj) {
		const overlap = Intersect.intersects(this, obj);
		if (!overlap) {
			return false;
		}

		this._items.add(obj);
		if (this._depth === 0) {
			return true;
		}

		if (this._items.size <= this._bucket) {
			return true;
		}

		this._expand();
		Object.values(this._nodes).forEach((node) => {
			node.insert(obj);
		});

		return true;
	}

	remove(obj) {
		const has = this._items.has(obj);
		if (!has) {
			return false;
		}

		this._items.delete(obj);
		if (this._items.size <= this._bucket) {
			this._nodes = null;
		} else {
			Object.values(this._nodes).forEach((node) => {
				node.remove(obj);
			});
		}

		return true;
	}

	update(obj, newVal) {
		let updated = false;

		const insert = newVal || obj;

		const has = this._items.has(obj);
		const overlap = Intersect.intersects(this, insert);
		if (overlap) {
			if (has) {
				if (newVal) {
					this.remove(obj);
					this.insert(newVal);
				} else {
					Object.values(this._nodes).forEach((node) => {
						const v = node.update(obj);
						if (v) {
							updated = true;
						}
					});
				}
			} else {
				updated = this.insert(insert);
			}
		} else if (has) {
			updated = this.remove(obj);
		}

		return updated;
	}

	clear() {
		this._items.clear();
		this._nodes = null;
	}

	// intersect search
	search(obj) {
		const results = new Set();

		const overlap = Intersect.intersects(this, obj);
		if (!overlap) {
			return results;
		}

		const contained = Intersect.contains(obj, this);
		if (contained) {
			this._items.forEach(it => results.add(it));
			return results;
		}

		if (this._nodes !== null) {
			Object.values(this._nodes).forEach((node) => {
				const rs = node.search(obj);
				rs.forEach(it => results.add(it));
			});
		} else {
			this._items.forEach((it) => {
				const ol = intersects(it, obj);
				if (ol) results.add(it);
			});
		}

		return results;
	}

	// contain search
	search2(obj) {
		const results = new Set();

		const overlap = Intersect.intersects(this, obj);
		if (!overlap) {
			return results;
		}

		const contained = Intersect.contains(obj, this);
		if (contained) {
			this._items.forEach(it => results.add(it));
			return results;
		}

		if (this._nodes !== null) {
			Object.values(this._nodes).forEach((node) => {
				const rs = node.search2(obj);
				rs.forEach(it => results.add(it));
			});
		} else {
			this._items.forEach((it) => {
				const ol = Intersect.contains(it, obj);
				if (ol) results.add(it);
			});
		}

		return results;
	}

	static isTree(t) {
		return t instanceof SpatialTree;
	}

	_expand() {
		if (this._nodes !== null) {
			return false;
		}

		this._nodes = {};

		const depth = this._depth - 1;

		const midW = this._w / 2;
		const midX = this._x + midW;
		const midH = this._h / 2;
		const midY = this._y + midH;

		const ratio = this._w / this._h;
		if (ratio >= 1.5) {
			// horizontal nodes
			this._nodes.w = new SpatialTree(
				this._x, this._y, midW, this._h,
				this._bucket, depth
			);
			this._nodes.e = new SpatialTree(
				midX, this._y, midW, this._h,
				this._bucket, depth
			);
		} else if (ratio <= 0.75) {
			// vertical nodes
			this._nodes.s = new SpatialTree(
				this._x, this._y, this._w, midH,
				this._bucket, depth
			);
			this._nodes.n = new SpatialTree(
				this._x, midY, this._w, midH,
				this._bucket, depth
			);
		} else {
			// square nodes
			this._nodes.nw = new SpatialTree(
				this._x, midY, midW, midH,
				this._bucket, depth
			);
			this._nodes.ne = new SpatialTree(
				midX, midY, midW, midH,
				this._bucket, depth
			);
			this._nodes.sw = new SpatialTree(
				this._x, this._y, midW, midH,
				this._bucket, depth
			);
			this._nodes.se = new SpatialTree(
				midX, this._y, midW, midH,
				this._bucket, depth
			);
		}

		this._items.forEach((item) => {
			Object.values(this._nodes).forEach((node) => {
				node.insert(item);
			});
		});

		return true;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	get w() {
		return this._w;
	}

	get h() {
		return this._h;
	}

	get size() {
		return this._items.size;
	}
}

module.exports = SpatialTree;
