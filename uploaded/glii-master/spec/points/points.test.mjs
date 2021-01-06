import { GLFactory } from "../../src/index.mjs";

describe("Points", function() {
	it("renders four points with the same radius", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	gl_Position = vec4(aCoords, 1.0);
	gl_PointSize = 20.0; // In framebuffer pixels
}`;
		var fragmentShaderSource = `precision mediump float;
void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 4,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({
			size: 4,
			growFactor: false,
			drawMode: glii.POINTS,
		});

		indices.set(0, [0, 1, 2, 3]);
		coords.set(0, [-0.5, -0.5, 0]);
		coords.set(1, [-0.5, +0.5, 0]);
		coords.set(2, [+0.5, -0.5, 0]);
		coords.set(3, [+0.5, +0.5, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: {},
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: {
				aCoords: coords,
			},
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/points/four-points-same-radius");
	});

	it("points can be created programatically in a loop", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	gl_Position = vec4(aCoords, 1.0);
	gl_PointSize = 10.0; // In framebuffer pixels
}`;
		var fragmentShaderSource = `precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 256,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({
			size: 256,
			growFactor: false,
			drawMode: glii.POINTS,
		});

		let i = 0;
		for (let x = -0.75; x <= 0.75; x += 0.125) {
			for (let y = -0.75; y <= 0.75; y += 0.125) {
				indices.set(i, [i]);
				coords.set(i, [x, y + x / 10, 0]);
				i++;
			}
		}

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/points/loop-points");
	});

	it("points with colour attribute/varying can be created programatically in a loop", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		var vertexShaderSource = `
varying vec4 vColor;

void main() {
	gl_Position = vec4(aCoords, 1.0);
	gl_PointSize = 10.0; // In framebuffer pixels
	vColor = aColor;
}`;
		var fragmentShaderSource = `precision mediump float;
varying vec4 vColor;
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

		let indices = new glii.IndexBuffer({
			size: 256,
			growFactor: false,
			drawMode: glii.POINTS,
		});

		let i = 0;
		for (let x = -0.75; x <= 0.75; x += 0.125) {
			for (let y = -0.75; y <= 0.75; y += 0.125) {
				indices.set(i, [i]);
				coords.set(i, [x, y + x / 10, 0]);
				color.set(i, [1, (x + 0.75) / 1.5, (y + 0.75) / 1.5, 1]);
				i++;
			}
		}

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords, aColor: color },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/points/loop-color-points");
	});

	it("point as a circle", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		var vertexShaderSource = `
void main() {
	gl_Position = vec4(aCoords, 1.0);
	gl_PointSize = 128.0; // In framebuffer pixels
}`;
		var fragmentShaderSource = `precision mediump float;
void main() {
	vec2 p = gl_PointCoord - vec2(0.5); // Frag position relative to point center
	float radiusSq = p.x * p.x + p.y * p.y;
	
	gl_FragColor = vec4(vec3(smoothstep(0.24, 0.25, 1.0 - radiusSq * 4.0)), 1.0);

	//gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

	/*
	if ((radiusSq) < 0.25) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
	} else {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
	*/
}`;

		const coords = new glii.SingleAttribute({
			glslType: "vec3",
			size: 1,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({
			size: 1,
			growFactor: false,
			drawMode: glii.POINTS,
		});

		indices.set(0, [0]);
		coords.set(0, [0, 0, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: vertexShaderSource,
			varyings: [],
			fragmentShaderSource: fragmentShaderSource,
			indexBuffer: indices,
			attributes: { aCoords: coords },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/points/point-circle");
	});
});
