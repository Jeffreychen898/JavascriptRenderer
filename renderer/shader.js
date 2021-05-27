class $Renderer_Shader {
	/* @param {String, String} */
	constructor(vertexCode, fragmentCode) {
		const gl = $RendererVariable.Canvas.RenderingContext;

		const vertex_shader = this.$compileShader(gl.VERTEX_SHADER, vertexCode);
		const fragment_shader = this.$compileShader(gl.FRAGMENT_SHADER, fragmentCode);
		
		this.m_program = gl.createProgram();
		gl.attachShader(this.m_program, vertex_shader);
		gl.attachShader(this.m_program, fragment_shader);
		gl.linkProgram(this.m_program);


		if(!gl.getProgramParameter(this.m_program, gl.LINK_STATUS))
			console.error("ERROR Linking Shader Program " + gl.getProgramInfoLog(this.$m_program));
	}
	
	bind() {
		const gl = $RendererVariable.Canvas.RenderingContext;

		if($RendererVariable.WebGL.Binding.Shader != this.m_program)
			this.$useProgram();
	}

	/* @private */
	/* @param {GL_Shader_Program, String} */
	$compileShader(type, shaderCode) {
		const gl = $RendererVariable.Canvas.RenderingContext;

		const shader = gl.createShader(type);
		gl.shaderSource(shader, shaderCode);

		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			console.error("ERROR Compiling Shader " + gl.getShaderInfoLog(shader));

		return shader;
	}

	$useProgram() {
		const gl = $RendererVariable.Canvas.RenderingContext;

		gl.useProgram(this.m_program);
		$RendererVariable.WebGL.Binding.Shader = this.m_program;
	}
}
