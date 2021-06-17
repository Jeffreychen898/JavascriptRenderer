class $Renderer_TextureBuffer {
	/* @param {gl, number, number} */
	constructor(gl, width, height) {
		this.$m_gl = gl;

		this.width = width;
		this.height = height;

		this.$m_framebuffer;
		this.$m_framebufferTexture;

		this.$m_renderbuffer;
	}

	create() {
		const gl = this.$m_gl;

		// create the frame buffer object
		this.$m_framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.$m_framebuffer);

		this.$m_framebufferTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.$m_framebufferTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		const current_texture_slot = $RendererVariable.WebGL.Binding.TextureSlot;
		const initial_texture = $RendererVariable.WebGL.Binding.Textures[current_texture_slot];
		gl.bindTexture(gl.TEXTURE_2D, initial_texture);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.$m_framebufferTexture, 0);
		
		// create the render buffer object
		this.$m_renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, this.$m_renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.$m_renderbuffer);

		// error checking
		if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE)
			console.log("lsdjflaskjdf error");
		
		gl.bindFramebuffer(gl.FRAMEBUFFER, $RendererVariable.WebGL.Binding.FrameBuffer);
	}

	bind() {
		if($RendererVariable.WebGL.Binding.FrameBuffer != this.$m_framebuffer) {
			const gl = this.$m_gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.$m_framebuffer);
			$RendererVariable.WebGL.Binding.FrameBuffer = this.$m_framebuffer;
		}
	}
}

/* @param {gl} */
function $Renderer_BindDefaultFrameBuffer(gl) {
	if($RendererVariable.WebGL.Binding.FrameBuffer != null) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		$RendererVariable.WebGL.Binding.FrameBuffer = null;
	}
}
