import { GLFactory } from "../../../src/index.mjs";

describe("Two-texture fade", function() {
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
			glslType: "vec2",
			size: 4,
			growFactor: false,
		});

		const billiardTexA = new glii.Texture();
		const billiardTexB = new glii.Texture();

		let indices = new glii.IndexBuffer({ size: 6, growFactor: false });

		indices.set(0, [0, 1, 2]);
		indices.set(3, [1, 2, 3]);

		coords.set(0, [-1, -1]);
		coords.set(1, [-1, +1]);
		coords.set(2, [+1, -1]);
		coords.set(3, [+1, +1]);
		texCoords.set(0, [0, 1]);
		texCoords.set(1, [0, 0]);
		texCoords.set(2, [1, 1]);
		texCoords.set(3, [1, 0]);

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
	vec4 ballsA = texture2D(uBilliardA, vTextureCoords);
	vec4 ballsB = texture2D(uBilliardB, vTextureCoords);
	float fadeAmount = clamp(vTextureCoords.x * 2. - .5, 0., 1.);
	gl_FragColor = mix(ballsA, ballsB, fadeAmount);
}`,
			indexBuffer: indices,
			attributes: { aCoords: coords, aTextureCoords: texCoords },
			textures: {
				uBilliardA: billiardTexA,
				uBilliardB: billiardTexB,
			},
		});

		clear.run();

		return Promise.all([
			imagePromiseFromUrl("testimages.org/billiard_balls_a.png"),
			imagePromiseFromUrl("testimages.org/billiard_balls_b.png"),
		]).then((imgs) => {
			billiardTexA.texImage2D(imgs[0]);
			billiardTexB.texImage2D(imgs[1]);
			program.run();
			return expectPixelmatch(context, "spec/texture/fade-2/billiard-fade");
		});
	});
});
