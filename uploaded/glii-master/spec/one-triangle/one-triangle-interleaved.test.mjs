import { GLFactory } from "../../src/index.mjs";

describe("One triangle, one normalized Int16 SingleAttribute", function() {
	it("renders red over clear green", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		const coordsColor = new glii.InterleavedAttributes(
			{
				size: 3,
			},
			[
				{
					glslType: "vec3",
					type: Float32Array,
				},
				{
					glslType: "vec4",
					type: Uint8Array,
					normalized: true,
				},
			]
		);

		const indices = new glii.IndexBuffer({ size: 3, growFactor: false });

		indices.set(0, [0, 1, 2]);

		coordsColor.setFields(0, [
			[-0.8, -0.8, -0.5],
			[255, 0, 0, 255],
		]);
		coordsColor.setFields(1, [
			[-0.7, +0.6, +0.5],
			[0, 255, 0, 255],
		]);
		// 			coordsColor.setFields(2, [[+0.9, -0.1, 0.0], [0, 0, 255, 255]]);

		coordsColor.setField(2, 0, [+0.9, -0.1, 0.0]);
		coordsColor.setField(2, 1, [0, 0, 255, 255]);

		const clear = new glii.WebGL1Clear({ color: [0.2, 0.2, 0.2, 1.0] });
		const program = new glii.WebGL1Program({
			vertexShaderSource: `
void main() {
	vColor = aColor;
	gl_Position = vec4(aCoords, 1.0);
}`,
			varyings: { vColor: "vec4" },
			fragmentShaderSource: `
void main() {
	gl_FragColor = vColor;
}`,
			indexBuffer: indices,
			// 				attributeBuffers: [attributeBuffer],
			attributes: {
				aCoords: coordsColor.getBindableAttribute(0),
				aColor: coordsColor.getBindableAttribute(1),
			},
		});

		clear.run();
		program.run();

		const queue = expectPixelmatch(context, "spec/one-triangle/interleaved-1", 1);

		coordsColor.setFields(1, [
			[-0.8, +0.3, +0.5],
			[0, 255, 128, 255],
		]);

		coordsColor.setField(0, 0, [-0.1, -0.6, 0.0]);
		coordsColor.setField(2, 1, [128, 0, 255, 255]);

		clear.run();
		program.run();

		return queue.then(() => {
			return expectPixelmatch(context, "spec/one-triangle/interleaved-2");
		});
	});
});
