/// TODO: Make a loop for the subdivisions of the icomesh, make tests from 0 to 2^4 subdivisions

import { GLFactory } from "../../src/index.mjs";
import { default as icomesh } from "../../node_modules/icomesh/index.js";
import { mat2 } from "../../3rd-party/gl-matrix.mjs";

describe("Icosphere mesh, dumping attributes at once", function() {
	it("renders interpolated normal", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		const { vertices: coords, triangles: trigvertices } = icomesh(0);

		// 		console.log(coords, trigvertices);

		const coordAttrib = new glii.SingleAttribute({
			glslType: "vec3",
			size: 10,
			growFactor: 1.2,
		}).setBytes(0, 0, coords);

		let indices = new glii.IndexBuffer({
			size: trigvertices.length,
			growFactor: false,
		}).set(0, trigvertices);

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: `
void main() {
	vec3 coord = aCoords;
	coord.xz = uRotMatrix * coord.xz;
	vNormal = vec4(normalize(coord.xyz), 1);

	gl_Position = vec4(coord, 1.0);
}`,
			varyings: { vNormal: "vec4" },
			fragmentShaderSource: `
vec4 lightSource1 = vec4(1., 1., -1., 1.);
vec4 lightSource2 = vec4(-.5, -.7, -1.2, 1.);
void main() {
	vec4 L = normalize(lightSource1 - vNormal);
	float NdotL = max (dot(vNormal,L), 0.);
	vec4 diffuse = NdotL * vec4(0.3, 0.1, 0.6, 1.0);

	gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0) + diffuse;

	gl_FragColor +=  max(dot(vNormal,
							normalize(lightSource2 - vNormal)
						   ), 0.) * vec4(0.2, 1.2, 0.3, 1.0);

// 	if (gl_FrontFacing) {
// 		gl_FragColor.r = 1.;
// 	} else {
// 		gl_FragColor.g += .1;
// 	}
}`,
			indexBuffer: indices,
			attributes: {
				aCoords: coordAttrib,
			},
			uniforms: { uRotMatrix: "mat2" },
			depth: glii.LEQUAL,
		});

		let matches = [];
		let rot = mat2.create();

		for (let i = 0; i < 3; i++) {
			mat2.fromRotation(rot, i * 2);
			program.setUniform("uRotMatrix", rot);

			clear.run();
			program.run();
			matches.push(
				expectPixelmatch(context, `spec/icomesh/icomesh-dumped-${i}`, 0)
			);
		}
		return Promise.all(matches);
	});
});
