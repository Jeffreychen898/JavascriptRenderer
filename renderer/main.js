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

let drawcall = 0;

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
		this.$m_attributesTracker = new Map();
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
				//this.$drawShaders(shader, x, y, width, height, attributes, properties);
			},
			vertex: (shader, position, attribute) => {
				this.$setVertex(shader, position, attribute);
			},
			shape: (shape) => {
				this.$drawShape(shape);
			}
		}

		this.create = {
			/* @param {String} */
			texture: (source) => {
				const new_texture = new Texture(this.$m_gl, source);
				new_texture.load();

				return new_texture;
			},
			/* @param {String, String, [Object]} */
			/* [{name: String, size: number}] */
			shader: (vertexShader, fragmentShader, attributes, uniforms) => {
				return new $Renderer_Shader(this.$m_gl, vertexShader, fragmentShader, attributes, uniforms);
			},
			/* @param {number, number} */
			textureBuffer: (width, height) => {
				const texture_buffer = new $Renderer_TextureBuffer(this.$m_gl, width, height);
				texture_buffer.create();

				return texture_buffer;
			},
			shape: (properties, shader) => {
				return this.$createShape(properties, shader);
			}
		}
	}

	flush() {
		if(this.$m_vertexCount > 0)
			this.$render(this.$m_currentBoundProgram);
	}

	/* @param {Matrix4} */
	setCamera(camera) {
		this.flush();
		this.$m_defaultCamera = camera;
		this.$m_shaderProgram.setUniform("u_projection", camera.matrix);
	}

	/* @param {number, number, boolean} */
	resizeCanvas(width, height, adjustCamera) {
		if(adjustCamera == undefined) adjustCamera = true;
		this.$m_canvas.width = width;
		this.$m_canvas.height = height;

		this.$m_properties.canvasSize.width = width;
		this.$m_properties.canvasSize.height = height;

		if($RendererVariable.WebGL.Binding.FrameBuffer == null)
			this.$m_gl.viewport(0, 0, width, height);
		
		if(adjustCamera)
			this.setCamera(new $Renderer_Camera2D(0, width, 0, height));
	}

	/* @param {(optional)JSONObject, (optional)Shader}*/
	/*
		color: [number]
		texture: [Texture]
		position: String
		transformation: Matrix4
		textureBuffer: TextureBuffer
	*/
	$createShape(properties, shader) {
		if(!shader) {
			let color = [1, 1, 1, 1];
			if(properties.color) {
				switch(properties.color.length) {
					case 1:
						color = [
							properties.color[0] / 255,
							properties.color[0] / 255,
							properties.color[0] / 255,
							1
						];
						break;
					case 2:
						color = [
							properties.color[0] / 255,
							properties.color[0] / 255,
							properties.color[0] / 255,
							properties.color[1] / 255
						];
						break;
					case 3:
						color = [
							properties.color[0] / 255,
							properties.color[1] / 255,
							properties.color[2] / 255,
							1
						];
						break;
					case 4:
						color = [
							properties.color[0] / 255,
							properties.color[1] / 255,
							properties.color[2] / 255,
							properties.color[3] / 255
						];
						break;
				}
			}
			properties.color = color;

			if(!properties.texture) properties.texture = [this.$m_whiteTexture];
			if(properties.texture.length == 0) properties.texture = [this.$m_whiteTexture];

			shader = this.$m_shaderProgram;
		}

		const shapes_properties = {
			properties: properties,
			shader: shader || null,
			vertices: []
		};

		return shapes_properties;
	}

	/* @param {x, y, Array} */
	/* [{name: String, value: Array }] */
	$setVertex(shape, position, attributes) {
		if(!attributes) attributes = [];
		if(shape.shader == this.$m_shaderProgram) {
			let color_found = false;
			let texCoord_found = false;
			for(const attribute of attributes) {
				if(attribute.name == "a_color")
					color_found = true;
				else if(attribute.name == "a_texCoord")
					texCoord_found = true;
			}
			if(!color_found)
				attributes.push({name: "a_color", values: shape.properties.color});
			if(!texCoord_found)
				attributes.push({name: "a_texCoord", values: [0, 0]});
		}

		const attribs = [
			...attributes,
			{
				name: shape.properties.position || "a_position",
				values: [position.x, position.y, position.z || 0]
			}
		];
		shape.vertices.push(attribs);
	}

	/* @param {shape} */
	$drawShape(shape) {
		if(shape.vertices.length < 3)
			return;

		let is_flushed = false;
		
		//texture buffers
		if(!shape.properties.textureBuffer) {
			if($RendererVariable.WebGL.Binding.FrameBuffer != null && !is_flushed) {
				this.setCamera(this.$m_defaultCamera);
				is_flushed = true;

				$Renderer_BindDefaultFrameBuffer(this.$m_gl);
				this.$m_gl.viewport(0, 0, this.$m_properties.canvasSize.width, this.$m_properties.canvasSize.height);
			}
		} else {
			if($RendererVariable.WebGL.Binding.FrameBuffer != shape.properties.textureBuffer.$m_framebuffer && !is_flushed) {
				this.flush();
				is_flushed = true;

				shape.properties.textureBuffer.bind();
				this.$m_shaderProgram.setUniform("u_projection", shape.properties.textureBuffer.defaultCamera.matrix);
			}
		}

		//textures and texture slots
		if(shape.properties.texture) {
			for(let i=0;i<shape.properties.texture.length;i++) {
				if($RendererVariable.WebGL.Binding.Textures[i] != shape.properties.texture[i].$m_texture) {
					if(!is_flushed) {
						this.flush();
						is_flushed = true;
					}
					shape.properties.texture[i].bindTexture(i);
				}
			}
		}

		//shader and vertex count
		if(shape.shader != this.$m_currentBoundProgram)
			this.$render(this.$m_currentBoundProgram);
		else if(this.$m_vertexCount + 4 > $RendererVariable.WebGL.MaxVertexCount)
			this.$render(this.$m_currentBoundProgram);

		//attributes
		const position_name = shape.properties.position || "a_position";
		for(let i=0;i<shape.vertices.length;i++) {
			for(let j=0;j<shape.vertices[i].length;j++) {
				if(shape.vertices[i][j].name == position_name && shape.properties.transformation) {
					const new_vertex_position = shape.properties.transformation.multiplyRaw([...shape.vertices[i][j].values, 1]);
					shape.vertices[i][j].values[0] = new_vertex_position[0];
					shape.vertices[i][j].values[1] = new_vertex_position[1];
					shape.vertices[i][j].values[2] = new_vertex_position[2];
				}

				const attribute_index = this.$m_attributesTracker.get(shape.vertices[i][j].name);
				if(typeof(attribute_index) == "number")
					this.$m_attributes[attribute_index].content.push(...(shape.vertices[i][j].values));
				else {
					this.$m_attributesTracker.set(shape.vertices[i][j].name, this.$m_attributes.length);
					this.$m_attributes.push({ name: shape.vertices[i][j].name, content: [...(shape.vertices[i][j].values)]});
				}
			}
		}

		for(let i=2;i<shape.vertices.length;i++) {
			this.$m_indices.push(this.$m_vertexCount, this.$m_vertexCount + i - 1, this.$m_vertexCount + i);
		}

		this.$m_vertexCount += shape.vertices.length;
		this.$m_currentBoundProgram = shape.shader;
	}
	
	/* @private */
	/* @param {Shader, number, number, number, number, array, Object} */
	/* [{name: String, content: array, [optional]allVert: boolean} */
	/*
		color: Array
		texture: [Texture]
		position: String
		transformation: Matrix4
		textureBuffer: TextureBuffer
	*/

	/* @param{Texture, number, number, number, number, Object} */
	/*
		color: [number, number, number]
		transformation: Matrix4
		textureBuffer: Texture Buffer
	*/
	$drawImage(image, x, y, width, height, properties) {
		properties.texture = [image];
		const new_shape = this.$createShape(properties);
		this.$setVertex(new_shape, {x: x, y: y}, [{name: "a_texCoord", values: [0, 1]}]);
		this.$setVertex(new_shape, {x: x + width, y: y}, [{name: "a_texCoord", values: [1, 1]}]);
		this.$setVertex(new_shape, {x: x + width, y: y + height}, [{name: "a_texCoord", values: [1, 0]}]);
		this.$setVertex(new_shape, {x: x, y: y + height}, [{name: "a_texCoord", values: [0, 0]}]);
		this.$drawShape(new_shape);
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
		this.$m_attributesTracker = new Map();
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
		this.$m_defaultCamera = new $Renderer_Camera2D(0, canvasWidth, 0, canvasHeight);
		this.$m_shaderProgram = new $Renderer_Shader(gl, $ShaderCode.get("default").vert, $ShaderCode.get("default").frag, attribs, uniforms);

		this.$m_shaderProgram.setUniform("u_projection", this.$m_defaultCamera.matrix);
		this.$m_shaderProgram.setUniform("u_texture", 0);

		this.$m_shaderProgram.bind();
		this.$m_currentBoundProgram = this.$m_shaderProgram;
	}
}

