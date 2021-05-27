const vert = `
attribute vec2 vertPosition;

void main() {
	gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;
const frag = `
precision mediump float;
void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
const $R = {
	Create: {
		Renderer: (config) => { return new $Renderer_Main(config); },
		Shader: () => { return new $Renderer_Shader(vert, frag); }
	}
}

class $Renderer_Main {
	/* @param {Object}
	 * canvas: canvas id 
	*/
	constructor(config) {
		this.$m_canvas = document.getElementById(config.canvas);
		this.$m_gl = this.$m_canvas.getContext("webgl2");

		$RendererVariable.Canvas.RenderingContext = this.$m_gl;

		this.$setupRendering();
	}

	/* @private */
	$setupRendering() {
		const gl = this.$m_gl;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const shader_program = new $Renderer_Shader(vert, frag);

		const triangleVertices = [
			0.0, 0.5,
			-0.5, -0.5,
			0.5, -0.5
		];

		const triangleVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

		const positionAttribLocation = gl.getAttribLocation(shader_program.m_program, "vertPosition");
		gl.vertexAttribPointer(
			positionAttribLocation,
			2,//vec2
			gl.FLOAT,//type
			gl.FALSE,//normalize
			2 * Float32Array.BYTES_PER_ELEMENT, //size
			0, //offset
		);

		gl.enableVertexAttribArray(positionAttribLocation);

		//in loop
		shader_program.bind();
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}

