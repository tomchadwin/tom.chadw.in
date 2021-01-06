window.imagePromiseFromUrl = function imagePromiseFromUrl(url) {
	return new Promise((res, rej) => {
		const img = document.createElement("img");
		img.addEventListener("load", () => {
			res(img);
		});
		img.addEventListener("error", rej);
		img.src = "./" + url;
	});
};
