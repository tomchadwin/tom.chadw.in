import { registerFactory } from "../GLFactory.mjs";
import { default as SparseIndices } from "./SparseIndices.mjs";

/**
 * @class PointIndices
 * @inherits SparseIndices
 *
 * Represents a set of vertex indices for point primitives (i.e. one vertex per point).
 *
 * The draw mode of a `PointIndices` is forced into being `gl.POINTS`.
 */

export default class PointIndices extends SparseIndices {
	/**
	 * @constructor PointIndices(gl: WebGLRenderingContext, options: PointIndices options)
	 */
	constructor(gl, options = {}) {
		options.drawMode = gl.POINTS;
		super(gl, options);
	}

	/**
	 * @method allocatePoints(count: Number): Number
	 */
	allocatePoints(count) {
		// For points, there shall be one slot per point = vertes.
		return super.allocateSlots(count);
	}

	/**
	 * @method deallocatePoints(start, count: Number): this
	 */
	deallocatePoints(start, count) {
		return super.deallocateSlots(start, count);
	}
}

/**
 * @factory GLFactory.PointIndices(options: PointIndices options)
 * @class GLFactory
 * @section Class wrappers
 * @property PointIndices(options: PointIndices options): Prototype of PointIndices
 * Wrapped `PointIndices` class
 */
registerFactory("PointIndices", function(gl) {
	return class WrappedPointIndices extends PointIndices {
		constructor(options) {
			super(gl, options);
		}
	};
});
