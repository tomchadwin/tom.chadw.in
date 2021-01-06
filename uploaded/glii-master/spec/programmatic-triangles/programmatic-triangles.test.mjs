import { GLFactory } from "../../src/index.mjs";

describe("Progammatic triangles with aCoords+aColor", function() {
	it("One triangle with color per vertex", function() {
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
			glslType: "vec3",
			size: 256,
			growFactor: false,
		});
		const color = new glii.SingleAttribute({
			glslType: "vec4",
			size: 256,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({ size: 256, growFactor: false });

		const delta = Math.PI / 30;
		for (let i = 0; i < 30; i++) {
			const angle = (Math.PI * i) / 15;
			const angle1 = i % 2 ? angle - delta : angle + delta;
			const angle2 = i % 2 ? angle + delta : angle - delta;
			const j = i * 3;

			indices.set(j, [j, j + 1, j + 2]);

			coords.set(j, [0.5, 0.5, -0.5]);
			color.set(j, [1.0, 0.0, 0.0, 1.0]);

			coords.set(j + 1, [
				0.5 + 2.2 * Math.cos(angle1),
				0.5 + 2.2 * Math.sin(angle1),
				-0.5,
			]);
			color.set(j + 1, [0.0, 1.0, 0.0, 1.0]);

			coords.set(j + 2, [
				0.5 + 2.2 * Math.cos(angle2),
				0.5 + 2.2 * Math.sin(angle2),
				-0.5,
			]);
			color.set(j + 2, [0.0, 0.0, 1.0, 1.0]);
		}

		let clear = new glii.WebGL1Clear({ color: [1.0, 1.0, 1.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: varyings,
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/programmatic-triangles/star");
	});
});
