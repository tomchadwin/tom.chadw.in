import { GLFactory } from "../../src/index.mjs";
import { mat4 } from "../../3rd-party/gl-matrix.mjs";

describe("Depth cube", function() {
	it("Renders with depth buffer LEQUAL", function() {
		const context = contextFactory(200, 200, {
			preserveDrawingBuffer: true,
			antialias: false,
		});

		const glii = new GLFactory(context);

		// 		/// FIXME: This should be in the WebGLProgram instead, as an option.
		// 		glii.gl.enable(glii.gl.DEPTH_TEST); // Enable depth testing
		// 		glii.gl.depthFunc(glii.gl.LEQUAL); // Near things obscure far things
		// 		// 			glii.gl.depthFunc(glii.gl.LESS);

		const pos = new glii.SingleAttribute({
			type: Int8Array,
			glslType: "vec3",
			size: 24,
			growFactor: false,
		});
		const tint = new glii.SingleAttribute({
			type: Float32Array,
			normalized: true,
			glslType: "vec3",
			size: 24,
			growFactor: false,
		});

		const indices = new glii.TriangleIndices({ size: 36, growFactor: false });

		// Front
		// indices.set(0, [0, 1, 2]);
		// indices.set(3, [0, 2, 3]);
		new indices.Triangle().setVertices(0, 1, 2);
		new indices.Triangle().setVertices(0, 2, 3);
		pos.set(0, [-1, -1, +1]);
		pos.set(1, [+1, -1, +1]);
		pos.set(2, [+1, +1, +1]);
		pos.set(3, [-1, +1, +1]);
		for (let i = 0; i < 4; i++) {
			tint.set(i, [1, 1, 0]);
		}

		// Back
		new indices.Triangle().setVertices(4, 5, 6);
		new indices.Triangle().setVertices(4, 6, 7);
		pos.set(4, [-1, -1, -1]);
		pos.set(5, [+1, -1, -1]);
		pos.set(6, [+1, +1, -1]);
		pos.set(7, [-1, +1, -1]);
		for (let i = 4; i < 8; i++) {
			tint.set(i, [1, 0, 1]);
		}

		// Top
		new indices.Triangle().setVertices(8, 9, 10);
		new indices.Triangle().setVertices(8, 10, 11);
		pos.set(8, [-1, +1, -1]);
		pos.set(9, [-1, +1, +1]);
		pos.set(10, [+1, +1, +1]);
		pos.set(11, [+1, +1, -1]);
		for (let i = 8; i < 12; i++) {
			tint.set(i, [0, 1, 1]);
		}

		// Bottom
		new indices.Triangle().setVertices(12, 13, 14);
		new indices.Triangle().setVertices(12, 14, 15);
		pos.set(12, [-1, -1, -1]);
		pos.set(13, [+1, -1, -1]);
		pos.set(14, [+1, -1, +1]);
		pos.set(15, [-1, -1, +1]);
		for (let i = 12; i < 16; i++) {
			tint.set(i, [0, 0, 1]);
		}

		// Right
		new indices.Triangle().setVertices(16, 17, 18);
		new indices.Triangle().setVertices(16, 18, 19);
		pos.set(16, [+1, -1, -1]);
		pos.set(17, [+1, +1, -1]);
		pos.set(18, [+1, +1, +1]);
		pos.set(19, [+1, -1, +1]);
		for (let i = 16; i < 20; i++) {
			tint.set(i, [0, 1, 0]);
		}

		// Left
		new indices.Triangle().setVertices(20, 21, 22);
		new indices.Triangle().setVertices(20, 22, 23);
		pos.set(20, [-1, -1, -1]);
		pos.set(21, [-1, -1, +1]);
		pos.set(22, [-1, +1, +1]);
		pos.set(23, [-1, +1, -1]);
		for (let i = 20; i < 24; i++) {
			tint.set(i, [1, 0, 0]);
		}

		/// NOTE: Since this test involves projection matrices,
		/// the default value for the clear depth bit (0.5) won't work as expected.
		const clearPlus = new glii.WebGL1Clear({
			color: [0.2, 0.2, 0.2, 0.0],
			depth: 1,
		});
		const clearMinus = new glii.WebGL1Clear({
			color: [0.2, 0.2, 0.2, 0.0],
			depth: -1,
		});
		const program = new glii.WebGL1Program({
			vertexShaderSource: `
void main() {
	vTint = aTint;
	gl_Position = uProjMatrix * uModelViewMatrix * vec4(aPos, 1.);
}`,
			varyings: { vTint: "vec3" },
			fragmentShaderSource: `
void main() {
	gl_FragColor = vec4(vTint, 1.0);
}`,
			indexBuffer: indices,
			attributes: {
				aPos: pos,
				aTint: tint,
			},
			textures: {},
			uniforms: {
				// uTime: "float",
				uProjMatrix: "mat4",
				uModelViewMatrix: "mat4",
			},
		});

		// 			clear.run();

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = (45 * Math.PI) / 180; // in radians
		// const aspect = glee.canvas.clientWidth / gl.canvas.clientHeight;
		const aspect = 1;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = mat4.create();
		let cubeRotation = 0;

		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

		const modelViewMatrix = mat4.create();
		const baseModelViewMatrix = mat4.create();
		// This will push the cube "back" into the scene by 6 units, making a bit smaller.
		mat4.translate(
			baseModelViewMatrix, // destination matrix
			baseModelViewMatrix, // matrix to translate
			[-0.0, 0.0, -4.0]
		); // amount to translate

		// 			console.log(projectionMatrix);
		// 			console.log(modelViewMatrix);

		//program.setUniform("uTime", performance.now());
		program.setUniform("uProjMatrix", projectionMatrix);
		program.setUniform("uModelViewMatrix", modelViewMatrix);

		function renderAndCheck(sec, depth) {
			// const cubeRotation = performance.now() / 1000;
			const cubeRotation = sec * 10;
			mat4.rotate(
				modelViewMatrix, // destination matrix
				baseModelViewMatrix, // matrix to rotate
				cubeRotation, // amount to rotate in radians
				[0.2, 0.4, 1] // axis to rotate around (Z)
			);
			mat4.rotate(
				modelViewMatrix, // destination matrix
				modelViewMatrix, // matrix to rotate
				cubeRotation * 0.2, // amount to rotate in radians
				[1, 0.1, 0.3] // axis to rotate around (Z)
			);

			program.depth = depth;
			program.setUniform("uModelViewMatrix", modelViewMatrix);

			if (depth !== glii.GREATER) {
				clearPlus.run();
			} else {
				clearMinus.run();
			}
			program.run();
			// 				requestAnimationFrame(onFrame);

			const depthString =
				depth === glii.ALWAYS
					? "always"
					: depth === glii.LEQUAL
					? "less"
					: depth === glii.EQUAL
					? "equal"
					: depth === glii.GREATER
					? "greater"
					: "unknown";

			return expectPixelmatch(
				context,
				`spec/depth-cube/cube-${depthString}-${sec}`,
				210
			);
		}

		return Promise.all([
			renderAndCheck(1, glii.ALWAYS),
			renderAndCheck(2, glii.ALWAYS),
			renderAndCheck(3, glii.ALWAYS),
			renderAndCheck(4, glii.ALWAYS),
			renderAndCheck(1, glii.LEQUAL),
			renderAndCheck(2, glii.LEQUAL),
			renderAndCheck(3, glii.LEQUAL),
			renderAndCheck(4, glii.LEQUAL),
			renderAndCheck(1, glii.GREATER),
			renderAndCheck(2, glii.GREATER),
			renderAndCheck(3, glii.GREATER),
			renderAndCheck(4, glii.GREATER),
		]);
	});
});
