import { registerFactory } from "../GLFactory.mjs";
import { default as IndexBuffer } from "./IndexBuffer.mjs";
import { default as Allocator } from "../Allocator.mjs";

/**
 * @class SparseIndices
 * @inherits IndexBuffer
 * @relationship compositionOf Allocator, 0..1, 1..1
 *
 * The idea of a SparseIndices is to hold indices, but also
 * an `Allocation` of them - whenever more index slots for primitives
 * are needed, call `allocateSlots` (and later `deallocateSlots` if
 * needed).
 *
 * (Drawing this `Indices` shall trigger one draw call per contiguous
 * block of used indices. By comparison, the basic `IndexBuffer` triggers
 * just one `drawElements` call, from 0 to number-of-used-indices -1)
 *
 */

export default class SparseIndices extends IndexBuffer {
	constructor(gl, options = {}) {
		super(gl, options);

		// Allocator instance for blocks in self's `ELEMENT_ARRAY_BUFFER`.
		this._slotAllocator = new Allocator();
	}

	/**
	 * @method allocateSlots(count: Number): Number
	 * Allocates `count` slots for indices. Returns the offset of the first
	 * slot.
	 *
	 * For `gl.TRIANGLES` (`gl.LINES`), allocate 3 (2) slots per triangle (line).
	 */
	allocateSlots(count) {
		return this._slotAllocator.allocateBlock(count);
	}

	/**
	 * @method deallocateSlots(start, count: Number): this
	 * Deallocates `count` slots for indices, started with the `start`th slot.
	 *
	 * For `gl.TRIANGLES` (`gl.LINES`), allocate 3 (2) slots per triangle (line).
	 */
	deallocateSlots(start, count) {
		this._slotAllocator.deallocateBlock(start, count);
		return this;
	}

	// Internal only. Does the GL drawElement() calls, but assumes that everyhing else
	// (bound program, textures, attribute name-locations, uniform name-locations-values)
	// has been set up already.
	drawMe() {
		this.bindMe();
		this._slotAllocator.forEachBlock((start, length) => {
			const startByte = start * this._bytesPerIndex;
			this._gl.drawElements(this._drawMode, length, this._type, startByte);
		});
	}
}

/**
 * @factory GLFactory.SparseIndices(options: SparseIndices options)
 * @class GLFactory
 * @section Class wrappers
 * @property SparseIndices(options: SparseIndices options): Prototype of SparseIndices
 * Wrapped `SparseIndices` class
 */
registerFactory("SparseIndices", function(gl) {
	return class WrappedSparseIndices extends SparseIndices {
		constructor(options) {
			super(gl, options);
		}
	};
});
