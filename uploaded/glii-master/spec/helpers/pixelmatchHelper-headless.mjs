import * as fs from "fs";
import { default as pixelmatch } from "../../3rd-party/pixelmatch.mjs";
import { PNG } from "pngjs";

global.expectPixelmatch = function expectPixelmatch(gl, expectedFilename, threshold = 0) {
	const w = gl.drawingBufferWidth;
	const h = gl.drawingBufferHeight;

	// Create a PNG encoder...
	const actualImage = new PNG({ height: h, width: w });

	// ...ead pixel colour data from the actual WebGLContext
	// and directly into the PNG encoder buffer...

	const pixels = new Uint8Array(w * h * 4);
	gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	// (but taking care about the order of the pixels: gl.readPixels
	// starts from the bottom and the PNG encoder expects starting
	// from the top).
	for (let y = 0; y < h; y++) {
		actualImage.data.set(
			pixels.subarray(y * w * 4, (y + 1) * w * 4),
			(h - y - 1) * w * 4
		);
	}

	// ...and write to a file. This could be async, as the test doesn't need
	// to wait until the file is fully written.
	// actualImage .pack() .pipe(fs.createWriteStream(expectedFilename + ".actual.png"));
	// Unfortunately using async writes might write partial files (the main thread
	// exits before the file has been fully written), so this will stick to
	// sync for now:
	fs.writeFileSync(expectedFilename + ".actual.png", PNG.sync.write(actualImage));

	try {
		fs.accessSync(expectedFilename + ".png", fs.constants.F_OK | fs.constants.R_OK);
	} catch (ex) {
		pending(
			"File " + expectedFilename + ".png missing. First time running this test?"
		);
		return Promise.resolve();
	}

	const expected = PNG.sync.read(fs.readFileSync(expectedFilename + ".png"));

	const diff = new PNG({ height: h, width: w });

	const numDiffPixels = pixelmatch(expected.data, actualImage.data, diff.data, w, h, {
		threshold: 0.1,
	});
	// console.log(diff.data);

	// Write the diff. As with the actual image, this could be async but
	// triggers race conditions that cause not-fully-written files.
	// diff.pack().pipe(fs.createWriteStream(expectedFilename + ".diff.png"));
	fs.writeFileSync(expectedFilename + ".diff.png", PNG.sync.write(diff));

	/// NOTE: headless pixel threshold is purposefully lower than browser, since
	/// the expected images have always been done by the MESA software renderer
	/// in headless mode. Therefore, they should *all* be aliased and more
	/// similar among them than to the browser-generated antialiased images.
	if (numDiffPixels > threshold / 10) {
		const msg =
			numDiffPixels +
			" pixels differ between actual and expected images for " +
			expectedFilename;

		// console.log(msg);
		fail(msg);
		return Promise.reject(msg);
	} else {
		const msg = "All pixels match for " + expectedFilename;
		// 			console.log(msg);
		expect().nothing();
		return Promise.resolve();
	}
};
