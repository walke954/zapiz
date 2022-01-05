const { intersects, contains } = require('./intersects');
const { distance } = require('./util');

module.exports = {
	Heap: require('./Heap'),
	SpatialTree: require('./SpatialTree'),
	intersects,
	contains,
	distance
};
