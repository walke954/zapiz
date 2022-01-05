const assert = require('assert');

const intersects = require('../intersects');

const pt0 = { x: 3, y: 5 };
const pt1 = { x: 28, y: -1 };
const pt2 = { x: 8, y: 43 };
const pt3 = { x: -13, y: 5 };
const pt4 = { x: -3, y: -5 };

const cl0 = { x: 3, y: 5, r: 3 };
const cl1 = { x: 5, y: 4, r: 3 };
const cl2 = { x: -4, y: -5, r: 10 };
const cl3 = { x: 10, y: 8, r: 6 };
const cl4 = { x: 12, y: 22, r: 3 };

const rt0 = { x: -20, y: -10, w: 40, h: 20 };
const rt1 = { x: 4, y: 15, w: 23, h: 14 };
const rt2 = { x: -13, y: 5, w: 13, h: 2 };
const rt3 = { x: 7, y: -3, w: 3, h: 2 };
const rt4 = { x: 3, y: 5, w: 3, h: 4 };

describe('intersects', () => {
	it('square/square - should not intersect', () => {
		assert.strictEqual(intersects(rt0, rt1), false);
		assert.strictEqual(intersects(rt4, rt2), false);
		assert.strictEqual(intersects(rt1, rt2), false);
		assert.strictEqual(intersects(rt2, rt3), false);
		assert.strictEqual(intersects(rt3, rt4), false);
	});

	it('square/square - should intersect', () => {
		assert.strictEqual(intersects(rt0, rt2), true);
		assert.strictEqual(intersects(rt0, rt3), true);
		assert.strictEqual(intersects(rt0, rt4), true);
	});

	it('circle/square - should not intersect', () => {
		assert.strictEqual(intersects(rt0, cl4), false);
		assert.strictEqual(intersects(rt2, cl0), false);
		assert.strictEqual(intersects(rt3, cl0), false);
	});

	it('circle/square - should intersect', () => {
		assert.strictEqual(intersects(rt0, cl0), true);
		assert.strictEqual(intersects(rt1, cl0), true);
	});

	it('point/square - should not intersect', () => {
		// assert.strictEqual(intersects(), false);
	});

	it('point/square - should intersect', () => {
		// assert.strictEqual(intersects(), true);
	});

	it('circle/circle - should not intersect', () => {
		// assert.strictEqual(intersects(), false);
	});

	it('circle/circle - should intersect', () => {
		// assert.strictEqual(intersects(), true);
	});

	it('point/circle - should not intersect', () => {
		// assert.strictEqual(intersects(), false);
	});

	it('point/circle - should intersect', () => {
		// assert.strictEqual(intersects(), true);
	});
});
