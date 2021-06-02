class Texture {
	/* @param {gl, String} */
	constructor(gl, source) {
		this.$m_gl = gl;
		this.$m_source = source;
	}
	load(callback) {
		const image = new Image();
		image.onload = () => {
			console.log(image);
			
			const canvas = this.$createCanvas(image.width, image.height, image);

			this.$createWebGLImage(canvas);
		}
		image.src = this.$m_source;
		image.setAttribute("crossOrigin", "");
	}

	/* @private */
	/* @param {Canvas} */
	$createWebGLImage(canvas) {
		const gl = this.$m_gl;

		const texture = gl.createTexture();
		this.$m_texture = texture;
		this.$bindTexture();

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}

	$bindTexture() {
		const gl = this.$m_gl;

		gl.bindTexture(gl.TEXTURE_2D, this.$m_texture);
	}

	/* @param {number, number, Image} */
	$createCanvas(width, height, image) {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext("2d");

		context.drawImage(image, 0, 0);
		return canvas;
	}
}
