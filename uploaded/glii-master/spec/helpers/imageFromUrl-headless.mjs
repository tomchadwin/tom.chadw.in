// import { PNG } from '../../../node_modules/pngjs/lib/png.js';
import { PNG } from "pngjs";
import * as fs from "fs";
import * as path from "path";

global.imagePromiseFromUrl = function imagePromiseFromUrl(url) {
	const dir = path.dirname(String(import.meta.url).replace("file:/", ""));
	const fullUrl = path.resolve(path.join(dir, "..", url));

	return new Promise((res, rej) => {
		fs.createReadStream(fullUrl)
			.pipe(new PNG())
			.on("parsed", function() {
				res(this);
			})
			.on("error", rej);
	});
};
