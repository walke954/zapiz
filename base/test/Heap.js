const assert = require('assert');

const { Heap } = require('../index');

const vals = [4, 2, 6, 3, 7, 1, 2, 7, 3, 2, 3, 0];

const ascFn = (v0, v1) => v0 < v1;
const descFn = (v0, v1) => v0 > v1;

let heap0; // ascending heap
let heap1; // descending heap
let heap2; // ascending heap (b = 2)
let heap3; // descending heap (b = 2)

describe('heap', () => {
	beforeEach(() => {
		heap0 = new Heap(ascFn);
		heap1 = new Heap(descFn);
		heap2 = new Heap(ascFn, 2);
		heap3 = new Heap(descFn, 2);

		vals.forEach(v => heap0.insert(v));
		vals.forEach(v => heap1.insert(v));
		vals.forEach(v => heap2.insert(v));
		vals.forEach(v => heap3.insert(v));
	});

	it('insert - ascending order (default branching)', () => {
		assert.deepStrictEqual(
			heap0.show(),
			[0, 2, 2, 1, 7, 4, 2, 7, 6, 3, 3, 3]
		);
	});

	it('insert - descending order (default branching)', () => {
		assert.deepStrictEqual(
			heap1.show(),
			[7, 6, 7, 3, 2, 1, 2, 4, 3, 2, 3, 0]
		);
	});

	it('insert - ascending order insert (branching = 2)', () => {
		assert.deepStrictEqual(
			heap2.show(),
			[0, 2, 1, 3, 3, 2, 2, 7, 4, 7, 3, 6]
		);
	});

	it('insert - descending order (branching = 2) insert (branching = 2)', () => {
		assert.deepStrictEqual(
			heap3.show(),
			[7, 7, 4, 6, 3, 1 ,2, 2, 3, 2, 3, 0]
		);
	});

	it('peak - should see proper value', () => {
		assert.strictEqual(heap0.peak(), 0);
		assert.strictEqual(heap1.peak(), 7);
		assert.strictEqual(heap2.peak(), 0);
		assert.strictEqual(heap3.peak(), 7);
	});

	it('peak - length should not change', () => {
		heap0.peak();
		heap1.peak();
		heap2.peak();
		heap3.peak();

		assert.strictEqual(heap0.size, 12);
		assert.strictEqual(heap1.size, 12);
		assert.strictEqual(heap2.size, 12);
		assert.strictEqual(heap3.size, 12);
	});

	it('take - should see proper value', () => {
		const v0 = heap0.take();
		const v1 = heap1.take();
		const v2 = heap2.take();
		const v3 = heap3.take();

		assert.strictEqual(v0, 0);
		assert.strictEqual(v1, 7);
		assert.strictEqual(v2, 0);
		assert.strictEqual(v3, 7);
	});

	it('take - should reorder properly (default branching)', () => {
		const v0 = heap0.take();
		const v1 = heap1.take();

		assert.deepStrictEqual(
			heap0.show(),
			[1, 2, 2, 3, 7, 4, 2, 7, 6, 3, 3]
		);
		assert.deepStrictEqual(
			heap1.show(),
			[7, 6, 4, 3, 2, 1, 2, 0, 3, 2, 3]
		);
	});

	it('take - should reorder properly (branching = 2)', () => {
		const v2 = heap2.take();
		const v3 = heap3.take();

		assert.deepStrictEqual(
			heap2.show(),
			[1, 2, 2, 3, 3, 6, 2, 7, 4, 7, 3]
		);
		assert.deepStrictEqual(
			heap3.show(),
			[7, 6, 4, 3, 3, 1 ,2, 2, 0, 2, 3]
		);
	});

	it('remove - should return correct value', () => {
		const v0 = heap0.remove(4);
		const v1 = heap1.remove(4);
		const v2 = heap2.remove(4);
		const v3 = heap3.remove(4);

		assert.strictEqual(v0, 4);
		assert.strictEqual(v1, 4);
		assert.strictEqual(v2, 4);
		assert.strictEqual(v3, 4);
	});

	it('remove - should reorder properly (default branching)', () => {
		const v0 = heap0.remove(2);
		const v1 = heap1.remove(3);

		assert.deepStrictEqual(
			heap0.show(),
			[0, 2, 3, 1, 7, 4, 2, 7, 6, 3, 3]
		);
		assert.deepStrictEqual(
			heap1.show(),
			[7, 6, 7, 3, 2, 1, 2, 4, 3, 2, 0]
		);
	});

	it('remove - should reorder properly (branching = 2)', () => {
		const v2 = heap2.remove(1);
		const v3 = heap3.remove(4);

		assert.deepStrictEqual(
			heap2.show(),
			[0, 2, 2, 3, 3, 6, 2, 7, 4, 7, 3]
		);
		assert.deepStrictEqual(
			heap3.show(),
			[7, 7, 2, 6, 3, 1 ,0, 2, 3, 2, 3]
		);
	});

	it('update - should reorder properly (default branching)', () => {
		const v0 = heap0.update(2, 10);
		const v1 = heap1.update(3, 10);

		assert.deepStrictEqual(
			heap0.show(),
			[0, 2, 3, 1, 7, 4, 2, 7, 6, 10, 3, 3]
		);
		assert.deepStrictEqual(
			heap1.show(),
			[10, 6, 7, 7, 2, 1, 2, 4, 3, 2, 3, 0]
		);
	});

	it('update - should reorder properly (branching = 2)', () => {
		const v2 = heap2.update(1, 10);
		const v3 = heap3.update(4, 10);

		assert.deepStrictEqual(
			heap2.show(),
			[0, 2, 2, 3, 3, 6, 2, 7, 4, 7, 3, 10]
		);
		assert.deepStrictEqual(
			heap3.show(),
			[10, 7, 7, 6, 3, 1 ,2, 2, 3, 2, 3, 0]
		);
	});
});
