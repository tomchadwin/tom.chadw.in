import { GLFactory } from "../../src/index.mjs";

describe("Error handling", function() {
	const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
	const glii = new GLFactory(context);

	let indices = new glii.IndexBuffer({
		size: 4,
		growFactor: false,
		drawMode: glii.POINTS,
	});

	indices.set(0, [0, 1, 2, 3]);

	it(" throws on vertex shader line 1 on unknown symbol", function() {
		function go() {
			let program = new glii.WebGL1Program({
				vertexShaderSource: "unknownSymbol;",
				varyings: {},
				fragmentShaderSource: "",
				indexBuffer: indices,
				attributeBuffers: {},
			});
		}

		// 		return expect(go).toThrowError(Error);
		return expect(go).toThrowMatching(function(err) {
			return (
				err.message.includes("Could not compile vertex shader") &&
				err.message.includes("Around line 1: unknownSymbol;")
			);
		});
	});

	it(" throws on frag shader line 1 on unknown symbol", function() {
		function go() {
			let program = new glii.WebGL1Program({
				vertexShaderSource: "void main(void){}",
				varyings: {},
				fragmentShaderSource: "unknownSymbol;",
				indexBuffer: indices,
				attributeBuffers: {},
			});
		}

		return expect(go).toThrowError(Error);
		return expect(go).toThrowMatching(function(err) {
			return (
				err.message.includes("Could not compile fragment shader") &&
				err.message.includes("Around line 1: unknownSymbol;")
			);
		});
	});

	it(" throws on frag shader line 3 on unknown symbol", function() {
		function go() {
			let program = new glii.WebGL1Program({
				vertexShaderSource: "void main(void){}",
				varyings: {},
				fragmentShaderSource:
					"void main(void) {\n\ngl_FragColor = unknownSymbol;\n}",
				indexBuffer: indices,
				attributeBuffers: {},
			});
		}

		return expect(go).toThrowError(Error);
		return expect(go).toThrowMatching(function(err) {
			return (
				err.message.includes("Could not compile fragment shader") &&
				err.message.includes("Around line 3: gl_FragColor = unknownSymbol;")
			);
		});
	});
});
