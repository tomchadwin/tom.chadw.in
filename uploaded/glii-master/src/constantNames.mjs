export default [
	/**
	 * @class GLFactory
	 * @section Buffer usage constants
	 * @aka Buffer usage constant
	 *
	 * Used in the `usage` option of `IndexBuffer`s and `AbstractAttributeSet`s,
	 * these allegedly tell the hardware which region of GPU memory the data should
	 * be into.
	 *
	 * @property STATIC_DRAW: Number
	 * Hints the hardware that the contents of the buffer are likely to be used often
	 * and not change often.
	 * @property DYNAMIC_DRAW: Number
	 * Hints the hardware that the contents of the buffer are likely to be used often
	 * and change often.
	 * @property STREAM_DRAW: Number
	 * Hints the hardware that the contents of the buffer are likely to not be used often.
	 */
	"STATIC_DRAW",
	"DYNAMIC_DRAW",
	"STREAM_DRAW",

	/**
	 * @section Data type constants
	 * @aka Data type constant
	 *
	 * Used in the `type` option of `Texture`s and `IndexBuffer`s.
	 *
	 * Note that `BindableAttribute`s infer the data type from the subclass of `TypedArray`.
	 *
	 * @property BYTE: Number; 8-bit integer, complement-2 signed
	 * @property UNSIGNED_BYTE: Number; 8-bit integer, unsigned
	 * @property SHORT: Number; 16-bit integer, complement-2 signed
	 * @property UNSIGNED_SHORT: Number; 16-bit integer, unsigned
	 * @property INT: Number; 32-bit integer, complement-2 signed
	 * @property UNSIGNED_INT: Number; 32-bit integer, unsigned
	 * @property FLOAT: Number; 32-bit IEEE754 floating point
	 */
	"BYTE",
	"UNSIGNED_BYTE",
	"SHORT",
	"UNSIGNED_SHORT",
	"INT",
	"UNSIGNED_INT",
	"FLOAT",

	/**
	 * @section Draw mode constants
	 * @aka Draw mode constant
	 *
	 * Used in the `drawMode` option of `SequentialIndices`, `IndexBuffer` and
	 * `SparseIndices`. Determines how vertices (pointed by their indices) form draw
	 * primitives.
	 *
	 * See [primitives in the OpenGL wiki](https://www.khronos.org/opengl/wiki/Primitive)
	 * and [`drawElements` in Mozilla dev network](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawElements).
	 *
	 * @property POINTS: Number; Each vertex is drawn as a single point.
	 * @property LINES: Number; Each set of two vertices is drawn as a line segment.
	 * @property LINE_LOOP: Number
	 * Each vertex connects to the next with a line segment. The last vertex connects to
	 * the first.
	 * @property LINE_STRIP: Number
	 * Draw a line segment from the first vertex to each of the other vertices
	 * @property TRIANGLES: Number
	 * Each set of three vertices is drawn as a triangle (0-1-2, then 3-4-5, 6-7-8, etc)
	 * @property TRIANGLE_STRIP: Number
	 * Each group of three adjacent vertices is drawn as a triangle (0-1-2, then 2-3-4,
	 * 3-4-5, etc). See [triangle strip on wikipedia](https://en.wikipedia.org/wiki/Triangle_strip)
	 * @property TRIANGLE_FAN: Number
	 * The first vertex plus each group of two adjacent vertices is drawn as a triangle.
	 * See [triangle fan on wikipedia](https://en.wikipedia.org/wiki/Triangle_fan)
	 */
	"POINTS",
	"LINES",
	"LINE_LOOP",
	"LINE_STRIP",
	"TRIANGLES",
	"TRIANGLE_STRIP",
	"TRIANGLE_FAN",

	/**
	 * @section Texture format constants
	 * @aka Texture format constant
	 *
	 * Determines the [image format](https://www.khronos.org/opengl/wiki/Image_Format)
	 * of a `Texture`. Used in a `Texture`'s `format`&`internalFormat` options&properties.
	 *
	 * @property RGB: Number; Texture holds red, green and blue components.
	 * @property RGBA: Number; Texture holds red, green, blue and alpha components.
	 * @property ALPHA: Number; Texture holds only an alpha component
	 * @property LUMINANCE: Number
	 * Texture holds only a luminance component. This effectively makes the texture grayscale.
	 * @property LUMINANCE_ALPHA: Number
	 * Texture holds luminance and alpha. This effectively makes the texture grayscale with
	 * transparency.
	 */
	"ALPHA",
	"RGB",
	"RGBA",
	"LUMINANCE",
	"LUMINANCE_ALPHA",

	/// TODO: depth format for textures, only available with extension:
	/// https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
	// "DEPTH_COMPONENT",
	// "DEPTH_STENCIL",

	/**
	 * @section Texture interpolation constants
	 * @aka Texture interpolation constant
	 *
	 * Determines the behaviour of texel interpolation (when a fragment shader requests
	 * a texel coordinate which falls between several texels). This is used in the
	 * `minFilter` and `maxFilter` options&properties of `Texture`s.
	 *
	 * See [sampler filtering on the OpenGL wiki](https://www.khronos.org/opengl/wiki/Sampler_Object#Filtering)
	 *
	 * @property NEAREST: Number; Nearest-texel interpolation
	 * @property LINEAR: Number; Linear interpolation between texels
	 * @property NEAREST_MIPMAP_NEAREST: Number
	 * Nearest-texel interpolation, in the nearest mipmap
	 * @property LINEAR_MIPMAP_NEAREST: Number
	 * Linear interpolation between texels, in the nearest mipmap
	 * @property NEAREST_MIPMAP_LINEAR: Number
	 * Nearest-texel interpolation, in a linearly-interpolatex mipmap
	 * @property LINEAR_MIPMAP_LINEAR: Number
	 * Linear interpolation between texels, in a linearly-interpolated mipmap
	 */
	"NEAREST",
	"LINEAR",
	"NEAREST_MIPMAP_NEAREST",
	"LINEAR_MIPMAP_NEAREST",
	"NEAREST_MIPMAP_LINEAR",
	"LINEAR_MIPMAP_LINEAR",

	/**
	 * @section Texture wrapping constants
	 * @aka Texture wrapping constant
	 *
	 * Used in the `wrapS`/`wrapT` options of a `Texture`.
	 *
	 * Determines the behaviour of texel sampling when the requested texel is outside
	 * the bounds of the `Texture` (i.e. when the texel coordinate is outside the
	 * [0..1] range).
	 *
	 * See [https://learnopengl.com/Getting-started/Textures](https://learnopengl.com/Getting-started/Textures)
	 * for an illustrative example.
	 *
	 * @property REPEAT: Number; Texture repeats.
	 * @property CLAMP_TO_EDGE: Number
	 * Texels from the edge of the texture are used outside.
	 * @property MIRRORED_REPEAT: Number
	 * Texture repeats but is mirrored on every odd occurence.
	 */
	"REPEAT",
	"CLAMP_TO_EDGE",
	"MIRRORED_REPEAT",

	/**
	 * @section Renderbuffer format constants
	 * @aka Renderbuffer format constant
	 *
	 * Used in the `internalFormat` option of `RenderBuffer`,
	 * determines its [image format](https://www.khronos.org/opengl/wiki/Image_Format).
	 *
	 * @property RGBA4: Number;  4 red bits, 4 green bits, 4 blue bits 4 alpha bits.
	 * @property RGB565: Number;  5 red bits, 6 green bits, 5 blue bits.
	 * @property RGB5_A1: Number;  5 red bits, 5 green bits, 5 blue bits, 1 alpha bit.
	 * @property DEPTH_COMPONENT16: Number;  16 depth bits.
	 * @property STENCIL_INDEX8: Number;  8 stencil bits.
	 * @property DEPTH_STENCIL: Number; Both 16 depth bits and 8 stencil bits.
	 */
	"RGBA4",
	"RGB565",
	"RGB5_A1",
	"DEPTH_COMPONENT16",
	"STENCIL_INDEX8",
	"DEPTH_STENCIL",

	/**
	 * @section Comparison constants
	 * @aka Comparison constant
	 *
	 * Used in the `depth` option of `WebGL1Program`.
	 *
	 * Use `glii.ALWAYS` to disable depth testing. Otherwise, the most usual
	 * value is `glii.LEQUAL` or `glii.LESS`, to render fragments with a lower
	 * `z` component of their `gl_Position` ("closer to the camera") over fragments
	 * with a higher `z`.
	 *
	 * See [depth testing in learnopengl.com](https://learnopengl.com/Advanced-OpenGL/Depth-testing).
	 *
	 * @property NEVER: Number; Always fails (i.e. shall drop all fragments).
	 * @property ALWAYS: Number; Disables depth testing.
	 * @property LESS: Number
	 * Render fragments that have a lower `z` ("closer to the camera") over others.
	 * @property LEQUAL: Number
	 * As `LESS`, but also renders fragments with the same `z`.
	 * @property GREATER: Number
	 * Render fragments that have a higher `z` ("further away from the camera") over others.
	 * @property GEQUAL: Number
	 * As `GREATER`, but also renders fragments with the same `z`.
	 * @property EQUAL: Number
	 * Only render fragments with the same `z` as the depth buffer value.
	 * @property NOTEQUAL: Number; Opposite of `EQUAL`.
	 */
	"NEVER",
	"ALWAYS",
	"LESS",
	"LEQUAL",
	"GREATER",
	"GEQUAL",
	"EQUAL",
	"NOTEQUAL",
];
