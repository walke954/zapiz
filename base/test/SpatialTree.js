const assert = require('assert');

const { intersects } = require('../intersects');
const SpatialTree = require('../SpatialTree');

let stree0; // square
let stree1; // long horizontally
let stree2; // long vertically
let trees;

const bad0 = {};
const bad1 = { p: 3, h: 2 };

const out0 = { x: 30, y: 0, w: 10, h: 10 };
const out1 = { x: 0, y: -30, w: 10, h: 10 };
const out2 = { x: -30, y: -30, w: 10, h: 10 };

const rect0 = { x: -4, y: -9, w: 10, h: 16 };
const rect1 = { x: 2, y: 13, w: 4, h: 11 };
const rect2 = { x: -22, y: -14, w: 18, h: 21 };
const rect3 = { x: -18, y: -5, w: 8, h: 7 };
const rect4 = { x: 1, y: 10, w: 5, h: 4 };
const rect5 = { x: 10, y: 10, w: 3, h: 4 };
const rect6 = { x: 0, y: 0, w: 5, h: 10 };
const rect7 = { x: 1, y: -5, w: 17, h:  6 };
const rect8 = { x: 5, y: -15, w: 7, h: 9 };
const rect9 = { x: -28, y: 2, w: 10, h: 7 };

const rectangles = [rect0, rect1, rect2, rect3, rect4, rect5, rect6, rect7, rect8, rect9];

const squareNodes = ['nw', 'ne', 'sw', 'se'];

function validate(tree) {
	if (!SpatialTree.isTree(tree)) {
		return false;
	}

	const bucket = tree._bucket;

	const nodes = [tree];

	while (nodes.length) {
		const node = nodes.pop();

		if (node._bucket !== bucket) {
			return false;
		}

		let valid = true;
		node._items.forEach((item) => {
			if (!intersects(node, item)) {
				valid = false;
			}
		});

		if (!valid) {
			return false;
		}

		if (node._depth && node.size > node._bucket) {
			if (node._nodes === null) {
				return false;
			}

			// validate divisions
			const ratio = node.w / node.h;
			if (ratio >= 1.5) {
				if (!SpatialTree.isTree(node._nodes.w) || !SpatialTree.isTree(node._nodes.e)) {
					return false;
				}
			} else if (ratio <= 0.75) {
				if (!SpatialTree.isTree(node._nodes.n) || !SpatialTree.isTree(node._nodes.s)) {
					return false;
				}
			} else {
				const v = SpatialTree.isTree(node._nodes.nw)
					&& SpatialTree.isTree(node._nodes.ne)
					&& SpatialTree.isTree(node._nodes.sw)
					&& SpatialTree.isTree(node._nodes.se)
				if (!v) {
					return false;
				}
			}

			nodes.push(...Object.values(node._nodes));
		} else if (node.size <= node._bucket && node._nodes !== null) {
			return false;
		}
	}

	return true;
}

describe('spatial tree', () => {
	beforeEach(() => {
		stree0 = new SpatialTree(-20, -20, 40, 40);
		stree1 = new SpatialTree(-20, 3, 40, 6, 2);
		stree2 = new SpatialTree(-3, -20, 6, 40, 2);

		rectangles.forEach((r) => {
			stree0.insert(r);
			stree1.insert(r);
			stree2.insert(r);
		});

		trees = [stree0, stree1, stree2];
	});

	it('insert - should return false on bad inputs', () => {
		const v0 = stree0.insert(bad0);
		const v1 = stree1.insert(bad1);

		assert.strictEqual(v0, false);
		assert.strictEqual(v1, false);
	});

	it('insert - should return false on out of bounds inputs', () => {
		const v0 = stree0.insert(out0);
		const v1 = stree1.insert(out1);
		const v2 = stree2.insert(out2);

		assert.strictEqual(v0, false);
		assert.strictEqual(v1, false);
		assert.strictEqual(v2, false);
	});

	it('insert - should return true for in bounds inputs', () => {
		rectangles.forEach((r) => {
			const v = stree0.insert(r);
			assert.strictEqual(v, true);
		});
	});

	it('insert - should expand nodes and insert correctly', () => {
		trees.forEach((t) => {
			assert.strictEqual(validate(t), true);
		});
	});

	it('remove - should collapse nodes correctly', () => {
		// only remove a slice
		rectangles.slice(4).forEach((r) => {
			stree0.remove(r);
			stree1.remove(r);
			stree2.remove(r);
		});

		trees.forEach((t) => {
			assert.strictEqual(validate(t), true);
		});
	});

	it('update - should update nodes correctly', () => {
		const update = { x: 6, y: 10, w: 5, h: 5 };

		stree0.update(rect0, update);

		Object.keys(update).forEach((key) => {
			update[key] = rect0[key];
		});

		stree0.update(update)
		assert.strictEqual(validate(stree0), true);
	});

	it('clear - should clear all nodes and items', () => {
		trees.forEach((t) => {
			assert.notStrictEqual(t._nodes, null);
			assert.notStrictEqual(t.size, 0);
			t.clear();
			assert.strictEqual(t._nodes, null);
			assert.strictEqual(t.size, 0);
		});
	});

	it('search - should return items that intersect bounds', () => {
		trees.forEach((t) => {
			const items = t.search({ x: 5, y: 3, w: 10, h: 8 });
			// console.log(items);
			// assert.strictEqual(t._nodes, null);
		});
	});
});
