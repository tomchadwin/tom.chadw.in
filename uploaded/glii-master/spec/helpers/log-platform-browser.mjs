const canvas = document.createElement("canvas");

function get(name) {
	try {
		return canvas.getContext(name);
	} catch (e) {
		return undefined;
	}
}

const gl =
	get("webgl2") ||
	get("webgl") ||
	get("experimental-webgl") ||
	get("webgl-experimental");

const unMaskedInfo = {
	renderer: "",
	vendor: "",
};

const dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
if (dbgRenderInfo != null) {
	unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
	unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
}

console.log("browser: ", navigator.userAgent);

console.log("glVersion: ", gl.getParameter(gl.VERSION));
console.log("shadingLanguageVersion:", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
console.log("vendor:", gl.getParameter(gl.VENDOR));
console.log("renderer:", gl.getParameter(gl.RENDERER));
console.log("unMaskedVendor:", unMaskedInfo.vendor);
console.log("unMaskedRenderer:", unMaskedInfo.renderer);
// console.log("extensions:", gl.getSupportedExtensions());
console.log("extensions: \n\t", gl.getSupportedExtensions().join("\n\t"));
