import { default as typeMap } from "./util/typeMap.mjs";

/// TODO: Subclass? from HTMLImageElement
/// TODO: Subclass? from HTMLVideoElement

/// TODO: pixelStorei, from
/// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei
/// (e.g. flip Y coordinate)

/**
 * @class Texture
 * @inherits AbstractFrameBufferAttachment
 * Wraps a [`WebGLTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture)
 * and offers convenience methods.
 *
 * Contrary to what one might think, a `Texture` has no implicit size. Its size
 * is (re-)defined on any full update (`texImage2D` or `linkRenderBuffer`).
 */

import { registerFactory } from "./GLFactory.mjs";

export default class Texture {
	constructor(gl, opts = {}) {
		this._gl = gl;
		this._tex = gl.createTexture();

		/**
		 * @section
		 * @aka Texture options
		 * @option minFilter: Texture interpolation constant = gl.NEAREST
		 * Initial value of the `minFilter` property
		 * @option magFilter: Texture interpolation constant = gl.NEAREST
		 * Initial value of the `magFilter` property
		 * @option wrapS: Texture wrapping constant = gl.CLAMP_TO_EDGE
		 * Initial value for the `wrapS` property
		 * @option wrapT: Texture wrapping constant = gl.CLAMP_TO_EDGE
		 * Initial value for the `wrapS` property
		 * @option internalFormat: Texture format constant = gl.RGBA
		 * Initial value for the `internalFormat` property
		 * @option format: Texture format constant = gl.RGBA
		 * Initial value for the `format` property
		 */

		// Helper for caching bound textures and their active texture unit
		this._unit = undefined;

		// Helper for LRU-ing texture units. Shall be (re-)set every time
		// this texture is promoted to an available unit
		this._lastActive = performance.now();

		// @property minFilter: Texture interpolation constant = glii.NEAREST
		// Texture minification filter (or "what to do when pixels in the texture
		// are smaller than pixels in the output image")
		this.minFilter = opts.minFilter || gl.NEAREST;

		// @property magFilter: Texture interpolation constant = glii.NEAREST
		// Texture magification filter (or "what to do when pixels in the texture
		// are bigger than pixels in the output image"). Cannot use mipmaps (as
		// mipmaps are always smaller than the texture).
		this.magFilter = opts.magFilter || gl.NEAREST;

		// @property wrapS: Texture wrapping constant
		// Value for the `TEXTURE_WRAP_S` [texture parameter](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter) for any subsequent texture full updates
		this.wrapS = opts.wrapS || gl.CLAMP_TO_EDGE;

		// @property wrapT: Texture wrapping constant
		// Value for the `TEXTURE_WRAP_T` [texture parameter](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter) for any subsequent texture full updates
		this.wrapT = opts.wrapT || gl.CLAMP_TO_EDGE;

		// @property internalFormat: Texture format constant
		// Value for the `internalFormat` parameter for `texImage2D` calls.
		this.internalFormat = opts.internalFormat || gl.RGBA;

		// @property format: Texture format constant
		// Value for the `format` parameter for `texImage2D` calls. in WebGL1, this must
		// be equal to `internalFormat`.
		this.format = opts.format || gl.RGBA;

		// Loaded flag, to let `FrameBuffer` know when the texture has to be init'd
		// with a specific width/height
		this._isLoaded = false;
	}

	// Each element of this `WeakMap` is keyed by a `WebGLRenderingContext`, and its value
	// is a plain `Array` of `Texture`s.
	static _boundUnits = new WeakMap();

	/**
	 * @section Internal methods
	 * @method getUnit(): Number
	 * Returns a the texture unit index (or "name" in GL parlance) that this texture
	 * is bound to.
	 *
	 * Calling this method guarantees that the texture is bound into a valid unit,
	 * and that that unit is the active one (until a number of other `Texture`s
	 * call `getUnit()`, at least `MAX_COMBINED_TEXTURE_IMAGE_UNITS`)
	 *
	 * This might expel (unbind) the texture which was used the longest ago.
	 */
	getUnit() {
		this._lastActive = performance.now();
		const gl = this._gl;
		if (this._unit !== undefined) {
			gl.activeTexture(gl.TEXTURE0 + this._unit);
			// 			console.log("Texture already bound to unit", this._unit);
			return this._unit;
		}

		if (!Texture._boundUnits.has(this._gl)) {
			const maxUnits = this._gl.getParameter(
				this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
			);
			Texture._boundUnits.set(this._gl, new Array(maxUnits));
		}
		const units = Texture._boundUnits.get(this._gl);

		let oldestUnit = -1;
		let oldestTime = Infinity;
		for (let i = 0, l = units.length; i < l; i++) {
			if (units[i] === undefined) {
				// 				console.log("Texture newly bound to unit", i);
				gl.activeTexture(gl.TEXTURE0 + i);
				gl.bindTexture(gl.TEXTURE_2D, this._tex);
				units[i] = this;
				return (this._unit = i);
			}
			if (units[i]._lastActive < oldestTime) {
				oldestUnit = i;
				oldestTime = units[i]._lastActive;
			}
		}
		// 		console.log("Expelled texture to bound to unit", oldestUnit);
		gl.activeTexture(gl.TEXTURE0 + oldestUnit);
		gl.bindTexture(gl.TEXTURE_2D, this._tex);
		units[oldestUnit]._unit = undefined;
		units[oldestUnit] = this;
		return (this._unit = oldestUnit);
	}

	_resetParameters() {
		const gl = this._gl;
		this.getUnit();
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
	}

	/**
	 * @section
	 * @method texImage2D(img: HTMLImageElement): this
	 * (Re-)sets the texture contents to a copy of the given image. This is considered a "full update" of the texture.
	 *
	 * If the texture's format is other than `RGBA`, some data might be dropped (e.g.
	 * putting an RGBA `HTMLImageElement` with an alpha channel into a texture with `RGB`
	 * format shall drop the alpha channel).
	 * @alternative
	 * @method texImage2D(img: HTMLCanvasElement): this
	 * @alternative
	 * @method texImage2D(img: ImageData): this
	 * @alternative
	 * @method texImage2D(img: HTMLVideoElement): this
	 * @alternative
	 * @method texImage2D(img: ImageBitmap): this
	 */
	texImage2D(img) {
		/// TODO: set as dirty (?)
		/// TODO: notify programs using this texture that they're dirty now
		/// TODO: Read width/height from the image?? Then set as .width / .height
		const gl = this._gl;
		this._isLoaded = true;
		this.getUnit();
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			this.internalFormat,
			this.format,
			gl.UNSIGNED_BYTE,
			img
		);
		this._resetParameters();

		/// TODO: consider generating mipmaps only when the minFactor uses mipmaps.
		gl.generateMipmap(gl.TEXTURE_2D);
		return this;
	}

	/**
	 * @method texArray(w: Number, h: Number, arr: ArrayBufferView): this
	 * (Re-)sets the texture contents to a copy of the given `ArrayBufferView`
	 * (typically a `TypedArray` fitting this texture's `type`/`format`). Must be given
	 * width and height as well.
	 */
	texArray(w, h, arr) {
		this.getUnit();
		const gl = this._gl;
		// 		gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);

		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			this.internalFormat,
			w,
			h,
			0,
			this.format,
			typeMap.get(arr.constructor),
			arr
		);
		this._resetParameters();

		/// TODO: consider generating mipmaps only when the minFactor uses mipmaps.
		gl.generateMipmap(gl.TEXTURE_2D);
		return this;
	}

	/**
	 * @method isLoaded(): Boolean
	 * Returns whether the texture has been initialized with any data at all. `true` after `texImage2D()` and the like.
	 */
	isLoaded() {
		return this._isLoaded;
	}

	/**
	 * @method getComponentsPerTexel(): Number
	 * Returnt the number of bytes per texel, based on the `format` property.
	 */
	getComponentsPerTexel() {
		const gl = this._gl;
		let channels;
		switch (this.format) {
			case gl.RGBA:
				return 4;
			case gl.RGB:
				return 3;
			case gl.LUMINANCE_ALPHA:
				return 2;
			case gl.LUMINANCE:
			case gl.ALPHA:
				return 1;
			default:
				throw new Error("Unknown texel data format");
		}
	}
}

/**
 * @factory GLFactory.Texture(options: Texture options)
 *
 * @class GLFactory
 * @section Class wrappers
 * @property Texture(options: Texture options): Prototype of Texture
 * Wrapped `Texture` class
 */
registerFactory("Texture", function(gl) {
	return class WrappedTexture extends Texture {
		constructor(opts) {
			super(gl, opts);
		}
	};
});
