function validate(obj) {
	return typeof obj === 'object'
		&& typeof obj.x === 'number'
		&& typeof obj.y === 'number'
		&& typeof obj.w === 'number'
		&& typeof obj.h === 'number'
		&& obj.w >= 0
		&& obj.h >= 0;
}

function intersects(tree, obj) {
	if (tree._x + tree._w <= obj.x || obj.x + obj.w <= tree._x) {
		return false;
	}

	if (tree._y + tree._h <= obj.y || obj.y + obj.h <= tree._y) {
		return false;
	}

	return true;
}

class SpatialTree {
	constructor(x, y, w, h, bucket = 4, depth = 6) {
		const valid = validate({ x, y, w, h });
		if (!valid) {
			throw new Error('invalid parameters');
		}

		this._x = x;
		this._y = y;
		this._w = w < 0 ? 0 : w;
		this._h = h < 0 ? 0 : h;
		this._bucket = bucket;
		this._depth = depth;

		this._items = new Set();
		this._nodes = null;
	}

	insert(obj) {
		const valid = validate(obj);
		const overlap = intersects(this, obj);
		if (!valid || !overlap) {
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
			})
		}

		return true;
	}

	update(obj, newVal) {
		let updated = false;

		const has = this._items.has(obj);
		const overlap = intersects(this, newVal || obj);
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
				updated = this.insert(newVal || obj);
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

	get size() {
		return this._items.size;
	}
}

module.exports = SpatialTree;
