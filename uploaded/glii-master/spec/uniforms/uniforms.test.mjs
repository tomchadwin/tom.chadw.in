import { GLFactory } from "../../src/index.mjs";

describe("Uniforms", function() {
	const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
	const glii = new GLFactory(context);

	it("rotate one triangle, via float angle", function() {
		const vertexShaderSource = `
float ca = cos(uAngle);
float sa = sin(uAngle);
mat3 transform = mat3(
	ca, -sa,  0,
	sa,  ca,  0,
	 0,   0,  0
);

void main() {
	gl_Position = vec4(transform * aCoords, 1.0);
}`;
		const fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vec4(uColour, 1.0);
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 3,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 3, growFactor: false });

		indices.set(0, [0, 1, 2]);
		coords.set(0, [-0.5, -0.5, -0.5]);
		coords.set(1, [-0.5, +0.5, +0.5]);
		coords.set(2, [+0.5, 0, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.5, 0.5, 0.5, 0.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords },
			uniforms: {
				uAngle: "float",
				uColour: "vec3",
			},
		});

		clear.run();
		program.run();
		const exps = [];
		exps.push(expectPixelmatch(context, "spec/uniforms/rotate-trig-1"));

		program.setUniform("uAngle", 0.1);
		program.run();
		exps.push(expectPixelmatch(context, "spec/uniforms/rotate-trig-2", 2));

		program.setUniform("uAngle", 0.2);
		program.setUniform("uColour", [0.05, 0.15, 0.08]);
		program.run();
		exps.push(expectPixelmatch(context, "spec/uniforms/rotate-trig-3", 11));
		return Promise.all(exps);
	});

	it("rotate one triangle, via 3x3 transform matrix", function() {
		const vertexShaderSource = `
void main() {
	gl_Position = vec4(uTransform * aCoords, 1.0);
}`;
		const fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vec4(uColour, 1.0);
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 3,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 3, growFactor: false });

		indices.set(0, [0, 1, 2]);
		coords.set(0, [-0.5, -0.5, -0.5]);
		coords.set(1, [-0.5, +0.5, +0.5]);
		coords.set(2, [+0.5, 0, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.5, 0.5, 0.5, 0.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords },
			uniforms: {
				uTransform: "mat3",
				uColour: "vec3",
			},
		});

		clear.run();
		// prettier-ignore
		program.setUniform("uTransform", [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]);

		program.run();
		const exps = [];
		exps.push(expectPixelmatch(context, "spec/uniforms/rotate-trig-mat-1", 1));

		// prettier-ignore
		program.setUniform("uTransform", [
			Math.cos(-0.1), -Math.sin(-0.1), 0,
			Math.sin(-0.1),  Math.cos(-0.1), 0,
			            0,               0 , 1,
		]);
		program.run();
		exps.push(expectPixelmatch(context, "spec/uniforms/rotate-trig-mat-2", 2));

		// prettier-ignore
		program.setUniform("uTransform", [
			Math.cos(-0.2), -Math.sin(-0.2), 0,
			Math.sin(-0.2),  Math.cos(-0.2), 0,
			            0,               0,  1,
		]);
		program.setUniform("uColour", [0.05, 0.15, 0.08]);
		program.run();
		exps.push(expectPixelmatch(context, "spec/uniforms/rotate-trig-mat-3", 15));
		return Promise.all(exps);
	});

	/// TODO: another test with a mat2 rotation matrix
});
