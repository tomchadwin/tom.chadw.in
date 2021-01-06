import { default as AbstractAttributeSet } from "./AbstractAttributeSet.mjs";
import { registerFactory } from "../GLFactory.mjs";
import { default as typeMap } from "../util/typeMap.mjs";

/**
 * @class SingleAttribute
 * @inherits AbstractAttributeSet
 * @inherits BindableAttribute
 *
 * Represents a `gl.ARRAY_BUFFER` holding data for a single attribute.
 *
 * @example
 *
 * ```
 * const posInPlane = new glii.SingleAttribute({
 * 	type: Float32Array
 * 	glslType: 'vec2'
 * });
 *
 * const rgbaColour = new glii.SingleAttribute({
 * 	type: Uint8Array,
 * 	normalized: true,
 * 	glslType: 'vec4'
 * });
 * ```
 */

/// TODO: Somehow implement integer GLSL types for WebGL2.

export default class SingleAttribute extends AbstractAttributeSet {
	constructor(gl, options) {
		/**
		 * @section
		 * @aka SingleAttribute options
		 * @option type: prototype = Float32Array
		 * A specific subclass of `TypedArray` defining the data format
		 */
		const type = options.type || Float32Array;
		const bytesPerElement = type.BYTES_PER_ELEMENT;

		/**
		 * @option glslType: String = 'float'
		 * The GLSL type associated with this attribute. One of `float`, `vec2`, `vec3`, `vec4`.
		 *
		 * This also defines the number of components for this attribute (1, 2, 3 or 4, respectively).
		 */
		const glslType = options.glslType || "float";
		if (!(glslType in AbstractAttributeSet.GLSL_TYPE_COMPONENTS)) {
			throw new Error(
				"Invalid value for the `glslType` option; must be `float`, `vec2`, `vec3`, or `vec4`."
			);
		}
		const componentCount = AbstractAttributeSet.GLSL_TYPE_COMPONENTS[glslType];

		super(gl, options, bytesPerElement * componentCount);

		this._glslType = glslType;
		this._componentCount = componentCount;
		this._glType = typeMap.get(type);

		/**
		 * @option normalized: Boolean = false
		 * Whether the values in this attribute are normalized into the -1..1 (signed) or
		 * 0..1 (unsigned) range when accesed from within GLSL.
		 *
		 * Only has effect when `type` is an integer array (`Uint8Array`, `Int16Array`, etc).
		 */
		this._normalized = options.normalized;

		/**
		 * @method set(index: Number, value: Number): this
		 * Alias of `setNumber`, available when `glslType` is `float`.
		 * @alternative
		 * @method set(index: Number, values: [Number]): this
		 * Alias of `setArray`, available when `glslType` is `vec2`, `vec3` or `vec4`. `values`
		 * must be an array of length 2, 3 or 4 (respectively).
		 */
		if (options.glslType === "float") {
			this.set = this.setNumber;
		} else {
			this.set = this.setArray;
		}

		this._recordBuf = new type(componentCount);
	}

	/**
	 * @method setNumber(index: Number, value: Number): this
	 * Sets the value for the `index`th vertex. Valid when `glslType` is `float`.
	 */
	setNumber() {
		this._recordBuf[0] = value;
		super.setBytes(index, 0, this._recordBuf);
	}

	/**
	 * @method setArray(index: Number, values: [Number]): this
	 * Sets the values for the `index`th vertex. Valid when `glslType` is `vec2`, `vec3` or `vec4`. `val` must be an array of length 2, 3 or 4 (respectively).
	 */
	setArray(index, values) {
		if (values.length !== this._componentCount) {
			throw new Error(
				`Expected ${this._componentCount} values but got ${values.length}.`
			);
		}
		this._recordBuf.set(values);
		super.setBytes(index, 0, this._recordBuf);
	}

	// Method implementing `BindableAttribute` interface.
	bindWebGL1(location) {
		const gl = this._gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
		gl.enableVertexAttribArray(location);
		gl.vertexAttribPointer(
			location,
			this._componentCount,
			this._glType,
			this._normalized,
			this._recordSize, // stride
			0 // offset
		);
	}

	// Method implementing `BindableAttribute` interface.
	getGlslType() {
		return this._glslType;
	}
}

/**
 * @factory GLFactory.SingleAttribute(options: SingleAttribute options)
 * @class GLFactory
 * @section Class wrappers
 * @property SingleAttribute(options: SingleAttribute options): Prototype of SingleAttribute
 * Wrapped `SingleAttribute` class
 */
registerFactory("SingleAttribute", function(gl) {
	return class WrappedSingleAttribute extends SingleAttribute {
		constructor(options) {
			super(gl, options);
		}
	};
});
