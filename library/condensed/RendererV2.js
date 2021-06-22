const $ShaderCode = new Map();
$ShaderCode.set("default", {
vert:`
attribute vec3 a_position;
attribute vec4 a_color;
attribute vec2 a_texCoord;

uniform mat4 u_projection;

varying vec4 v_color;
varying vec2 v_texCoord;

void main() {
	v_texCoord = a_texCoord;
	v_color = a_color;
	gl_Position = u_projection * vec4(a_position, 1.0);
}
`,
frag:`
precision mediump float;

varying vec4 v_color;
varying vec2 v_texCoord;

uniform sampler2D u_texture;

void main() {
	gl_FragColor = texture2D(u_texture, v_texCoord) * vec4(v_color);
}
`});

let $RendererVariable = {
	WebGL: {
		Binding: {
			Shader: undefined,
			BufferObject: undefined,
			FrameBuffer: null,
			TextureSlot: 0,
			Textures: []
		},
		MaxVertexCount: 10000
	},
	Texture: {
		Type: {
			Image: 0,
			ByteArray: 1
		}
	},
	Math: {
		Type: {
			Matrix4: 0,
			Vector4: 1
		}
	}
};

const Renderer = {
	Uniform: {
		Integer: 0,
		Float: 1,
		Vector2: 2,
		Vector3: 3,
		Vector4: 4,
		Matrix4: 5,
		IntegerArray: 6
	},
	MaxTextureSlot: undefined
}
class $Renderer_Matrix4 {
	/* @param{optional Array} */
	constructor(matrix) {
		this.matrix = new Array(16);
		this.type = $RendererVariable.Math.Type.Matrix4;

		if(matrix) {
			for(const i in matrix)
				this.matrix[i] = matrix[i];
		}
		else
			this.identity();
	}

	/* @param {Matrix4 | Vector4} */
	multiply(data) {
		if(data.type != $RendererVariable.Math.Type.Matrix4 &&
			data.type != $RendererVariable.Math.Type.Vector4) {
			console.error("[ERROR] The Matrix cannot be multiplied");
			return;
		}

		const result = this.multiplyRaw(data.matrix);

		if(data.type == $RendererVariable.Math.Type.Matrix4)
			return new $Renderer_Matrix4(result);
		else if(data.type == $RendererVariable.Math.Type.Vector4)
			return "Vector class not created yet :(";
		else
			return undefined;
	}

	/* @param {Array} */
	multiplyRaw(data) {
		const num_of_columns = Math.floor(data.length / 4);
		let result = new Array(4 * num_of_columns);

		for(let i=0;i<4;i++) {
			for(let j=0;j<num_of_columns;j++) {
				const v1 = this.matrix[i * 4] * data[j];
				const v2 = this.matrix[i * 4 + 1] * data[1 * num_of_columns + j];
				const v3 = this.matrix[i * 4 + 2] * data[2 * num_of_columns + j];
				const v4 = this.matrix[i * 4 + 3] * data[3 * num_of_columns + j];
				result[i * num_of_columns + j] = v1 + v2 + v3 + v4;
			}
		}

		return result;
	}

	transpose() {
		const new_matrix = new Array(16);
		for(let i=0;i<16;i++) {
			const col = i % 4;
			const row = Math.floor(i / 4);
			new_matrix[col * 4 + row] = this.matrix[row * 4 + col];
		}
		this.matrix = new_matrix;
	}

	identity() {
		for(let i=0;i<16;i++)
			this.matrix[i] = (i % 5 == 0)?1:0;
	}

	inverse() {
		//create adjugate matrix
		let adjugate_matrix = new Array(16);

		adjugate_matrix[0] =  this.$adjugateMatrixValue(5, 10, 15, 11, 14, 6, 9, 13, 7);
		adjugate_matrix[1] = -this.$adjugateMatrixValue(4, 10, 15, 11, 14, 6, 8, 12, 7);
		adjugate_matrix[2] =  this.$adjugateMatrixValue(4, 9, 15, 11, 13, 5, 8, 12, 7);
		adjugate_matrix[3] = -this.$adjugateMatrixValue(4, 9, 14, 10, 13, 5, 8, 12, 6);
		adjugate_matrix[4] = -this.$adjugateMatrixValue(1, 10, 15, 11, 14, 2, 9, 13, 3);
		adjugate_matrix[5] =  this.$adjugateMatrixValue(0, 10, 15, 11, 14, 2, 8, 12, 3);
		adjugate_matrix[6] = -this.$adjugateMatrixValue(0, 9, 15, 11, 13, 1, 8, 12, 3);
		adjugate_matrix[7] =  this.$adjugateMatrixValue(0, 9, 14, 10, 13, 1, 8, 12, 2);
		adjugate_matrix[8] =  this.$adjugateMatrixValue(1, 6, 15, 7, 14, 2, 5, 13, 3);
		adjugate_matrix[9] = -this.$adjugateMatrixValue(0, 6, 15, 7, 14, 2, 4, 12, 3);
		adjugate_matrix[10] =  this.$adjugateMatrixValue(0, 5, 15, 7, 13, 1, 4, 12, 3);
		adjugate_matrix[11] = -this.$adjugateMatrixValue(0, 5, 14, 6, 13, 1, 4, 12, 2);
		adjugate_matrix[12] = -this.$adjugateMatrixValue(1, 6, 11, 7, 10, 2, 5, 9, 3);
		adjugate_matrix[13] =  this.$adjugateMatrixValue(0, 6, 11, 7, 10, 2, 4, 8, 3);
		adjugate_matrix[14] = -this.$adjugateMatrixValue(0, 5, 11, 7, 9, 1, 4, 8, 3);
		adjugate_matrix[15] =  this.$adjugateMatrixValue(0, 5, 10, 6, 9, 1, 4, 8, 2);

		//find determinant
		let determinant = 0;
		for(let i=0;i<4;i++)
			determinant += this.matrix[i] * adjugate_matrix[i];
		console.log(determinant);

		if(determinant == 0)
			return false;

		//transpose
		const new_matrix = new Array(16);
		for(let i=0;i<16;i++) {
			const col = i % 4;
			const row = Math.floor(i / 4);
			new_matrix[col * 4 + row] = adjugate_matrix[row * 4 + col];
		}

		//multiply determinant
		for(const i in new_matrix)
			this.matrix[i] = new_matrix[i] / determinant;

		return true;
	}

	print() {
		for(let i=0;i<4;i++) {
			const index = i * 4;
			console.log(this.matrix[index] + " " + this.matrix[index + 1] + " "
			+ this.matrix[index + 2] + " " + this.matrix[index + 3]);
		}
	}

	/* @private */
	$adjugateMatrixValue(a, b, c, d, e, f, g, h, i) {
		const m = this.matrix;
		return m[a]*(m[b]*m[c] - m[d]*m[e]) - m[f]*(m[g]*m[c] - m[d]*m[h]) + m[i]*(m[g]*m[e] - m[b]*m[h]);
	}
}
function $Renderer_RotateZMatrix(matrix, angle) {
	const transformation_matrix = [
		Math.cos(angle), -Math.sin(angle), 0, 0,
		Math.sin(angle), Math.cos(angle), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(matrix.multiplyRaw(transformation_matrix));
}

function $Renderer_TranslateMatrix(matrix, x, y, z) {
	if(!z) z = 0;
	const transformation_matrix = [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(matrix.multiplyRaw(transformation_matrix));
}

function $Renderer_ScaleMatrix(matrix, x, y, z) {
	if(!z) z = 1;
	const transformation_matrix = [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(matrix.multiplyRaw(transformation_matrix));
}

function $Renderer_Camera2D(left, right, top, down) {
	const projection_matrix = [
		2 / (right - left), 0, 0, -(right + left)/(right - left),
		0, 2 / (top - down), 0, -(top + down)/(top - down),
		0, 0, 1, 0,
		0, 0, 0, 1
	];
	return new $Renderer_Matrix4(projection_matrix);
}
class $Renderer_TextureBuffer {
	/* @param {gl, number, number} */
	constructor(gl, width, height) {
		this.$m_gl = gl;

		this.width = width;
		this.height = height;

		this.defaultCamera = new $Renderer_Camera2D(0, width, 0, height);

		this.$m_framebuffer;
		this.$m_texture;

		this.$m_renderbuffer;
	}

	create() {
		const gl = this.$m_gl;

		// create the frame buffer object
		this.$m_framebuffer = gl.createFramebuffer();
		gl.bindFramebuffer(gl.FRAMEBUFFER, this.$m_framebuffer);

		this.$m_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.$m_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		const current_texture_slot = $RendererVariable.WebGL.Binding.TextureSlot;
		const initial_texture = $RendererVariable.WebGL.Binding.Textures[current_texture_slot];
		gl.bindTexture(gl.TEXTURE_2D, initial_texture);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.$m_texture, 0);
		
		// create the render buffer object
		this.$m_renderbuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, this.$m_renderbuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.$m_renderbuffer);

		gl.bindFramebuffer(gl.FRAMEBUFFER, $RendererVariable.WebGL.Binding.FrameBuffer);
	}

	bind() {
		if($RendererVariable.WebGL.Binding.FrameBuffer != this.$m_framebuffer) {
			const gl = this.$m_gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.$m_framebuffer);
			gl.viewport(0, 0, this.width, this.height);
			$RendererVariable.WebGL.Binding.FrameBuffer = this.$m_framebuffer;
		}
	}

	setCamera(renderer, camera) {
		renderer.flush();
		this.defaultCamera = camera;
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
}

/* @param {gl} */
function $Renderer_BindDefaultFrameBuffer(gl) {
	if($RendererVariable.WebGL.Binding.FrameBuffer != null) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		$RendererVariable.WebGL.Binding.FrameBuffer = null;
	}
}
class $Renderer_Shader {
	/* @param {gl, String, String, Array, Array} */
	/* [{name: String, size: number}] */
	/* [{name: String, type: Renderer.Uniform}] */
	constructor(gl, vertexCode, fragmentCode, attributes, uniforms) {
		this.$m_gl = gl;

		this.$createProgram(vertexCode, fragmentCode);
		this.$setupAttribute(attributes);
		if(uniforms) this.$setupUniform(uniforms);
		this.$setupIndexBuffer();
		this.bind();
	}

	/* @param {String, Array} */
	setAttribData(attribName, data) {
		const gl = this.$m_gl;

		if(this.$m_attributeLocations.has(attribName)) {
			this.bind();
			const vbo = this.$m_attributeLocations.get(attribName);
			if(vbo != $RendererVariable.WebGL.Binding.BufferObject) {
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				$RendererVariable.WebGL.Binding.BufferObject = vbo;
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		}
	}

	/* @param {Array} */
	setIndices(data) {
		const gl = this.$m_gl;

		this.bind();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$m_ibo);
		$RendererVariable.WebGL.Binding.BufferObject = this.$m_ibo;

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.DYNAMIC_DRAW);
	}

	/* @param {String, Array|number} */
	setUniform(name, data) {
		const gl = this.$m_gl;

		this.bind();

		if(this.$m_uniformLocations.has(name)) {
			this.$m_uniformData.set(name, data);
			
			const location = this.$m_uniformLocations.get(name);
			const type = location.type;

			if(type == Renderer.Uniform.Float)
				gl.uniform1f(location.location, data);
			else if(type == Renderer.Uniform.Vector2)
				gl.uniform2f(location.location, ...data);
			else if(type == Renderer.Uniform.Vector3)
				gl.uniform3f(location.location, ...data);
			else if(type == Renderer.Uniform.Vector4)
				gl.uniform4f(location.location, ...data);
			else if(type == Renderer.Uniform.Matrix4)
				gl.uniformMatrix4fv(location.location, true, data);
			else if(type == Renderer.Uniform.Integer)
				gl.uniform1i(location.location, data);
			else if(type == Renderer.Uniform.IntegerArray)
				gl.uniform1iv(location.location, data);
		}
	}

	bind() {
		const gl = this.$m_gl;

		if($RendererVariable.WebGL.Binding.Shader != this.$m_program) {
			gl.useProgram(this.$m_program);
			gl.bindVertexArray(this.$m_vao);

			$RendererVariable.WebGL.Binding.Shader = this.$m_program;
		}
	}

	/* @private */
	$setupIndexBuffer() {
		const gl = this.$m_gl;

		this.$m_ibo = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$m_ibo);
		$RendererVariable.WebGL.Binding.BufferObject = this.$m_ibo;
	}

	/* @param {array} */
	/* [{name: String, size: number}] */
	$setupAttribute(attributes) {
		const gl = this.$m_gl;

		this.$m_vao = gl.createVertexArray();
		gl.bindVertexArray(this.$m_vao);

		this.$m_attributeLocations = new Map();
		for(const attribute of attributes) {
			const vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
			$RendererVariable.WebGL.Binding.BufferObject = vbo;

			const attrib_location = gl.getAttribLocation(this.$m_program, attribute.name);
			this.$m_attributeLocations.set(attribute.name, vbo);

			gl.vertexAttribPointer(attrib_location, attribute.size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(attrib_location);
		}
	}

	/* @param {Array} */
	/* [{name: String, type: Renderer.Uniform}] */
	$setupUniform(uniforms) {
		const gl = this.$m_gl;

		this.$m_uniformLocations = new Map();
		for(const uniform of uniforms) {
			const location = gl.getUniformLocation(this.$m_program, uniform.name);
			this.$m_uniformLocations.set(uniform.name, {location: location, type: uniform.type});
		}

		this.$m_uniformData = new Map();
	}

	/* @param {String, String} */
	$createProgram(vertexCode, fragmentCode) {
		const gl = this.$m_gl;

		const vertex_shader = this.$compileShader(gl.VERTEX_SHADER, vertexCode);
		const fragment_shader = this.$compileShader(gl.FRAGMENT_SHADER, fragmentCode);
		
		this.$m_program = gl.createProgram();
		gl.attachShader(this.$m_program, vertex_shader);
		gl.attachShader(this.$m_program, fragment_shader);
		gl.linkProgram(this.$m_program);

		if(!gl.getProgramParameter(this.$m_program, gl.LINK_STATUS))
			console.error(`[ERROR] Linking Shader Program ${gl.getProgramInfoLog(this.$m_program)}`);
	}

	/* @param {GL_Shader_Program, String} */
	$compileShader(type, shaderCode) {
		const gl = this.$m_gl;

		const shader = gl.createShader(type);
		gl.shaderSource(shader, shaderCode);

		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			console.error(`[ERROR] Compiling Shader ${gl.getShaderInfoLog(shader)}`);

		return shader;
	}
}
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
				this.$drawShaders(shader, x, y, width, height, attributes, properties);
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
		let is_flushed = false;

		//texture buffers
		if(!properties.textureBuffer) {
			if($RendererVariable.WebGL.Binding.FrameBuffer != null && !is_flushed) {
				this.flush();
				is_flushed = true;
			}
			$Renderer_BindDefaultFrameBuffer(this.$m_gl);
			this.$m_gl.viewport(0, 0, this.$m_properties.canvasSize.width, this.$m_properties.canvasSize.height);
			this.setCamera(this.$m_defaultCamera);
		} else {
			if($RendererVariable.WebGL.Binding.FrameBuffer != properties.textureBuffer.$m_framebuffer && !is_flushed) {
				this.flush();
				is_flushed = true;
			}
			properties.textureBuffer.bind();
			this.$m_shaderProgram.setUniform("u_projection", properties.textureBuffer.defaultCamera.matrix);
		}

		//textures and texture slots
		if(properties.texture) {
			for(let i=0;i<properties.texture.length;i++) {
				if($RendererVariable.WebGL.Binding.Textures[i] != properties.texture[i].$m_texture) {
					if(!is_flushed) {
						this.flush();
						is_flushed = true;
					}
					properties.texture[i].bindTexture(i);
				}
			}
		}

		//shader and vertex count
		if(shader != this.$m_currentBoundProgram)
			this.$render(this.$m_currentBoundProgram);
		else if(this.$m_vertexCount + 4 > $RendererVariable.WebGL.MaxVertexCount)
			this.$render(this.$m_currentBoundProgram);

		//attributes
		if(!attributes) attributes = [];

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
			if(attrib.allVert) {
				attrib.content = [
					...attrib.content,
					...attrib.content,
					...attrib.content,
					...attrib.content
				];
			}
		}

		attributes.push({name: properties.position || "a_position", content: positions});

		for(let i=0;i<attributes.length;i++) {
			const attribute_index = this.$m_attributesTracker.get(attributes[i].name);
			if(typeof(attribute_index) == "number")
				this.$m_attributes[attribute_index].content.push(...(attributes[i].content));
			else {
				this.$m_attributesTracker.set(attributes[i].name, this.$m_attributes.length);
				this.$m_attributes.push({ name: attributes[i].name, content: attributes[i].content });
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

