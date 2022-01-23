function distance(x0, x1, y0, y1) {
	Math.sqrt(((x0 - x1) ** 2) + ((y0 - y1) ** 2));
}

module.exports = {
	distance
};
