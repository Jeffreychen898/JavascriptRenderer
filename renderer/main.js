const vert = `
attribute vec2 a_position;
attribute vec3 a_color;

varying vec3 v_color;

void main() {
	v_color = a_color;
	gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
const frag = `
precision mediump float;

varying vec3 v_color;

void main() {
	gl_FragColor = vec4(v_color, 1.0);
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

		//methods
		this.draw = {
			rect: (x, y, w, h) => {
				this.$drawRectangle(x, y, w, h)
			}
		}

	}

	/* @param{String, String, [Object]} */
	/* [{name: String, size: number}] */
	createShader(vertexShader, fragmentShader, attributes) {
		return new $Renderer_Shader(this.$m_gl, vertexShader, fragmentShader, attributes);
	}

	/* @private */
	/* @param {number, number, number, number} */
	$drawRectangle(x, y, w, h) {
		const triangleVertices = [
			-0.5,  0.5,
			 0.5,  0.5,
			 0.5, -0.5,
			-0.5, -0.5,
		];

		const triangleColors = [
			1.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			1.0, 0.0, 1.0,
			0.0, 1.0, 1.0
		];

		this.$m_attributes = [
			{name: "a_position", content: triangleVertices},
			{name: "a_color", content: triangleColors}
		];

		this.$m_indices = [
			0, 1, 2,
			0, 2, 3
		];

		this.$render(this.$m_shader_program);
	}

	/* @param {Program} */
	$render(program) {
		const gl = this.$m_gl;

		for(let each_attrib of this.$m_attributes)
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

	$setupRendering() {
		const gl = this.$m_gl;

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
			}
		];
		this.$m_shader_program = new $Renderer_Shader(gl, vert, frag, attribs);

		/* const triangleVertices = [
			-0.5,  0.5,
			 0.5,  0.5,
			 0.5, -0.5,
			-0.5, -0.5,
		];
		const triangleColors = [
			1.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			1.0, 0.0, 1.0,
			0.0, 1.0, 1.0
		];
		this.$m_attributes = [
			{name: "a_position", content: triangleVertices},
			{name: "a_color", content: triangleColors}
		];

		this.$m_indices = [
			0, 1, 2,
			0, 2, 3
		];

		this.$render(this.$m_shader_program);*/
	}
}

