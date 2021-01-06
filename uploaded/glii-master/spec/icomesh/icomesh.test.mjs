/// TODO: Make a loop for the subdivisions of the icomesh, make tests from 0 to 2^4 subdivisions

import { GLFactory } from "../../src/index.mjs";
import { default as icomesh } from "../../node_modules/icomesh/index.js";
import { mat2 } from "../../3rd-party/gl-matrix.mjs";

describe("Icosphere mesh", function() {
	it("renders depth", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		// generate an icosphere with 4 subdivisions
		// const {vertices, triangles} = icomesh(4);

		// In icomesh parlance, "vertices" is the packed x-y-z TypedArray, and "triangles" is
		// the packed indices Uint16Array.
		const { vertices: coords, triangles: trigvertices } = icomesh(0);
		// console.log(coords, trigvertices);

		const coordAttrib = new glii.SingleAttribute({
			glslType: "vec3",
			size: coords.length,
			growFactor: false,
		});

		let indices = new glii.IndexBuffer({
			size: trigvertices.length,
			growFactor: false,
		});

		for (let i = 0, l = coords.length; i < l; i += 3) {
			coordAttrib.set(i / 3, coords.subarray(i, i + 3));
		}

		indices.set(0, trigvertices); // Dumps the entire trigvertices TypedArray as indices.

		// 		for (let i=0, l=trigvertices.length; i<l; i+=3) {
		// 			indices.set(i/3, vertices.subarray(i, i + 3));
		// 		}

		// 		indices.set(0, [0, 1, 2]);
		// 		coordsBuffer.set(0, [-0.5, -0.5, -0.5]);
		// 		coordsBuffer.set(1, [-0.5, +0.5, +0.5]);
		// 		coordsBuffer.set(2, [+0.5, 0, 0]);
		//
		// 		console.log(indices, coordsBuffer);

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: `
void main() {
	gl_Position = vec4(aCoords.xyz, 1.0);
}`,
			varyings: { vNormal: "vec3" },
			fragmentShaderSource: `
void main() {
	float depth = gl_FragCoord.z;
// 	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
// 	gl_FragColor = vec4(gl_FragCoord.zzz, 1.0);
	gl_FragColor = vec4(vec3(1.0 - depth * 1.5), 1.0);
// 	gl_FragColor = vec4(vNormal, 1.0);
}`,
			indexBuffer: indices,
			attributes: { aCoords: coordAttrib },
		});

		clear.run();
		program.run();

		return expectPixelmatch(context, "spec/icomesh/icomesh-0-depth");
	});

	it("renders normal facets", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });

		const glii = new GLFactory(context);

		const { vertices: coords, triangles: trigvertices } = icomesh(2);

		// 		console.log(coords, trigvertices);

		// 		let coordsBuffer = new glii.CoordsAttributeBuffer({
		// 			size: trigvertices.length * 3, // Not coords.length!!
		// 			growFactor: false,
		// 		});
		const coordAttrib = new glii.SingleAttribute({
			glslType: "vec3",
			size: 10,
			growFactor: 1.2,
		});
		const normalAttrib = new glii.SingleAttribute({
			glslType: "vec3",
			size: trigvertices.length * 3,
			growFactor: false,
		});
		const edgeAttrib = new glii.SingleAttribute({
			glslType: "vec3",
			size: 15,
			growFactor: 1.3,
		});

		let indices = new glii.IndexBuffer({
			size: trigvertices.length,
			growFactor: false,
		});

		// 		for (let i=0, l=coords.length; i<l; i+=3) {
		// 			coordsBuffer.set(i/3, coords.subarray(i, i + 3));
		// 		}

		// 		indices.set(0, trigvertices);

		const edgeData = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1],
		];

		for (let i = 0, l = trigvertices.length; i < l; i += 3) {
			const v1 = trigvertices[i + 0] * 3; // Index for the coords of vertex 1 in the coords array
			const v2 = trigvertices[i + 1] * 3; // Idem, vertex 2
			const v3 = trigvertices[i + 2] * 3; // Idem, vertex 3
			const c1 = coords.subarray(v1, v1 + 3); // Value of the XYZ coords for vertex 1
			const c2 = coords.subarray(v2, v2 + 3); // Idem, vertex 2
			const c3 = coords.subarray(v3, v3 + 3); // Idem, vertex 3
			// 			console.log("Face out of vertices: ", i,
			// 				trigvertices.subarray(i, i + 3),
			// 				v1, v2, v3,
			// 				c1, c2, c3
			// 			);
			const normal = [
				(c1[0] + c2[0] + c3[0]) / 3, // x
				(c1[1] + c2[1] + c3[1]) / 3, // y
				(c1[2] + c2[2] + c3[2]) / 3, // z
			];
			// Create a new triangle with indices [i, i+1, i+2], as well as
			// fill up the coords buffer for these new vertex indices
			coordAttrib.set(i + 0, c1);
			coordAttrib.set(i + 1, c2);
			coordAttrib.set(i + 2, c3);
			normalAttrib.set(i + 0, normal);
			normalAttrib.set(i + 1, normal);
			normalAttrib.set(i + 2, normal);
			edgeAttrib.set(i + 0, edgeData[0]);
			edgeAttrib.set(i + 1, edgeData[1]);
			edgeAttrib.set(i + 2, edgeData[2]);
			// 			indices.set(i, [i + 0, i + 1, i + 2]);
			indices.set(i, [i + 0, i + 2, i + 1]);
		}

		let clear = new glii.WebGL1Clear({ color: [0.0, 0.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: `

void main() {
// 	vNormal = normalize( ( (aNormal /2.) + vec3(.5) ) * lightSource );
	vNormal = vec4(normalize(aNormal), 1);
	gl_Position = vec4(aCoords.xyz, 1.0);
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
						   ), 0.) * vec4(1.2, 0.2, 0.3, 1.0);
}`,
			indexBuffer: indices,
			attributes: {
				aCoords: coordAttrib,
				aNormal: normalAttrib,
			},
			depth: glii.LEQUAL,
		});

		clear.run();
		program.run();
		let matches = [];

		matches.push(expectPixelmatch(context, "spec/icomesh/icomesh-2-normal", 15));

		let programEdge = new glii.WebGL1Program({
			vertexShaderSource: `
vec3 lightSource = vec3(1., 1., -1.);

void main() {
	vEdge = aEdge;
	vNormal = vec4(normalize(aNormal), 1);
	vNormal.xz = uRotMatrix * vNormal.xz;

	gl_Position = vec4(aCoords.xyz, 1.0);
	gl_Position.xz = uRotMatrix * aCoords.xz;
}`,
			varyings: { vNormal: "vec4", vEdge: "vec3" },
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

	gl_FragColor.gb += vec2(smoothstep(0.05, 0.01, min(min(vEdge.x, vEdge.y), vEdge.z)))
			* vec2(.5, .8);

// 	if (gl_FrontFacing) {
// 		gl_FragColor.r = 1.;
// 	} else {
// 		gl_FragColor.g += .1;
// 	}
}`,
			indexBuffer: indices,
			attributes: {
				aCoords: coordAttrib,
				aNormal: normalAttrib,
				aEdge: edgeAttrib,
			},
			uniforms: { uRotMatrix: "mat2" },
			depth: glii.LEQUAL,
		});

		let rot = mat2.create();

		for (let i = 0; i < 6; i++) {
			mat2.fromRotation(rot, i / 2);
			programEdge.setUniform("uRotMatrix", rot);

			clear.run();
			programEdge.run();
			matches.push(
				expectPixelmatch(context, `spec/icomesh/icomesh-2-edgenormal-${i}`, 250)
			);
		}
		return Promise.all(matches);
	});
});
