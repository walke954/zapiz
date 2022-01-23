const assert = require('assert');

const Pack = require('../Pack');

const rects = [
	{ w: 5, h: 3 },
	{ w: 2, h: 6 },
	{ w: 1, h: 5 },
	{ w: 3, h: 3 },
	{ w: 2, h: 2 },
	{ w: 5, h: 5 },
	{ w: 6, h: 2 },
	{ w: 1, h: 1 },
	{ w: 3, h: 2 },
	{ w: 2, h: 4 }
];

describe('Pack', () => {
	it('rectangles - should try to pack with smallest area', () => {
		const pack = Pack.rectangles(rects);
		console.log(pack);
	});
});
