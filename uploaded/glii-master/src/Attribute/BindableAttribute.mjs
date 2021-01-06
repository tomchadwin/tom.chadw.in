/// This class doesn't exist.
/// This file exists only to generate documentation about the `BindableAttribute` "interface".

/**
 * @class BindableAttribute
 * Only classes which implement this interface can be passed to the `attributes` option
 * of a `WebGL1Program`.
 *
 * Do not use directly - rather, use subclasses such as `SingleAttribute`.
 */

/**
 * @section
 * @aka BindableAttribute options
 * @aka BindableAttributeOptions
 *
 * Concrete implementations of `BindableAttribute` should expose these options.
 *
 * @option type: prototype
 * A specific subclass of `TypedArray` defining the data format.
 *
 * Valid values for WebGL1 are: `Int8Array`, `Uint8Array`, `Uint8ClampedArray`,
 * `Int16Array` and `Float32Array`.
 *
 * @option glslType: String
 * The GLSL type associated with this attribute. One of `float`, `vec2`, `vec3`, `vec4`.
 *
 * This also defines the number of components for this attribute (1, 2, 3 or 4, respectively).
 *
 * @option normalized: Boolean = false
 * Whether the values in this attribute are normalized into the -1..1 (signed) or
 * 0..1 (unsigned) range when accesed from within GLSL.
 *
 * Only has effect when `type` is an integer array (`Uint8Array`, `Int16Array`, etc). *
 *
 * @section Internal methods
 * @uninheritable
 * @method bindWebGL1(location: Number): this
 * Binds the attribute represented by self to the given `location` in the active GLSL program.
 *
 * (`location` is kinda a misnomer, since it's more like an offset in one of the program's
 * symbol table.)
 *
 * This is expected to be called from `WebGL1Program` only.
 *
 * @method getGlslType(): String
 * Returns a `String` with the GLSL type for this attribute.
 *
 * This is expected to be called from `WebGL1Program` only.
 */
