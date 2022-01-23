const TYPES = {
	RECTANGLE: 0,
	RECTANGLE_NO_POS: 1,
	CIRCLE: 2,
	POINT: 3
};

function positionlessType(obj) {
	const isRect = typeof obj.w === 'number'
		&& typeof obj.h === 'number'
		&& obj.w > 0
		&& obj.h > 0;
	if (isRect) {
		return TYPES.RECTANGLE_NO_POS;
	}

	return null;
}

function positionType(obj) {
	const isRect = typeof obj.w === 'number'
		&& typeof obj.h === 'number'
		&& obj.w > 0
		&& obj.h > 0;
	if (isRect) {
		return TYPES.RECTANGLE;
	}

	if (typeof obj.r === 'number' && obj.r > 0) {
		return TYPES.CIRCLE;
	}

	return TYPES.POINT;
}

class ItemType {
	static analyze(obj) {
		if (typeof obj !== 'object') {
			return null;
		}

		if (typeof obj.x === 'number' && typeof obj.y === 'number') {
			return positionType(obj);
		}

		return positionlessType(obj);
	}

	static get TYPES() {
		return TYPES;
	}
}

module.exports = ItemType;
