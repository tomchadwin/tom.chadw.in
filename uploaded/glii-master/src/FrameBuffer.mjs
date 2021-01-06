/**
 * @class FrameBuffer
 * @relationship compositionOf AbstractFrameBufferAttachment, 0..n, 1..n
 *
 * Wraps a [`WebGLFramebuffer`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLFramebuffer)
 * and offers convenience methods.
 *
 * A `FrameBuffer` is a collection of `Texture`s/`RenderBuffer`s: (at least) one for
 * colour (RGBA), an optional one for depth and an optional one for stencil.
 *
 * In GL parlance, each of the `Texture`/`RenderBuffer`s that make up a `FrameBuffer`
 * is called an "attachment". Each attachment must have an `internalFormat` fitting its
 * colour/depth/stencil role.
 *
 * In any operations that allow a `FrameBuffer`, not giving one (or explicitly setting it
 * to `null`) shall work on the "default" framebuffer - in the usual case, this means an
 * internally-created framebuffer with the colour attachment linked to the `<canvas>`
 * that the GL context was created out of.
 *
 * Multiple colour attachments are only possible in WebGL2, or in WebGL1 when the
 * [`WEBGL_draw_buffers`](https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers) extension is available.
 *
 * @example
 *
 * ```
 * var fb1 = new gliiFactory.FrameBuffer({
 * 	size: new XY(1024, 1024),
 * 	color: [new gliiFactory.Texture( ... )],
 * 	stencil: new gliiFactory.RenderBuffer( ... ),
 * 	depth: new gliiFactory.RenderBuffer( ... ),
 * });
 *
 * var size = new XY(1024, 1024);
 * var fb2 = new gliiFactory.FrameBuffer({
 * 	size: size,
 * 	color: [
 * 		new gliiFactory.Texture( size: size, ... ),
 * 		new gliiFactory.Texture( size: size, ... )
 * 	],
 * 	stencil: false,
 * 	depth: false,
 * });
 * ```
 */

/// TODO: depth format for textures, only available with extension:
/// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture

import { registerFactory } from "./GLFactory.mjs";
import { default as Texture } from "./Texture.mjs";
import { default as RenderBuffer } from "./RenderBuffer.mjs";

export default class FrameBuffer {
	constructor(gl, opts = {}) {
		this._gl = gl;
		this._fb = gl.createFramebuffer();

		gl.bindFramebuffer(gl.FRAMEBUFFER, this._fb);

		// @section
		// @aka FrameBuffer options
		// @option size: XY
		// Width and height of this `FrameBuffer`, in pixels, as a 2-component vector.
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

		// @option color: [AbstractFrameBufferAttachment]= []
		// An array of colour attachment(s) (likely `Texture`s)
		const colourAttachs = opts.colour || opts.color || [];
		colourAttachs.forEach((att, i) => {
			if (att instanceof Texture) {
				att.getUnit();
				if (!att.isLoaded()) {
					// If the texture is empty (which means, no width/height set),
					// init it to a blank texture the same size as this FB.
					att.texArray(
						this.width,
						this.height,
						new Uint8Array(
							this.width * this.height * att.getComponentsPerTexel()
						)
					);
					// 					gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat,this.width, this.height, 0, this.format, this.type, null);
				}
				gl.framebufferTexture2D(
					gl.FRAMEBUFFER,
					gl.COLOR_ATTACHMENT0 + i,
					gl.TEXTURE_2D,
					att._tex,
					0
				);
			} else if (att instanceof RenderBuffer) {
				gl.framebufferRenderbuffer(
					gl.FRAMEBUFFER,
					gl.COLOR_ATTACHMENT0 + i,
					gl.RENDERBUFFER,
					att._rb
				);
			}
		});

		// @option depth: RenderBuffer = false
		// A `RenderBuffer` for the depth attachment. Must have a depth-compatible `internalformat`.
		if (opts.depth && opts.depth instanceof RenderBuffer) {
			gl.framebufferRenderbuffer(
				gl.FRAMEBUFFER,
				gl.DEPTH_ATTACHMENT,
				gl.RENDERBUFFER,
				opts.depth._rb
			);
		}

		// @option stencil: RenderBuffer = false
		// A `RenderBuffer` for the stencil attachment. Must have a stencil-compatible `internalformat`.
		if (opts.stencil && opts.stencil instanceof RenderBuffer) {
			gl.framebufferRenderbuffer(
				gl.FRAMEBUFFER,
				gl.STENCIL_ATTACHMENT,
				gl.RENDERBUFFER,
				opts.stencil._rb
			);
		}

		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status === gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
			throw new Error(
				"The attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete."
			);
		} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
			throw new Error("There is no attachment.");
		} else if (status === gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS) {
			throw new Error("Height and width of the attachment are not the same.");
		} else if (status === gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
			throw new Error("There is no attachment.");
		} else if (status === gl.FRAMEBUFFER_UNSUPPORTED) {
			throw new Error(
				"The format of the attachment is not supported, or depth and stencil attachments are not the same renderbuffer."
			);
		} else if (status !== gl.FRAMEBUFFER_COMPLETE) {
			throw new Error("FrameBuffer invalid " + status);
		}
	}
}

/**
 * @factory GLFactory.FrameBuffer(options: FrameBuffer options)
 * @class GLFactory
 * @section Class wrappers
 * @property FrameBuffer(options: FrameBuffer options): Prototype of FrameBuffer
 * Wrapped `FrameBuffer` class
 */
registerFactory("FrameBuffer", function(gl) {
	return class WrappedFrameBuffer extends FrameBuffer {
		constructor(opts) {
			super(gl, opts);
		}
	};
});
