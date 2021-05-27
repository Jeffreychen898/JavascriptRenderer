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
		Shader: () => { return new $Renderer_Shader(); }
	}
}

class $Renderer_Main {
	/* @param {Object}
	 * canvas: canvas id 
	*/
	constructor(config) {
		this.$m_canvas = document.getElementById(config.canvas);
		this.$m_gl = this.$m_canvas.getContext("webgl2");

		this.$setupRendering();
	}

	/* @private */
	$setupRendering() {
		const gl = this.$m_gl;

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

		gl.shaderSource(vertexShader, vert);
		gl.shaderSource(fragmentShader, frag);

		gl.compileShader(vertexShader);
		if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
			console.error("ERROR Vert", gl.getShaderInfoLog(vertexShader));
			return;
		}
		gl.compileShader(fragmentShader);
		if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
			console.error("ERROR Frag", gl.getShaderInfoLog(fragmentShader));
			return;
		}

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("ERROR linking", gl.getProgramInfoLog(program));
			return;
		}

		//debug>>
		gl.validateProgram(program);
		if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
			console.error("ERROR", gl.getProgramInfoLog(program));
			return;
		}
		//<<

		const triangleVertices = [
			0.0, 0.5,
			-0.5, -0.5,
			0.5, -0.5
		];

		const triangleVertexBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

		const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
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
		gl.useProgram(program);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}

