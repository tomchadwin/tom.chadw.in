// Define, as a global, `contextFactory`.

const canvasesMap = {};

window.contextFactory = function contextFactory(w, h, opts) {
	if (canvasesMap[w + "+" + h]) {
		return canvasesMap[w + "+" + h];
	}
	const canvas = document.createElement("canvas");
	canvas.height = h;
	canvas.width = w;
	// 	document.body.appendChild(canvas);
	return (canvasesMap[w + "+" + h] = canvas);
};
