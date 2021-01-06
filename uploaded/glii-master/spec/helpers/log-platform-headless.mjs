import { default as glMod } from "gl";

const gl = glMod(256, 256);

var unMaskedInfo = {
	renderer: "",
	vendor: "",
};

var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
if (dbgRenderInfo != null) {
	unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
	unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
}

console.log(process.title + " v" + process.version);

console.log("glVersion: ", gl.getParameter(gl.VERSION));
console.log("shadingLanguageVersion:", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
console.log("vendor:", gl.getParameter(gl.VENDOR));
console.log("renderer:", gl.getParameter(gl.RENDERER));
console.log("unMaskedVendor:", unMaskedInfo.vendor);
console.log("unMaskedRenderer:", unMaskedInfo.renderer);
console.log("extensions:", gl.getSupportedExtensions());
