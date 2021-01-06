import { default as pixelmatch } from "../../3rd-party/pixelmatch.mjs";

window.expectPixelmatch = function expectPixelmatch(
	originCanvas,
	expectedFilename,
	threshold = 0
) {
	const w = originCanvas.width;
	const h = originCanvas.height;

	// Get 2d context for the gl's canvas
	const actualCanvas = document.createElement("canvas");
	actualCanvas.width = w;
	actualCanvas.height = h;
	const actualCtx = actualCanvas.getContext("2d");
	actualCtx.drawImage(originCanvas, 0, 0);

	const img = document.createElement("img");

	return new Promise((resolve, reject) => {
		img.onerror = () => {
			const actualImg = document.createElement("img");
			const container = document.createElement("div");
			container.textContent = expectedFilename;
			actualImg.style.border = "1px solid black";
			actualImg.style.background = "url('transparent-background-hatch.png')";
			document.body.appendChild(container);
			container.appendChild(actualImg);

			actualCanvas.toBlob(function(actualBlob) {
				actualImg.src = URL.createObjectURL(actualBlob);
			});

			pending(
				"File " +
					expectedFilename +
					".png missing. First time running this test? Running from file:// ?"
			);
			reject();
		};

		img.onload = () => {
			const expectedCanvas = document.createElement("canvas");
			expectedCanvas.height = h;
			expectedCanvas.width = w;
			const expectedCtx = expectedCanvas.getContext("2d");
			expectedCtx.drawImage(img, 0, 0);
			// 				const diffBuffer = new Uint8Array(w * h * 4);
			const diffCanvas = document.createElement("canvas");
			diffCanvas.height = h;
			diffCanvas.width = w;
			const ctxDiff = expectedCanvas.getContext("2d", { alpha: false });
			const diffBuffer = ctxDiff.createImageData(w, h);

			const numDiffPixels = pixelmatch(
				actualCtx.getImageData(0, 0, w, h).data,
				expectedCtx.getImageData(0, 0, w, h).data,
				diffBuffer.data,
				w,
				h,
				{
					threshold: 0.1,
				}
			);

			if (numDiffPixels > threshold) {
				const msg =
					numDiffPixels +
					" pixels differ between actual and expected images for " +
					expectedFilename;

				const actualImg = document.createElement("img");
				const diffImg = document.createElement("img");

				const bytes = w * h * 4;
				// 					for (let i = 0; i < bytes; i++) {
				// 						diffBuffer.data[i] = diffBuffer[i];
				// 					}

				// Create a second diff canvas because for whatever
				// reason running putImageData() on the first one doesn't
				// work
				const diffCanvas2 = document.createElement("canvas");
				diffCanvas2.height = h;
				diffCanvas2.width = w;

				const container = document.createElement("div");
				container.textContent = expectedFilename;
				img.style.border = "1px solid cyan";
				actualImg.style.border = "1px solid black";
				diffImg.style.border = "1px solid green";
				img.style.background = "url('transparent-background-hatch.png')";
				actualImg.style.background = "url('transparent-background-hatch.png')";
				// 					diffCanvas2.style.border = "1px solid red";
				document.body.appendChild(container);
				container.appendChild(img);
				container.appendChild(actualImg);
				container.appendChild(diffImg);

				const diffCtx2 = diffCanvas2.getContext("2d");
				diffCtx2.putImageData(diffBuffer, 0, 0);

				actualCanvas.toBlob(function(actualBlob) {
					actualImg.src = URL.createObjectURL(actualBlob);
				});

				diffCanvas2.toBlob(function(diffBlob) {
					diffImg.src = URL.createObjectURL(diffBlob);
				});

				// console.log(msg);
				fail(msg);
				reject(msg);
			} else {
				const msg = "All pixels match for " + expectedFilename;
				// 					console.log(msg);
				expect().nothing();
				resolve();
			}
		};

		img.src = "../" + expectedFilename + ".png";
	});
};
