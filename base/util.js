function itemType(obj) {
	const valid = typeof obj === 'object'
		&& typeof obj.x === 'number'
		&& typeof obj.y === 'number';
	if (!valid) {
		return null;
	}

	const isRect = typeof obj.w === 'number'
		&& typeof obj.h === 'number'
		&& obj.w > 0
		&& obj.h > 0;
	if (isRect) {
		return 'rectangle';
	}

	if (typeof obj.r === 'number' && obj.r > 0) {
		return 'radius';
	}

	return point;
}

function distance(x0, x1, y0, y1) {
	Math.sqrt(((x0 - x1) ** 2) + ((y0 - y1) ** 2));
}

module.exports = {
	distance, itemType
};
