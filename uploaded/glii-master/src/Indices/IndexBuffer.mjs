import { registerFactory } from "../GLFactory.mjs";
import { default as SequentialIndices } from "./SequentialIndices.mjs";

/**
 * @class IndexBuffer
 * @inherits SequentialIndices
 * Represents a set of vertex indices. This will tell the program which vertices
 * to draw, in which mode (points/lines/triangles), and in which order. Includes
 * a couple of niceties like setters and handling of the data types.
 *
 * This is the base `IndexBuffer`, generic. Subclasses might want
 * to group indices in groups of 2 or 3, to abstract line segments, or triangles; and
 * might want to logically group segments or triangles as well.
 *
 * Internally this represents a `gl.ELEMENT_ARRAY_BUFFER` at the WebGL level, or an
 * Element Array Buffer (EAB) at the OpenGL level.
 */

/// TODO: Subclass this into something that calls `drawArrays` instead of `drawElements`,
/// i.e. represent a non-settable set of the first N vertices
/// The use case for this would be the trivial "draw one single quad with one TRIANGLE_STRIP
/// draw call" things, for very very small vertices sets.

export default class IndexBuffer extends SequentialIndices {
	constructor(gl, options = {}) {
		super(gl, options);

		// @section
		// @aka IndexBuffer options
		// @option size: Number = 255
		// Maximum number of indices to hold
		this._size = options.size || 255;

		// @option growFactor: Boolean = false
		// Specifies that the size of this indices buffer is static.
		// @alternative growFactor: Number
		// Allows this buffer to automatically grow when `set()` is out of bounds.
		//
		// Each time that happens, the `size` of this indices buffer will
		// grow by that factor (e.g. a factor of 2 means the buffer doubles its size each
		// time the size is insufficient)
		this._growFactor = options.growFactor || 1.2;

		// @option usage: Buffer usage constant = glii.STATIC_DRAW
		// One of `gl.STATIC_DRAW`, `gl.DYNAMIC_DRAW` or `gl.STREAM_DRAW`.
		// See the documentation of the `usage` parameter at
		// [`bufferData`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData)
		// for more details.
		this._usage = options.usage || gl.STATIC_DRAW;

		// @option type: Data type constant = glii.UNSIGNED_SHORT
		// One of `glii.UNSIGNED_BYTE`, `glii.UNSIGNED_SHORT` or `glii.UNSIGNED_INT`.
		// This sets the maximum index that can be referenced by this `IndexBuffer`
		// (but not how many indices this `IndexBuffer` can hold):
		// 2^8, 2^16 or 2^32 respectively.
		// See the documentation of the `usage` parameter at
		// [`gl.drawElements`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements)
		// for more details.
		this._type = options.type || gl.UNSIGNED_SHORT;

		if (this._type === gl.UNSIGNED_BYTE) {
			this._bytesPerIndex = 1;
			this.set = this.setUint8;
		} else if (this._type === gl.UNSIGNED_SHORT) {
			this._bytesPerIndex = 2;
			this.set = this.setUint16;
		} else if (this._type === gl.UNSIGNED_INT) {
			this._bytesPerIndex = 4;
			this.set = this.setUint32;
		} else {
			throw new Error(
				"Invalid type for IndexBuffer. Must be one of `gl.UNSIGNED_BYTE`, `gl.UNSIGNED_SHORT` or `gl.UNSIGNED_INT`."
			);
		}
		this._buf = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buf);
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			this._size * this._bytesPerIndex,
			this._usage
		);

		// Upper bound of many indices in this IndexBuffer are pointing to valid vertices.
		// AKA "highest set slot"
		this._activeIndices = 0;
	}

	/**
	 * @method set(n: Number, indices: [Number]): this
	 * Stores the given indices as 1-, 2- or 4-byte integers, starting at the `n`-th
	 * position in this `IndexBuffer`.
	 *
	 * The indices passed must exist (and likely, have values) in any
	 * `AttributeBuffer`s being used together with this `IndexBuffer` in a
	 * GL program.
	 *
	 * Internally, this maps to one of the internal `setUint8`,
	 * `setUint16` or `setUint32` methods, depending on this instance's `type`.
	 */

	/**
	 * @section Internal methods
	 * @uninheritable
	 * @method setUint8(n: Number, indices: Array of Number): this
	 * Stores the given indices as 1-byte integers starting at the `n`-th position
	 * in this IndexBuffer.
	 * This assumes that the `IndexBuffer`'s type is `UNSIGNED_BYTE`.
	 */
	setUint8(n, indices) {
		const gl = this._gl;
		this.grow(n + indices.length);
		this.bindMe();

		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, n, Uint8Array.from(indices));

		this._setActiveIndices(n + indices.length);
		return this;
	}

	// @method setUint16(n: Number, indices: Array of Number): this
	// Stores the given indices as 2-byte integers starting at the `n`-th position
	// in this IndexBuffer.
	// This assumes that the `IndexBuffer`'s type is `UNSIGNED_SHORT`.
	setUint16(n, indices) {
		const gl = this._gl;
		this.grow(n + indices.length);
		this.bindMe();

		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, n * 2, Uint16Array.from(indices));

		this._setActiveIndices(n + indices.length);
		return this;
	}

	// @method setUint32(n: Number, indices: Array of Number): this
	// Stores the given indices as 4-byte integers starting at the `n`-th position
	// in this IndexBuffer.
	// This assumes that the `IndexBuffer`'s type is `UNSIGNED_INT`.
	setUint32(n, indices) {
		const gl = this._gl;
		this.grow(n + indices.length);
		this.bindMe();

		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, n * 4, Uint32Array.from(indices));

		this._setActiveIndices(n + indices.length);
		return this;
	}

	/**
	 * @method grow(m): undefined
	 * Internal usage only. Grows the internal buffer, so it can contain at least `m`
	 * elements.
	 */
	grow(m) {
		if (this._size >= m) {
			return;
		}

		if (!this._grow) {
			throw new Error(
				`Tried to set index out of bounds of non-growable IndexBuffer (requested ${m} vs size ${this._size})`
			);
		} else {
			throw new Error(`FIXME: Growable IndexBuffers are not implemented`);
		}
	}

	/**
	 * @method bindMe(): undefined
	 * Internal use only. (Re-)binds itself as the `ELEMENT_ARRAY_BUFFER` of the
	 * `WebGLRenderingContext`.
	 *
	 * In practice, this should happen every time the program changes in the
	 * current context.
	 *
	 * This is expected to be called from `WebGL1Program` only.
	 */
	bindMe() {
		const gl = this._gl;
		if (gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING) !== this._buf) {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buf);
		}
	}

	/**
	 * @method drawMe(): undefined
	 * Internal use only. Does the `WebGLRenderingContext.drawElement()` calls, but
	 * assumes that everyhing else (bound program, textures, attribute name-locations,
	 * uniform name-locations-values) has been set up already.
	 *
	 * This is expected to be called from `WebGL1Program` only.
	 */
	drawMe() {
		this.bindMe();
		this._gl.drawElements(this._drawMode, this._activeIndices, this._type, 0);
	}

	// Set the number of active indices to either the given number or the number of active indices,
	// whatever is greater.
	_setActiveIndices(n) {
		this._activeIndices = Math.max(this._activeIndices, n);
	}
}

/**
 * @factory GLFactory.IndexBuffer(options: IndexBuffer options)
 * @class GLFactory
 * @section Class wrappers
 * @property IndexBuffer(options: IndexBuffer options): Prototype of IndexBuffer
 * Wrapped `IndexBuffer` class
 */
registerFactory("IndexBuffer", function(gl) {
	return class WrappedIndexBuffer extends IndexBuffer {
		constructor(options) {
			super(gl, options);
		}
	};
});
