import { registerFactory } from "./GLFactory.mjs";
// import { default as IndexBuffer } from "./Indices/IndexBuffer.mjs";
import { default as SequentialIndices } from "./Indices/SequentialIndices.mjs";
// import { default as AttributeBuffer } from "./AbstractAttributeBuffer.mjs";
// import { default as addLineNumbers } from "./util/addLineNumbers.mjs";
import { default as prettifyGlslError } from "./util/prettifyGlslError.mjs";

/**
 * @class WebGL1Program
 *
 * Represents a draw call using only WebGL1 APIs.
 *
 * A `WebGL1Program` compiles the shader strings and binding textures,
 * indices, attributes and the framebuffer together (even though most
 * functionality is delegated).
 *
 * @relationship compositionOf SequentialIndices, 1..1, 0..n
 * @relationship compositionOf BindableAttribute, 0..n, 0..n
 * @relationship compositionOf Texture, 0..n, 0..n
 * @relationship compositionOf FrameBuffer, 0..1, 0..n
 */

export default class WebGL1Program {
	/**
	 * @section
	 * @aka WebGL1Program options
	 * @option vertexShaderSource: String; GLSL v1.00 source code for the vertex shader
	 * @option varyings: [Object]; A key-value map of varying names and their GLSL v1.00 types
	 * @option fragmentShaderSource: String; GLSL v1.00 source code for the fragment shader
	 * @option indexBuffer: IndexBuffer
	 * @option attributes: Object = {}; A key-value map of attribute names and their `BindableAttribute`
	 * @option uniforms: Object = {}; A key-value map of uniform names and their GLSL v1.00 types
	 * @option textures: Object = {}; A key-value map of texture names and their `Texture` counterpart
	 * @option target: FrameBuffer = null; The `FrameBuffer` to draw to. `null` will draw to the default framebuffer.
	 * @option depth: Comparison constant = gl.ALWAYS
	 * Initial value for the `depth` property.
	 *
	 * @property depth: Comparison constant = gl.ALWAYS
	 * Whether this program performs depth testing, and how. Can be changed during runtime.
	 *
	 * `gl.ALWAYS` is the same as disabling depth testing.
	 *
	 * Has no effect if the `FrameBuffer` for this program has no depth attachment.
	 */

	// TODO: alias "vertexShaderSource" to "vert"?
	// TODO: alias "fragmentShaderSource" to "frag"?
	// TODO: alias "indexBuffer" to "indices"?
	// TODO: alias "attributeBuffers" to "attributes" to "attrs"?

	// TODO: Stuff from REGL https://regl.party/api :
	// * Render target - test!
	// * Blending, stencil
	// * Polygon offset
	// * Culling - IndexBuffer ?
	// * Front face - IndexBuffer ?
	// * Dithering
	// * Line width - IndexBuffer ?
	// * Color mask
	// * Sample coverage
	// * Scissor
	// * Viewport

	constructor(
		gl,
		gliiFactory,
		{
			vertexShaderSource,
			varyings = {},
			fragmentShaderSource,
			indexBuffer,
			attributes = {},
			uniforms = {},
			textures = {},
			target = null,
			depth = 0x0207, /// 0x207 = gl.ALWAYS
		}
	) {
		this._gl = gl;

		// The factory that spawned this program is important for fetching the
		// size of the default framebuffer, in order to prevent blinking when a
		// <canvas> is resized.
		this._gliiFactory = gliiFactory;

		// Loop through attribute buffers to fetch defined attribute names and their types
		// to build up a header for the fragment shader.
		let attribDefs = "";

		for (let attribName in attributes) {
			const type = attributes[attribName].getGlslType();
			attribDefs += `attribute ${type} ${attribName};\n`;
		}

		// Loop through uniform and texture definitions to get their names and types
		// to build up a header common for both the vertex and the fragment shader
		let uniformDefs = "";
		this._unifSetters = {};
		for (let uName in uniforms) {
			const uniformType = uniforms[uName];
			let size;
			switch (uniformType) {
				case "float":
					this._unifSetters[uName] = gl.uniform1f.bind(gl);
					break;
				case "vec2":
					this._unifSetters[uName] = gl.uniform2fv.bind(gl);
					break;
				case "vec3":
					this._unifSetters[uName] = gl.uniform3fv.bind(gl);
					break;
				case "vec4":
					this._unifSetters[uName] = gl.uniform4fv.bind(gl);
					break;
				case "int":
					this._unifSetters[uName] = gl.uniform1i.bind(gl);
					break;
				case "ivec2":
					this._unifSetters[uName] = gl.uniform2iv.bind(gl);
					break;
				case "ivec3":
					this._unifSetters[uName] = gl.uniform3iv.bind(gl);
					break;
				case "ivec4":
					this._unifSetters[uName] = gl.uniform4iv.bind(gl);
					break;
				case "mat2":
					this._unifSetters[uName] = (p, v) => gl.uniformMatrix2fv(p, false, v);
					break;
				case "mat3":
					this._unifSetters[uName] = (p, v) => gl.uniformMatrix3fv(p, false, v);
					break;
				case "mat4":
					this._unifSetters[uName] = (p, v) => gl.uniformMatrix4fv(p, false, v);
					break;
				default:
					throw new Error(`Unknown uniform GLSL type "${uniformType}"`);
			}

			uniformDefs += `uniform ${uniformType} ${uName};\n`;
		}
		for (let texName in textures) {
			uniformDefs += "uniform sampler2D " + texName + ";\n";
		}

		let varyingDefs = Object.entries(varyings)
			.map(([n, t]) => `varying ${t} ${n};\n`)
			.join("");

		/// TODO: allow the dev to change this
		const precisionHeader = "precision highp float;\n";

		const program = (this._program = gl.createProgram());
		const vertexShader = this._compileShader(
			gl.VERTEX_SHADER,
			// "#version 100\n" +
			precisionHeader + attribDefs + varyingDefs + uniformDefs,
			vertexShaderSource
		);
		const fragmtShader = this._compileShader(
			gl.FRAGMENT_SHADER,
			// "#version 100\n" +
			precisionHeader + varyingDefs + uniformDefs,
			fragmentShaderSource
		);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!success) {
			console.warn(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			throw new Error("Could not compile shaders into a WebGL1 program");
		}

		if (!(indexBuffer instanceof SequentialIndices)) {
			throw new Error(
				"The WebGL1Program constructor needs a valid `IndexBuffer` to be passed as an option."
			);
		}
		this._indexBuff = indexBuffer;

		this._attrs = attributes;
		this._attribsMap = {};

		for (let attribName in attributes) {
			const loc = gl.getAttribLocation(this._program, attribName);
			this._attribsMap[attribName] = loc;
		}

		this._unifsMap = {};
		this._texs = textures;
		this._unifs = uniforms;
		for (let unifName in uniforms) {
			const loc = gl.getUniformLocation(this._program, unifName);
			if (loc === -1) {
				console.warn(`Uniform "${unifName}" is not being used in the shaders.`);
			}
			this._unifsMap[unifName] = loc;
		}
		for (let texName in textures) {
			if (texName in this._unifsMap) {
				throw new Error(
					`Texture name "${texName}" conflicts with already defined (non-texture) uniform.`
				);
			}
			const loc = gl.getUniformLocation(this._program, texName);
			if (loc === -1) {
				console.warn(`Texture "${texName}" is not being used in the shaders.`);
			}
			this._unifsMap[texName] = loc;
		}

		this._target = target;
		this.depth = depth;
		// console.log("attrib map: ", this._attribsMap);
		// console.log("unifs map: ", this._unifsMap);
	}

	_compileShader(type, header, src) {
		const gl = this._gl;
		/// FIXME: Running on puppeteer, `shader` is not a `WebGLShader` instance,
		/// which throws an error when trying to set the source.
		// See also: https://github.com/mapbox/mapbox-gl-js/pull/9017
		const shader = gl.createShader(type);
		// 		try {
		gl.shaderSource(shader, "#line 1\n" + header + "#line 10001\n" + src);
		// 		} catch(ex) {
		// 			console.warn("Context lost?");
		// 			console.log(shader);
		// 			debugger;
		// 		}
		gl.compileShader(shader);
		const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			// console.warn(addLineNumbers(gl.getShaderSource(shader)));
			return gl.attachShader(this._program, shader);
		}

		const log = gl.getShaderInfoLog(shader);
		gl.deleteShader(shader);

		// Try to throw a pretty error message
		const readableType = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
		prettifyGlslError(log, header, src, readableType, 10000);

		// 		console.warn(gl.getSupportedExtensions());
		// 		console.warn(addLineNumbers(gl.getShaderSource(shader)));
		// 		console.warn(gl.getShaderInfoLog(shader));
		throw new Error("Could not compile shader.");
	}

	// @method run():this
	// Runs the draw call for this program
	run() {
		const gl = this._gl;

		// TODO: Double- and triple-check that viewport, blend and clear are needed at this stage
		// TODO: handle explicit viewports.
		// TODO: Allow the dev to override the following defaults:
		if (!this._target) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			// 			const [width, height] = this._gliiFactory.getDrawingBufferSize();
			// 			gl.viewport(0, 0, width, height);
			this._gliiFactory.refreshDrawingBufferSize();
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		} else {
			gl.bindFramebuffer(gl.FRAMEBUFFER, this._target._fb);
			gl.viewport(0, 0, this._target.width, this._target.height);
		}

		/// TODO: Consider caching the loaded program somehow. Maybe copy
		/// the technique from the Texture's WeakMap?
		gl.useProgram(this._program);

		if (this.depth === gl.ALWAYS) {
			gl.disable(gl.DEPTH_TEST);
		} else {
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(this.depth);
		}

		for (let attribName in this._attrs) {
			this._attrs[attribName].bindWebGL1(this._attribsMap[attribName]);
		}

		for (let texName in this._texs) {
			gl.uniform1i(this._unifsMap[texName], this._texs[texName].getUnit());
		}

		this._indexBuff.drawMe();

		return this;
	}

	// @method setUniform(name: String, value: Number): this
	// (Re-)sets the value of a uniform in this program, for `float`/`int` uniforms.
	// @alternative
	// @method setUniform(name: String, value: [Number]): this
	// (Re-)sets the value of a uniform in this program, for `vecN`/`ivecN`/`matN` uniforms.
	setUniform(name, value) {
		// TODO: mark self as dirty
		this._gl.useProgram(this._program);

		if (name in this._unifSetters) {
			this._unifSetters[name](this._unifsMap[name], value);
			return this;
		} else {
			throw new Error(`Uniform name ${name} is unknown in this WebGL1Program.`);
		}
	}
}

/**
 * @factory GLFactory.WebGL1Program(options: WebGL1Program options)
 * @class GLFactory
 * @section Class wrappers
 * @property WebGL1Program(options: WebGL1Program options): Prototype of WebGL1Program
 * Wrapped `WebGL1Program` class
 */
registerFactory("WebGL1Program", function(gl, gliiFactory) {
	return class WrappedWebGL1Program extends WebGL1Program {
		constructor(opts) {
			super(gl, gliiFactory, opts);
		}
	};
});
