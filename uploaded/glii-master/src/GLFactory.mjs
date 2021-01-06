import constantNames from "./constantNames.mjs";

const factories = {};
// Inspired by Leaflet's addInitHook()
// `fact` must be a factory function that expects a `WebGLContext`,
// optionally expects an instances of `GLFactory`, and
// returns a (wrapped) class constructor.
export function registerFactory(name, fact) {
	factories[name] = fact;
}

/**
 * @class GLFactory
 * Glii core. Wraps the functionality of a `WebGLRenderingContext`.
 *
 * Contains wrappers for buffer, program, texture classes; also contains
 * a partial set of WebGL constants (only the ones that need to be
 * specified as options/parameters to Glii classes).
 *
 * @example
 * ```
 * // Create a GLFactory instance from a canvas...
 * import { GLFactory } from "path_to_glii/index.mjs";
 * const glii = new GLFactory(document.getElementById("some-canvas"));
 *
 * // ...and use such instance to spawn stuff...
 * let pointIndices = new glii.IndexBuffer({
 * 	// ...using constants available in the GLFactory instance.
 * 	drawMode: glii.POINTS
 * });
 * ```
 *
 */

export default class GLFactory {
	/**
	 * @constructor GLFactory(target: HTMLCanvasElement, contextAttributes?: Object)
	 * Create a GL factory from a `HTMLCanvasElement`, and context attributes as per
	 * [`getContext`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
	 * @alternative
	 * @constructor GLFactory(target: WebGLRenderingContext)
	 * Create a GL factory from an already instantiated `WebGLRenderingContext`
	 * @alternative
	 * @constructor GLFactory(target: WebGL2RenderingContext)
	 * Create a GL factory from an already instantiated `WebGL2RenderingContext`
	 */
	/// TODO: Add another alternative, using only context attributes, which shall
	/// implicitly create the canvas.
	constructor(target, contextAttributes) {
		if (!target || !target.constructor || !target.constructor.name) {
			// Happens on CI environments (gitlab CI)
			throw new Error(
				"Invalid target passed to GLFactory constructor. Expected either a HTMLCanvasElement or a WebGLRenderingContext but got " +
					typeof target +
					"," +
					JSON.stringify(target) +
					"."
			);
		}
		switch (target.constructor.name) {
			case "HTMLCanvasElement":
				function get(name) {
					try {
						return target.getContext(name, contextAttributes);
					} catch (e) {
						return undefined;
					}
				}

				this.gl =
					get("webgl2") ||
					get("webgl") ||
					get("experimental-webgl") ||
					get("webgl-experimental");
				break;

			case "WebGLRenderingContext":
			case "WebGL2RenderingContext":
			case "bound WebGLRenderingContext": // Happens on headless using "gl" module
			case "bound WebGL2RenderingContext":
				this.gl = target;
				break;
			default:
				throw new Error(
					"Invalid target passed to GLFactory constructor. Expected either a HTMLCanvasElement or a WebGLRenderingContext but got an instance of " +
						target.constructor.name +
						"."
				);
		}

		const gl = this.gl;

		// Call all individual factory functions, assign the class constructors to
		// properties of this instance.
		for (let factName in factories) {
			this[factName] = factories[factName](gl, this);
		}

		// Copy constants from the `WebGLRenderingContext`.
		for (let i in constantNames) {
			const name = constantNames[i];
			this[name] = gl[name];
		}

		if ("canvas" in gl) {
			gl.canvas.addEventListener(
				"webglcontextlost",
				(ev) => {
					console.warn("glii has lost context", ev);
					ev.preventDefault();
				},
				false
			);
			gl.canvas.addEventListener(
				"webglcontextrestored",
				(ev) => {
					console.warn("glii lost context has been restored", ev);
				},
				false
			);

			const resizeObserver = new ResizeObserver(() => {
				this._drawingBufferSizeChanged = true;
			});

			resizeObserver.observe(gl.canvas);
		}
		this._drawingBufferSize = [gl.drawingBufferWidth, gl.drawingBufferHeight];
		this._drawingBufferSizeChanged = false;

		/// TODO: simulate context loss with gl.getExtension('WEBGL_lose_context').loseContext();

		// 		// Fetch some info from the context
		//
		// 		// This kinda assumes that, when given a WebGLRenderingContext/
		// 		// WebGL2RenderingContext, there have been no framebuffer shenanigans.
		// 		this._defaultFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
		// 		this._defaultRenderbuffer = gl.getParameter(gl.RENDERBUFFER_BINDING);
		// 		this._glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
		//
		// 		const attachments = [gl.COLOR_ATTACHMENT0, gl.DEPTH_ATTACHMENT, gl.STENCIL_ATTACHMENT];
		// 		const pnames = [
		// 			gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE,
		// 			gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME,
		// 			gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL,
		// // 			gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE
		// 		];
		//
		// // 			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		// 		this._defaultAttachments = {};
		// 		for (let att of attachments){
		// 			this._defaultAttachments[att] = {};
		// 			for (let i=0; i<0xFFFF; i++) {
		// // 				for (let pname of pnames){
		// // 					console.log(att, pname);
		// // 					this._defaultAttachments[att][pname] =
		// 				const value =
		// // 						gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, att, pname);
		// 					gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, att, i);
		// // 						gl.getFramebufferAttachmentParameter(gl.FRAMEBUFFER, att, null);
		// 				if (value) {
		// 					console.log(att, i, value);
		// 				}
		// 			}
		// 		}
		//
		// 		console.log('default framebuffer: ', this._defaultFramebuffer);
		// 		console.log('default renderbuffer: ', this._defaultRenderbuffer);
		// 		console.log('default attachments: ', this._defaultAttachments);
		// 		console.log('GLSL version: ', this._glslVersion);
	}

	/**
	 * @section Internal methods
	 * @method refreshCanvasSize(): undefined
	 * Ensure that the size of the <canvas> linked to the `WebGLRenderingContext`
	 * matches the size provided by `getClientRect()`.
	 *
	 * Meant to be called from a `WebGL1Program` right before fetching the drawing buffer
	 * size. This technique should lower blinking when the `<canvas>` is resized.
	 */
	refreshDrawingBufferSize() {
		if (this._drawingBufferSizeChanged) {
			const canvas = this.gl.canvas;
			const { width, height } = canvas.getClientRects()[0];
			canvas.width = width;
			canvas.height = height;
		}
	}

	/// TODO: lightweight event handler for resizing; uniforms might need to be re-set.
}
