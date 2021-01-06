import { default as AbstractAttributeSet } from "./AbstractAttributeSet.mjs";
import { registerFactory } from "../GLFactory.mjs";
import { default as typeMap } from "../util/typeMap.mjs";

/**
 * @class InterleavedAttributes
 * @inherits AbstractAttributeSet
 * @relationship aggregationOf BindableAttribute, 1..1, 0..n
 *
 * Represents a `gl.ARRAY_BUFFER` holding data for several attributes, which
 * internally (in memory) are interleaved (data for the same vertex index is
 * adjacent).
 *
 * Since the internal data structure vaguely resembles a C `struct`, each attribute
 * contained therein is referred to as `field`.
 *
 * @example
 *
 * ```
 * // Instantiate
 * const interleaved = new glii.InterleavedAttributes({
 * 	usage: glii.STATIC_DRAW
 * },[{
 * 	type: Float32Array
 * 	glslType: 'vec2'
 * }, {
 * 	type: Uint8Array,
 * 	normalized: true,
 * 	glslType: 'vec4'
 * }]);
 *
 * // Set the float32 values (0th field) for vertex 5
 * interleaved.setField(5, 0, [0.5, 0.5]);
 *
 * // Set the uint8 values (1st field) for vertex 2
 * interleaved.setField(2, 1, [255, 0, 0, 255]);
 *
 * // Set all fields for vertex 7
 * interleaved.setFields(7, [[0.5, 0.5], [255, 0, 0, 255]]);
 *
 * // Link to attributes in a program
 * program = new glii.WebGL1Program({
 * 	attributes: {
 * 		aRGBA: interleaved.getBindableAttribute(1),
 * 		aPos: interleaved.getBindableAttribute(0),
 * 	},
 * 	// etc
 * });
 * ```
 */

/// TODO: Somehow implement integer GLSL types for WebGL2.

export default class InterleavedAttributes extends AbstractAttributeSet {
	constructor(gl, options, fields) {
		let bytesPerRecord = 0;
		let _fields = [];
		let byteAlignment = 0;

		for (let field of fields) {
			let _field = {
				type: field.type || Float32Array,
				glslType: field.glslType || "float",
				normalized: !!field.normalized,
				offset: bytesPerRecord,
			};

			const bytesPerElement = _field.type.BYTES_PER_ELEMENT;
			const componentCount =
				AbstractAttributeSet.GLSL_TYPE_COMPONENTS[_field.glslType];
			_field.components = componentCount;

			if (_field.offset % bytesPerElement) {
				// Pad before the field, if needed. The offsets of 2-byte and
				// 4-byte fields must be a multiple of their `bytesPerElement`.
				_field.offet += bytesPerElement - (_field.offset % bytesPerElement);
			}

			bytesPerRecord += bytesPerElement * componentCount;
			_fields.push(_field);
			byteAlignment = Math.max(byteAlignment, bytesPerElement);
		}

		// Pad after the last field, if needed. If there are 2-byte (or 4-byte)
		// datatypes, then the stride must be a multiple of 2 (or 4).
		const unalignment = bytesPerRecord % byteAlignment;
		if (unalignment !== 0) {
			bytesPerRecord += byteAlignment - unalignment;
		}

		super(gl, options, bytesPerRecord);

		this._fields = _fields;
		this._recordBuf = new ArrayBuffer(this._recordSize);
		this._typedArrays = _fields.map(
			(f) => new f.type(this._recordBuf, f.offset, f.components)
		);
	}

	/**
	 * @method setField(vertexIndex: Number, fieldIndex, values: Array of Number): this
	 * Sets the value(s) for the given vertex index and 0-indexed field.
	 *
	 * Values must be given as an `Array` (or `Array-like`) of numbers, even for
	 * 1-component fields with the `float` GLSL type.
	 */
	setField(vertexIndex, fieldIndex, values) {
		this._typedArrays[fieldIndex].set(values);
		super.setBytes(
			vertexIndex,
			this._fields[fieldIndex].offset,
			this._typedArrays[fieldIndex]
		);

		return this;
	}

	/**
	 * @method setField(vertexIndex: Number, values: Array of Array of Number): this
	 * Sets the value(s) for all fields for the given vertex index.
	 *
	 * Values must be given as an `Array`; the `n`th element in this `Array` must be an
	 * `Array` (or `Array-like`) of arrays of numbers with the values for the `n`th
	 * field.
	 */
	setFields(vertexIndex, values) {
		this._typedArrays.forEach((arr, f) => {
			arr.set(values[f]);
		});

		super.setBytes(vertexIndex, 0, this._recordBuf);
		return this;
	}

	/**
	 * @method getBindableAttribute(fieldIndex: Number): BindableAttribute
	 */
	getBindableAttribute(fieldIndex) {
		const field = this._fields[fieldIndex];
		const glType = typeMap.get(field.type);
		return {
			bindWebGL1: function bindWebGL1(location) {
				const gl = this._gl;
				gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(
					location,
					field.components,
					glType,
					field.normalized,
					this._recordSize, // stride
					field.offset // offset
				);
			}.bind(this),

			getGlslType: function getGlslType() {
				return field.glslType;
			},
		};
	}
}

/**
 * @factory GLFactory.InterleavedAttributes(options: InterleavedAttributes options, fields: Array of BindableAttributeOptions)
 * @class GLFactory
 * @section Class wrappers
 * @property InterleavedAttributes(options: InterleavedAttributes options, fields: Array of BindableAttributeOptions): Prototype of InterleavedAttributes
 * Wrapped `InterleavedAttributes` class
 */
registerFactory("InterleavedAttributes", function(gl) {
	return class WrappedInterleavedAttributes extends InterleavedAttributes {
		constructor(options, fields) {
			super(gl, options, fields);
		}
	};
});
