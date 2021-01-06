import { GLFactory } from "../../src/index.mjs";

describe("Clear command", function() {
	it("clears to opaque white", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const canvasGlii = new GLFactory(context);

		let clear = new canvasGlii.WebGL1Clear({ color: [1.0, 1.0, 1.0, 1.0] });

		clear.run();

		return expectPixelmatch(context, "spec/clear/white");
	});

	it("clears to opaque black", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const canvasGlii = new GLFactory(context);

		let clear = new canvasGlii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });

		clear.run();

		return expectPixelmatch(context, "spec/clear/black");
	});

	it("clears to transparent", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const canvasGlii = new GLFactory(context);

		let clear = new canvasGlii.WebGL1Clear({ color: [0.5, 0.5, 0.5, 0.0] });

		clear.run();

		return expectPixelmatch(context, "spec/clear/transparent");
	});
});
