const vert = `
attribute vec2 a_position;
attribute vec3 a_color;
attribute vec2 a_texCoord;

uniform mat4 projection;

varying vec3 v_color;
varying vec2 v_texCoord;

void main() {
	v_texCoord = a_texCoord;
	v_color = a_color;
	gl_Position = projection * vec4(a_position, 0.0, 1.0);
}
`;
const frag = `
precision mediump float;

varying vec3 v_color;
varying vec2 v_texCoord;

uniform sampler2D u_texture;

void main() {
	gl_FragColor = texture2D(u_texture, v_texCoord) * vec4(v_color, 1.0);
}
`;
const $R = {
	Create: {
		Renderer: (config) => { return new $Renderer_Main(config); }
	}
}

class $Renderer_Main {
	/* @param {Object}
	 * canvas: canvas id 
	*/
	constructor(config) {
		this.$m_canvas = document.getElementById(config.canvas);
		this.$m_gl = this.$m_canvas.getContext("webgl2");

		this.$m_attributes = [];
		this.$m_indices = [];

		this.$setupRendering();
		this.$loadDefaultTextures();

		//collections of methods
		this.draw = {
			rect: (x, y, width, height, properties) => {
				this.$drawRectangle(x, y, width, height, properties)
			},
			image: (image, x, y, width, height, properties) => {
				this.$drawImage(image, x, y, width, height, properties);
			},
			shader: (shader, x, y, width, height, attributes, properties) => {
				this.$drawShaders(shader, x, y, width, height, attributes, properties);
			}
		}
	}

	/* @param{String, String, [Object]} */
	/* [{name: String, size: number}] */
	createShader(vertexShader, fragmentShader, attributes, uniforms) {
		return new $Renderer_Shader(this.$m_gl, vertexShader, fragmentShader, attributes, uniforms);
	}
	
	/* @private */
	/* @param {Shader, number, number, number, number, array, Object} */
	/* [{name: String, content: array, [optional]allVert: boolean} */
	/* {
		position: String
	}*/
	$drawShaders(shader, x, y, width, height, attributes, properties) {
		if(!attributes)
			attributes = [];

		const positions = [
			x, y,
			x + width, y,
			x + width, y + height,
			x, y + height
		];

		for(const attrib of attributes) {
			if(attrib.allVert)
				attrib.content.push(...attrib.content, ...attrib.content, ...attrib.content);
		}

		this.$m_attributes = [
			{name: properties.position || "a_position", content: positions},
			...attributes
		];

		this.$m_indices = [
			0, 1, 2,
			0, 2, 3
		];

		this.$render(shader);
	}

	/* @param{Texture, number, number, number, number, Object} */
	/* {
		color: [number, number, number]
	}*/
	$drawImage(image, x, y, width, height, properties) {
		image.bindTexture(0);

		let color = [1, 1, 1];
		if(properties) {
			if(properties.color) color = properties.color;
		}

		const triangleVertices = [
			x, y,
			x + width, y,
			x + width, y + height,
			x, y + height
		];

		const triangleColors = [
			color[0], color[1], color[2],
			color[0], color[1], color[2],
			color[0], color[1], color[2],
			color[0], color[1], color[2],
		];

		const triangleTexCoords = [
			0, 0,
			1, 0,
			1, 1,
			0, 1
		];

		this.$m_attributes = [
			{name: "a_position", content: triangleVertices},
			{name: "a_color", content: triangleColors},
			{name: "a_texCoord", content: triangleTexCoords}
		];

		this.$m_indices = [
			0, 1, 2,
			0, 2, 3
		];

		this.$render(this.$m_shaderProgram);
	}

	/* @param {number, number, number, number, Object} */
	/* {
		color: [number, number, number]
	}*/
	$drawRectangle(x, y, width, height, properties) {
		this.$m_whiteTexture.bindTexture(0);
		this.$drawImage(this.$m_whiteTexture, x, y, width, height, properties);
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

		Renderer.MaxTextureSlot = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const attribs = [
			{
				name: "a_position",
				size: 2
			},
			{
				name: "a_color",
				size: 3
			},
			{
				name: "a_texCoord",
				size: 2
			}
		];

		const uniforms = [
			{name: "projection", type: Renderer.Uniform.Matrix4},
			{name: "u_texture", type: Renderer.Uniform.Integer}
		];

		const matrix = [
			2/400, 0, 0, -1,
			0, 2/-400, 0, 1,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
		this.$m_shaderProgram = new $Renderer_Shader(gl, vert, frag, attribs, uniforms);

		this.$m_shaderProgram.setUniform("projection", matrix);
		this.$m_shaderProgram.setUniform("u_texture", 0);
	}
}

