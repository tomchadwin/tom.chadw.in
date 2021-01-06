import { GLFactory } from "../../../src/index.mjs";

describe("One texture, full quad, normalized uint8 + int8 attributes", function() {
	it("renders", function() {
		const context = contextFactory(256, 256, { preserveDrawingBuffer: true });
		const glii = new GLFactory(context);

		const coords = new glii.SingleAttribute({
			type: Int8Array,
			glslType: "vec2",
			size: 4,
			growFactor: false,
		});
		const texCoords = new glii.SingleAttribute({
			type: Uint8Array,
			normalized: true,
			glslType: "vec2",
			size: 4,
			growFactor: false,
		});

		const baloonTexture = new glii.Texture();

		const indices = new glii.IndexBuffer({ size: 6, growFactor: false });

		indices.set(0, [0, 1, 2]);
		indices.set(3, [1, 2, 3]);

		coords.set(0, [-1, -1]);
		texCoords.set(0, [0, 255]);

		coords.set(1, [-1, 1]);
		texCoords.set(1, [0, 0]);

		coords.set(2, [1, -1]);
		texCoords.set(2, [255, 255]);

		coords.set(3, [1, 1]);
		texCoords.set(3, [255, 0]);

		let clear = new glii.WebGL1Clear({ color: [0.0, 1.0, 0.0, 1.0] });
		let program = new glii.WebGL1Program({
			vertexShaderSource: `
void main() {
	vTextureCoords = aTextureCoords;
	gl_Position = vec4(aCoords, 0.0, 1.0);
}`,
			varyings: { vTextureCoords: "vec2" },
			fragmentShaderSource: `
void main() {
 	gl_FragColor = texture2D(uBaloonTex, vTextureCoords);
// 	gl_FragColor = vec4(.2,.3,.9,1.);
}`,
			indexBuffer: indices,
			attributes: {
				aCoords: coords,
				aTextureCoords: texCoords,
			},
			textures: { uBaloonTex: baloonTexture },
		});

		clear.run();

		return imagePromiseFromUrl("testimages.org/baloons.png").then((img) => {
			baloonTexture.texImage2D(img);
			program.run();
			return expectPixelmatch(context, "spec/texture/basic/baloons-int8");
		});
	});
});
