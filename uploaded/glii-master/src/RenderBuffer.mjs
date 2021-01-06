/**
 * @class RenderBuffer
 * @inherits AbstractFrameBufferAttachment
 *
 * Wraps a [`WebGLRenderbuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderbuffer)
 * and offers convenience methods.
 *
 * A `RenderBuffer` is most akin to an image: a rectangular collection of
 * pixels with `width`, `height` and a `internalFormat`. The main difference
 * between a `RenderBuffer` and a 2D `Texture` is the different `internalFormat`s.
 */

import { registerFactory } from "./GLFactory.mjs";
// import { default as XY } from "./vectors/xy.mjs";

export default class RenderBuffer {
	constructor(gl, opts = {}) {
		this._gl = gl;
		this._rb = gl.createRenderbuffer();

		// @option size: XY
		// Width and height of this `RenderBuffer`, as a 2-component vector.
		if ("size" in opts) {
			if ("width" in opts || "height" in opts) {
				throw new Error(
					'Expected either "size" or "width"/"height", but both were provided'
				);
			}
			this.width = size[0];
			this.height = size[1];
		} else {
			// @option width: Number = 256
			// Width of this `RenderBuffer`, in pixels.
			this.width = opts.width || 256;

			// @option height: Number = 256
			// Height of this `RenderBuffer`, in pixels.
			this.height = opts.height || 256;
		}

		// @option internalFormat: Number = gl.RGBA4
		// Internal format of this `RenderBuffer`, as per [`renderBufferStorage`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/renderbufferStorage).
		this.internalFormat = opts.internalFormat || gl.RGBA4;

		gl.bindRenderbuffer(gl.RENDERBUFFER, this._rb);
		gl.renderbufferStorage(
			gl.RENDERBUFFER,
			this.internalFormat,
			this.width,
			this.height
		);
	}
}

/**
 * @factory GLFactory.RenderBuffer(options: RenderBuffer options)
 * @class GLFactory
 * @section Class wrappers
 * @property RenderBuffer(options: RenderBuffer options): Prototype of RenderBuffer
 * Wrapped `RenderBuffer` class
 */
registerFactory("RenderBuffer", function(gl) {
	return class WrappedRenderBuffer extends RenderBuffer {
		constructor(opts) {
			super(gl, opts);
		}
	};
});
