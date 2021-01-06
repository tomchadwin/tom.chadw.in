import { GLFactory } from "../../src/index.mjs";

describe("One triangle, one Float32 SingleAttribute", function() {
	it("renders red over clear green", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		//
		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	gl_Position = vec4(aCoords, 1.0);
}`;
		var fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			type: Float32Array,
			size: 3,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 3, growFactor: false });

		indices.set(0, [0, 1, 2]);
		coords.set(0, [-0.5, -0.5, -0.5]);
		coords.set(1, [-0.5, +0.5, +0.5]);
		coords.set(2, [+0.5, 0, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 1.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: {},
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/one-triangle/red-over-green");
	});

	it("renders a triangle in a corner", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		//
		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	gl_Position = vec4(aCoords, 1.0);
}`;
		var fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			type: Float32Array,
			size: 3,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 3, growFactor: false });

		indices.set(0, [0, 1, 2]);
		coords.set(0, [-1, -1, 0]);
		coords.set(1, [-1, -0.9, 0]);
		coords.set(2, [-0.9, -1, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 0.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/one-triangle/one-corner");
	});
});

describe("One triangle, two Float32 `SingleAttribute`s", function() {
	it("One triangle with color per vertex", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const glii = new GLFactory(context);

		var vertexShaderSource = `
varying vec4 vColor;

void main() {
	vColor = aColor;
	gl_Position = vec4(aCoords, 1.0);
}`;
		var fragmentShaderSource = `precision mediump float;
varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 3,
			growFactor: false,
		});
		const color = new glii.SingleAttribute({
			glslType: "vec4",
			size: 3,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 3, growFactor: false });

		indices.set(0, [0, 1, 2]);

		coords.set(0, [-0.8, -0.8, -0.5]);
		color.set(0, [1.0, 0.0, 0.0, 1.0]);

		coords.set(1, [-0.7, +0.6, +0.5]);
		color.set(1, [0.0, 1.0, 0.0, 1.0]);

		coords.set(2, [+0.9, -0.1, 0.0]);
		color.set(2, [0.0, 0.0, 1.0, 1.0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 0.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		const queue = expectPixelmatch(context, "spec/one-triangle/cords-and-color-f32");

		coords.set(0, [-1, -1, -0.5]);
		color.set(0, [0.0, 1.0, 0.0, 1.0]);

		coords.set(1, [-1, +1, +0.5]);
		color.set(1, [1.0, 0.0, 0.0, 1.0]);

		coords.set(2, [1.0, -1.0, 0.0]);
		color.set(2, [0.0, 0.0, 1.0, 1.0]);

		clear.run();
		program.run();

		return queue.then(() => {
			return expectPixelmatch(context, "spec/one-triangle/cords-and-color-2-f32");
		});
	});
});
