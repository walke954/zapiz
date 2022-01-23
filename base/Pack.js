const ItemType = require('./ItemType');

const { TYPES } = ItemType;

function niave(arr) {
	let width = 0;
	let height = 0;
	const vals = [];

	if (arr[0]) {
		height = arr[0].h;
	}

	while (arr.length) {
		const it = arr.shift();
		it.x = width;
		it.y = 0;
		width += it.w;
		vals.push(it);
	}

	return { width, height, vals };
}

function rectsort(a, b) {
	if (a.h < b.h) {
		return 1;
	}

	if (a.h > b.h) {
		return -1;
	}

	if (a.w < b.w) {
		return 1;
	}

	return -1;
}

class Pack {
	static rectangles(arr) {
		const rects = arr.filter((item) => {
			return ItemType.analyze(item) === TYPES.RECTANGLE_NO_POS
		});

		const copy = rects.map((v) => {
			const rot = v.w > v.h;
			return {
				w: rot ? v.h : v.w,
				h: rot ? v.w : v.h,
				rot,
				ref: v
			};
		});
		copy.sort(rectsort);
		return niave(copy);
	}
}

module.exports = Pack;
