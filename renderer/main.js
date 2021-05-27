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
`;
const $R = {
	Create: {
		Renderer: (config) => { return new $Renderer_Main(config); },
		Shader: () => { return new $Renderer_Shader(vert, frag, attributes); }
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

		const attribs = [
			{
				name: "vertPosition",
				size: 2
			}
		];
		const shader_program = new $Renderer_Shader(vert, frag, attribs);

		const triangleVertices = [
			-0.5,  0.5,
			 0.5,  0.5,
			 0.5, -0.5,
			-0.5, -0.5,
		];

		const indices = [
			0, 1, 2,
			0, 2, 3
		];

		shader_program.setAttribData("vertPosition", triangleVertices);
		shader_program.setIndices(indices);

		//in loop
		shader_program.bind();
		gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	}
}

