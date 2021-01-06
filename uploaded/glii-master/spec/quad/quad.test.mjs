import { GLFactory } from "../../src/index.mjs";

describe("One quad", function() {
	it("renders red over clear green, IndexBuffer", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	vColor = aColor;
	gl_Position = vec4(aCoords, 1.0);
}`;
		let varyings = { vColor: "vec4" };
		var fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vColor;
}`;

		const coords = new glii.SingleAttribute({
			type: Int8Array,
			glslType: "vec3",
			size: 4,
			growFactor: false,
		});
		const color = new glii.SingleAttribute({
			type: Uint8Array,
			glslType: "vec4",
			size: 4,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 6, growFactor: false });

		indices.set(0, [0, 1, 2]);
		indices.set(3, [3, 1, 2]);

		coords.set(0, [-1, -1, 0]);
		coords.set(1, [-1, +1, 0]);
		coords.set(2, [+1, -1, 0]);
		coords.set(3, [+1, +1, 0]);
		color.set(0, [1.0, 0.0, 0.0, 1.0]);
		color.set(1, [1.0, 0.0, 0.0, 1.0]);
		color.set(2, [1.0, 0.0, 0.0, 1.0]);
		color.set(3, [1.0, 0.0, 0.0, 1.0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 1.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource,
			varyings,
			fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		let queue = expectPixelmatch(context, "spec/quad/red");

		color.set(0, [0, 0, 0, 1]);
		color.set(1, [1, 0, 0, 1]);
		color.set(2, [0, 1, 0, 1]);
		color.set(3, [0, 0, 1, 1]);

		clear.run();
		program.run();

		return (queue = queue.then(() => {
			return expectPixelmatch(context, "spec/quad/rgba-corners");
		}));
	});

	it("renders red over clear green, SequentialIndices TRIANGLE_STRIP", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	vColor = aColor;
	gl_Position = vec4(aCoords, 1.0);
}`;
		let varyings = { vColor: "vec4" };
		var fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vColor;
}`;

		const coords = new glii.SingleAttribute({
			type: Int8Array,
			glslType: "vec3",
			size: 4,
			growFactor: false,
		});
		const color = new glii.SingleAttribute({
			type: Uint8Array,
			glslType: "vec4",
			size: 4,
			growFactor: false,
		});

		let seqIndices = new glii.SequentialIndices({
			size: 4,
			drawMode: glii.TRIANGLE_STRIP,
		});

		coords.set(0, [-1, -1, 0]);
		coords.set(1, [-1, +1, 0]);
		coords.set(2, [+1, -1, 0]);
		coords.set(3, [+1, +1, 0]);
		color.set(0, [1.0, 0.0, 0.0, 1.0]);
		color.set(1, [1.0, 0.0, 0.0, 1.0]);
		color.set(2, [1.0, 0.0, 0.0, 1.0]);
		color.set(3, [1.0, 0.0, 0.0, 1.0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 1.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource,
			varyings,
			fragmentShaderSource,
			indexBuffer: seqIndices,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		let queue = expectPixelmatch(context, "spec/quad/red");

		color.set(0, [0, 0, 0, 1]);
		color.set(1, [1, 0, 0, 1]);
		color.set(2, [0, 1, 0, 1]);
		color.set(3, [0, 0, 1, 1]);

		clear.run();
		program.run();

		return (queue = queue.then(() => {
			return expectPixelmatch(context, "spec/quad/rgba-corners");
		}));
	});
});
