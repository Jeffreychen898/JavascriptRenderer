const $R = {
	Create: {
		Renderer: (config) => { return new $Renderer_Main(config); },
		Matrix4: (matrix) => { return new $Renderer_Matrix4(matrix); },
		Camera2D: (left, right, top, down) => { return new $Renderer_Camera2D(left, right, top, down); }
	},
	Apply: {
		Rotation: (matrix, angle) => { return $Renderer_RotateZMatrix(matrix, angle) },
		Translate: (matrix, x, y, z) => { return $Renderer_TranslateMatrix(matrix, x, y, z) },
		Scale: (matrix, x, y, z) => { return $Renderer_ScaleMatrix(matrix, x, y, z) }
	}
}

class $Renderer_Main {
	/* @param {Object}
	 * canvas: canvas id 
	 * canvasWidth: number
	 * canvasHeight: number
	*/
	constructor(config) {
		this.$m_canvas = document.getElementById(config.canvas);
		this.$m_gl = this.$m_canvas.getContext("webgl2");

		this.$m_properties = {
			canvasSize: {
				width: config.canvasWidth || this.$m_canvas.width,
				height: config.canvasHeight || this.$m_canvas.height
			}
		};

		this.$m_vertexCount = 0;
		this.$m_attributes = [];
		this.$m_indices = [];

		this.$setupRendering();
		this.$loadDefaultTextures();

		//collections of methods
		this.draw = {
			rect: (x, y, width, height, properties) => {
				if(!properties) properties = {};
				this.$drawImage(this.$m_whiteTexture, x, y, width, height, properties);
			},
			image: (image, x, y, width, height, properties) => {
				if(!properties) properties = {};
				this.$drawImage(image, x, y, width, height, properties);
			},
			shader: (shader, x, y, width, height, attributes, properties) => {
				if(!properties) properties = {};
				this.$drawShaders(shader, x, y, width, height, attributes, properties);
			}
		}
	}

	/* @param{String, String, [Object]} */
	/* [{name: String, size: number}] */
	createShader(vertexShader, fragmentShader, attributes, uniforms) {
		return new $Renderer_Shader(this.$m_gl, vertexShader, fragmentShader, attributes, uniforms);
	}

	/* @param {number, number} */
	createTextureBuffer(width, height) {
		const texture_buffer = new $Renderer_TextureBuffer(this.$m_gl, width, height);
		texture_buffer.create();
		
		return texture_buffer;
	}

	flush() {
		if(this.$m_vertexCount > 0)
			this.$render(this.$m_currentBoundProgram);
	}

	/* @param {Matrix4} */
	setCamera(camera) {
		this.flush();
		this.$m_shaderProgram.setUniform("u_projection", camera.matrix);
	}
	
	/* @private */
	/* @param {Shader, number, number, number, number, array, Object} */
	/* [{name: String, content: array, [optional]allVert: boolean} */
	/*
		texture: [Texture]
		position: String
		transformation: Matrix4
		textureBuffer: TextureBuffer
	*/
	$drawShaders(shader, x, y, width, height, attributes, properties) {
		if(!properties.textureBuffer) {
			if($RendererVariable.WebGL.Binding.FrameBuffer != null)
				this.flush();
			$Renderer_BindDefaultFrameBuffer(this.$m_gl);
		} else {
			if($RendererVariable.WebGL.Binding.FrameBuffer != properties.textureBuffer.$m_framebuffer)
				this.flush();
			properties.textureBuffer.bind();
		}

		let texture_binding_list = [];
		if(properties.texture) {
			for(const i in properties.texture) {
				if($RendererVariable.WebGL.Binding.Textures[i] != properties.texture[i].$m_texture)
					texture_binding_list.push({texture: properties.texture[i], slot: i});
			}
		}

		if(texture_binding_list.length > 0) {
			this.flush();

			for(const each_texture of texture_binding_list)
				each_texture.texture.bindTexture(each_texture.slot);
		}

		if(shader != this.$m_currentBoundProgram)
			this.$render(this.$m_currentBoundProgram);
		else if(this.$m_vertexCount + 4 > $RendererVariable.WebGL.MaxVertexCount)
			this.$render(this.$m_currentBoundProgram);


		if(!attributes)
			attributes = [];

		const positions = [
			x, y, 0,
			x + width, y, 0,
			x + width, y + height, 0,
			x, y + height, 0
		];

		if(properties.transformation) {
			for(let i=0;i<4;i++) {
				const vertex_position = [
					positions[i * 3],
					positions[i * 3 + 1],
					positions[i * 3 + 2],
					1
				];
				const new_vertex_position = properties.transformation.multiplyRaw(vertex_position);
				positions[i * 3] = new_vertex_position[0];
				positions[i * 3 + 1] = new_vertex_position[1];
				positions[i * 3 + 2] = new_vertex_position[2];
			}
		}

		for(const attrib of attributes) {
			if(attrib.allVert)
				attrib.content.push(...attrib.content, ...attrib.content, ...attrib.content);
		}

		attributes.push({name: properties.position || "a_position", content: positions});
		for(let i=0;i<attributes.length;i++) {
			let found = false;
			for(let j=0;j<this.$m_attributes.length;j++) {
				if(attributes[i].name == this.$m_attributes[j].name) {
					this.$m_attributes[j].content.push(...(attributes[i].content));
					found = true;
					break;
				}
			}
			if(!found) {
				this.$m_attributes.push(attributes[i]);
			}
		}

		this.$m_indices.push(
			this.$m_vertexCount, this.$m_vertexCount + 1, this.$m_vertexCount + 2,
			this.$m_vertexCount, this.$m_vertexCount + 2, this.$m_vertexCount + 3
		);

		this.$m_vertexCount += 4;
		this.$m_currentBoundProgram = shader;
	}

	/* @param{Texture, number, number, number, number, Object} */
	/*
		color: [number, number, number]
		transformation: Matrix4
		textureBuffer: Texture Buffer
	*/
	$drawImage(image, x, y, width, height, properties) {
		let color = [255, 255, 255, 255];
		if(typeof(properties.color) == "object") {
			switch(properties.color.length) {
				case 1:
					color = [
						properties.color[0],
						properties.color[0],
						properties.color[0],
						255
					];
					break;
				case 2:
					color = [
						properties.color[0],
						properties.color[0],
						properties.color[0],
						properties.color[1]
					];
					break;
				case 3:
					color = [
						properties.color[0],
						properties.color[1],
						properties.color[2],
						255
					];
					break;
				case 4:
					color = [...properties.color];
					break;
			}
		};
		for(let i=0;i<color.length;i++)
			color[i] = color[i] / 255;

		const tex_coords = [
			0, 1,
			1, 1,
			1, 0,
			0, 0
		];

		const attributes = [
			{name: "a_color", content: color, allVert: true},
			{name: "a_texCoord", content: tex_coords, allVert: false}
		];

		properties.texture = [image];
		this.$drawShaders(this.$m_shaderProgram, x, y, width, height, attributes, properties);
	}

	/* @param {Program} */
	$render(program) {
		const gl = this.$m_gl;

		for(const each_attrib of this.$m_attributes)
			program.setAttribData(each_attrib.name, each_attrib.content);

		program.setIndices(this.$m_indices);

		program.bind();
		gl.drawElements(gl.TRIANGLES, this.$m_indices.length, gl.UNSIGNED_SHORT, 0);

		this.$clearAttribs();
		this.$m_vertexCount = 0;
	}

	$clearAttribs() {
		this.$m_attributes = [];
		this.$m_indices = [];
	}

	$loadDefaultTextures() {
		const white_texture_data = {
			data: new Uint8Array([255, 255, 255, 255]),
			width: 1,
			height: 1
		};
		this.$m_whiteTexture = new Texture(this.$m_gl, white_texture_data);
		this.$m_whiteTexture.createTexture();
	}

	$setupRendering() {
		const gl = this.$m_gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		Renderer.MaxTextureSlot = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const attribs = [
			{
				name: "a_position",
				size: 3
			},
			{
				name: "a_color",
				size: 4
			},
			{
				name: "a_texCoord",
				size: 2
			}
		];

		const uniforms = [
			{name: "u_projection", type: Renderer.Uniform.Matrix4},
			{name: "u_texture", type: Renderer.Uniform.Integer}
		];

		const canvasWidth = this.$m_properties.canvasSize.width;
		const canvasHeight = this.$m_properties.canvasSize.height;
		const matrix = [
			2/canvasWidth, 0, 0, -1,
			0, 2/-canvasHeight, 0, 1,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		this.$m_shaderProgram = new $Renderer_Shader(gl, $ShaderCode.default.vert, $ShaderCode.default.frag, attribs, uniforms);

		this.$m_shaderProgram.setUniform("u_projection", matrix);
		this.$m_shaderProgram.setUniform("u_texture", 0);

		this.$m_shaderProgram.bind();
		this.$m_currentBoundProgram = this.$m_shaderProgram;
	}
}

