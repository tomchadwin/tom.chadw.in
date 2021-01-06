import { GLFactory } from "../../src/index.mjs";
import { default as Allocator } from "../../src/Allocator.mjs";

describe("TriangleIndices", function() {
	it("allocates/deallocates triangles with sintactic sugar", function() {
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

		let triangles = new glii.TriangleIndices({
			size: 2 * quadCount,
			growFactor: false,
		});
		let vertexAllocator = new Allocator();

		let quadsInfo = [];

		for (let i = 0; i < quadCount; i++) {
			// Instantiate 2 triangles per quad
			let trig1 = new triangles.Triangle();
			let trig2 = new triangles.Triangle();

			// ...and allocate 4 vertices. Valid vertex IDs shall be
			// v, v+2, v+2 and v+3.
			let v = vertexAllocator.allocateBlock(4);

			const quadInfo = { trig1: trig1, trig2: trig2, verticesStart: v };
			quadsInfo.push(quadInfo);

			trig1.setVertices(v, v + 1, v + 2);
			trig2.setVertices(v, v + 2, v + 3);

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
			indexBuffer: triangles,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		let queue = expectPixelmatch(context, "spec/sparseindices/quads-1", 10);

		quadsInfo[1].trig1.destroy();
		quadsInfo[1].trig2.destroy();
		// By destroying the `Triangle` instances, the quad indices
		// have been deallocated (and de-slotted), but their vertices
		// remain. A more complete case would also deallocate the vertices,
		// i.e. vertexAllocator.deallocate(quadsInfo[1].verticesStart, 4)

		clear.run();
		program.run();
		queue = queue.then(expectPixelmatch(context, "spec/sparseindices/quads-2", 10));

		quadsInfo[3].trig1.destroy();
		quadsInfo[3].trig2.destroy();
		clear.run();
		program.run();
		queue = queue.then(expectPixelmatch(context, "spec/sparseindices/quads-3", 10));

		quadsInfo[5].trig1.destroy();
		quadsInfo[5].trig2.destroy();
		clear.run();
		program.run();
		queue = queue.then(expectPixelmatch(context, "spec/sparseindices/quads-4", 10));

		return queue;
	});
});
