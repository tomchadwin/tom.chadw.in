import { GLFactory } from "../../src/index.mjs";
import { default as Allocator } from "../../src/Allocator.mjs";

describe("Sparse indices", function() {
	it("does three quads", function() {
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

		let quadCount = 7;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 4 * quadCount,
			growFactor: false,
		});
		const color = new glii.SingleAttribute({
			glslType: "vec4",
			size: 4 * quadCount,
			growFactor: false,
		});

		let indices = new glii.SparseIndices({ size: 6 * quadCount, growFactor: false });
		let vertexAllocator = new Allocator();

		let quadStartSlots = {};

		for (let i = 0; i < quadCount; i++) {
			// Allocate 6 slots (for 2 triangles)...
			let s = indices.allocateSlots(6);
			quadStartSlots[i] = s;

			// ...and allocate 4 vertices
			let v = vertexAllocator.allocateBlock(4);

			indices.set(s, [v, v + 1, v + 2]);
			indices.set(s + 3, [v, v + 2, v + 3]);

			let x = 0.25 * (i - 3);
			let green = i / (quadCount - 1);
			let quadColor = [1.0, green, 0.0, 1.0];

			coords.set(v, [x - 0.1, -0.05, 0]);
			color.set(v, quadColor);

			coords.set(v + 1, [x - 0.1, 0.15, 0]);
			color.set(v + 1, quadColor);

			coords.set(v + 2, [x + 0.1, 0.1, 0]);
			color.set(v + 2, quadColor);

			coords.set(v + 3, [x + 0.1, -0.1, 0]);
			color.set(v + 3, quadColor);
		}

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 0.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource,
			varyings,
			fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		let queue = expectPixelmatch(context, "spec/sparseindices/quads-1", 10);

		indices.deallocateSlots(quadStartSlots[1], 6);
		// The quad indices have been deallocated (and de-slotted),
		// but their vertices remain. A more complete case would
		// also deallocate the vertices.

		clear.run();
		program.run();
		queue = queue.then(expectPixelmatch(context, "spec/sparseindices/quads-2", 10));

		indices.deallocateSlots(quadStartSlots[3], 6);
		clear.run();
		program.run();
		queue = queue.then(expectPixelmatch(context, "spec/sparseindices/quads-3", 10));

		indices.deallocateSlots(quadStartSlots[5], 6);
		clear.run();
		program.run();
		queue = queue.then(expectPixelmatch(context, "spec/sparseindices/quads-4", 10));

		return queue;
	});
});
