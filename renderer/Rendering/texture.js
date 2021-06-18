class Texture {
	/* @param {gl, String | Object} */
	/*
		data: Uint8Array,
		width: number,
		height: number
	*/
	constructor(gl, source) {
		this.$m_gl = gl;

		if(typeof(source) == "string")
			this.$m_type = $RendererVariable.Texture.Type.Image;
		else if(typeof(source == "object"))
			this.$m_type = $RendererVariable.Texture.Type.ByteArray;

		this.$m_source = source;
	}

	/* @param {function()} */
	load(callback) {
		const image = new Image();
		image.onload = () => {
			const canvas = this.$createCanvas(image.width, image.height, image);

			this.$createWebGLImage(canvas, {width: canvas.width, height: canvas.height});

			if(typeof(callback) == "function") callback();
		}
		image.src = this.$m_source;
		image.setAttribute("crossOrigin", "");
	}
	/* @param {function()} */
	createTexture(callback) {
		this.$createWebGLImage(this.$m_source.data, {width: this.$m_source.width, height: this.$m_source.height});
		if(typeof(callback) == "function") callback();
	}

	/* @param {number} */
	bindTexture(texSlot) {
		const gl = this.$m_gl;

		if(!Renderer.MaxTextureSlot) {
			console.error("[ERROR] Renderer has not been initialized properly!");
			return;
		}

		if(texSlot > Renderer.MaxTextureSlot) {
			console.error(`[ERROR] The max texture slot of ${Renderer.MaxTextureSlot} has been reached`);
			return;
		}

		const tex_slot = $RendererVariable.WebGL.Binding.TextureSlot;
		if($RendererVariable.WebGL.Binding.Textures[texSlot] != this.$m_texture) {
			if(texSlot != tex_slot) {
				gl.activeTexture(gl.TEXTURE0 + texSlot);
				$RendererVariable.WebGL.Binding.TextureSlot = texSlot;
			}

			gl.bindTexture(gl.TEXTURE_2D, this.$m_texture);
			$RendererVariable.WebGL.Binding.Textures[tex_slot] = this.$m_texture;
		}
	}

	/* @private */
	/* @param {Canvas | Uint8Array, Object} */
	/*
		width: number,
		height: number
	*/
	$createWebGLImage(data, properties) {
		const gl = this.$m_gl;

		const texture = gl.createTexture();
		this.$m_texture = texture;
		this.bindTexture(0);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, properties.width, properties.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}

	/* @param {number, number, Image} */
	$createCanvas(width, height, image) {
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext("2d");

		context.scale(1, -1);
		context.drawImage(image, 0, -canvas.height);
		return canvas;
	}
}
