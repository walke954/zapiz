const { distance } = require('./util');
const ItemType = require('./ItemType');

const { TYPES } = ItemType;

function pointPointIntersect(obj0, obj1) {
	return obj0.x === obj1.x && obj0.y === obj1.y;
}

function rectRectIntersect(obj0, obj1) {
	if (obj0.x + obj0.w <= obj1.x || obj1.x + obj1.w <= obj0.x) {
		return false;
	}

	if (obj0.y + obj0.h <= obj1.y || obj1.y + obj1.h <= obj0.y) {
		return false;
	}

	return true;
}

function circleCircleIntersect(obj0, obj1) {
	const d = distance(obj0.x, obj1.x, obj0.y, obj1.y);
	return d < obj0.r + obj1.r;
}

function pointCircleIntersect(pt, cl) {
	const d = distance(pt.x, cl.x, pt.y, cl.y);
	return d < cl.r;
}

function pointRectIntersect(pt, rt) {
	if (pt.x <= rt.x || rt.x + rt.w <= pt.x) {
		return false;
	}

	if (pt.y <= rt.y || rt.y + rt.h <= pt.y) {
		return false;
	}

	return true;
}

function circleRectIntersect(cl, rt) {
	const outside = cl.x + cl.r <= rt.x
		|| cl.x - cl.r >= rt.x + rt.w
		|| cl.y + cl.r <= rt.y
		|| cl.y - cl.r >= rt.y + rt.h;
	if (outside) {
		return false;
	}

	if (cl.x <= rt.x) {
		const dx = rt.x - cl.x;
		if (cl.y <= rt.y) {
			return distance(cl.x, rt.x, cl.y, rt.y) < cl.r;
		}

		if (cl.y >= rt.y + rt.h) {
			return distance(cl.x, rt.x, cl.y, rt.y + rt.h) < cl.r;
		}
	}

	if (cl.x >= rt.x + rt.w) {
		const dx = cl.x - rt.x + rt.w;
		if (cl.y <= rt.y) {
			return distance(cl.x, rt.x + rt.w, cl.y, rt.y) < cl.r;
		}

		if (cl.y >= rt.y + rt.h) {
			return distance(cl.x, rt.x + rt.w, cl.y, rt.y + rt.h) < cl.r;
		}
	}

	return true;
}

function rectRectContain(rt0, rt1) {
	return rt0.x <= rt1.x
		&& rt0.y <= rt1.y
		&& rt0.x + rt0.w >= rt1.x + rt1.w
		&& rt0.y + rt0.h >= rt1.y + rt1.h;
}

function circleCircleContain(cl0, cl1) {
	const d = distance(cl0.x, cl1.x, cl0.y, cl1.y);
	return d + cl1.r <= cl0.r;
}

function circleRectContain(cl, rt) {
	const corners = [
		[rt.x, rt.y],
		[rt.x, rt.y + rt.h],
		[rt.x + rt.w, rt.y + rt.h],
		[rt.x + rt.w, rt.y]
	];

	return corners.every((corner) => {
		const [x, y] = corner;
		const d = distance(x, cl.x, y, cl.y);
		return d <= cl.r;
	});
}

function rectCircleContain(rt, cl) {
	if (rt.x > cl.x - cl.r || rt.x + rt.w < cl.x + cl.r) {
		return false;
	}

	if (rt.y > cl.y - cl.r || rt.y + rt.h < cl.y + cl.r) {
		return false;
	}

	return true;
}

class Intersect {
	static intersects(obj0, obj1) {
		const type0 = itemType(obj0);
		const type1 = itemType(obj1);

		if (type0 === TYPES.POINT) {
			if (type1 === TYPES.POINT) {
				return pointPointIntersect(obj0, obj1);
			}

			if (type1 === TYPES.CIRCLE) {
				return pointCircleIntersect(obj0, obj1);
			}

			if (type1 === TYPES.RECTANGLE) {
				return pointRectIntersect(obj0, obj1);
			}
		}

		if (type0 === TYPES.CIRCLE) {
			if (type1 === TYPES.POINT) {
				return pointCircleIntersect(obj1, obj0);
			}

			if (type1 === TYPES.CIRCLE) {
				return circleCircleIntersect(obj0, obj1);
			}

			if (type1 === TYPES.RECTANGLE) {
				return circleRectIntersect(obj0, obj1);
			}
		}

		if (type0 === TYPES.RECTANGLE) {
			if (type1 === TYPES.POINT) {
				return pointRectIntersect(obj1, obj0);
			}

			if (type1 === TYPES.CIRCLE) {
				return circleRectIntersect(obj1, obj0);
			}

			if (type1 === TYPES.RECTANGLE) {
				return rectRectIntersect(obj0, obj1);
			}
		}

		return false;
	}

	// obj0 contains obj1
	static contains(obj0, obj1) {
		const type0 = itemType(obj0);
		const type1 = itemType(obj1);

		if (type0 === TYPES.POINT && type1 === TYPES.POINT) {
			return pointPointIntersect(obj0, obj1);
		}

		if (type0 === TYPES.CIRCLE) {
			if (type1 === TYPES.POINT) {
				return pointCircleIntersect(obj1, obj0);
			}

			if (type1 === TYPES.CIRCLE) {
				return circleCircleContain(obj0, obj1);
			}

			if (type1 === TYPES.RECTANGLE) {
				return circleRectContain(obj0, obj1);
			}
		}

		if (type0 === TYPES.RECTANGLE) {
			if (type1 === TYPES.POINT) {
				return pointRectIntersect(obj1, obj0);
			}

			if (type1 === TYPES.CIRCLE) {
				return rectCircleContain(obj1, obj0);
			}

			if (type1 === TYPES.RECTANGLE) {
				return rectRectContain(obj0, obj1);
			}
		}

		return false;
	}
}

module.exports = Intersect;
