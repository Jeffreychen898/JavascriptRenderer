class $Renderer_Shader {
	/* @param {String, String, Object} */
	/* [{name: String, size: number}] */
	constructor(vertexCode, fragmentCode, attributes) {
		const gl = $RendererVariable.Canvas.RenderingContext;

		this.$createProgram(vertexCode, fragmentCode);
		this.$setupAttribute(attributes);
	}

	/* @param {String, array} */
	setAttribData(attribName, data) {
		const gl = $RendererVariable.Canvas.RenderingContext;

		if(this.$m_attributeLocations.has(attribName)) {
			const vbo = this.$m_attributeLocations.get(attribName);
			if(vbo != $RendererVariable.WebGL.Binding.VBO) {
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
				$RendererVariable.WebGL.Binding.VBO = vbo;
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
		}
	}
	
	bind() {
		const gl = $RendererVariable.Canvas.RenderingContext;

		if($RendererVariable.WebGL.Binding.Shader != this.$m_program)
			this.$useProgram();
	}

	/* @private */
	/* @param {Object} */
	/* [{name: String, size: number}] */
	$setupAttribute(attributes) {
		const gl = $RendererVariable.Canvas.RenderingContext;
		//create vao
		//bind vao

		this.$m_attributeLocations = new Map();
		for(let attribute of attributes) {
			const vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

			const attrib_location = gl.getAttribLocation(this.$m_program, attribute.name);
			this.$m_attributeLocations.set(attribute.name, vbo);

			gl.vertexAttribPointer(attrib_location, attribute.size, gl.FLOAT, gl.FALSE, attribute.size * Float32Array.BYTES_PER_ELEMENT, 0);
			gl.enableVertexAttribArray(attrib_location);
		}
	}
	/* @param {String, String} */
	$createProgram(vertexCode, fragmentCode) {
		const gl = $RendererVariable.Canvas.RenderingContext;

		const vertex_shader = this.$compileShader(gl.VERTEX_SHADER, vertexCode);
		const fragment_shader = this.$compileShader(gl.FRAGMENT_SHADER, fragmentCode);
		
		this.$m_program = gl.createProgram();
		gl.attachShader(this.$m_program, vertex_shader);
		gl.attachShader(this.$m_program, fragment_shader);
		gl.linkProgram(this.$m_program);

		if(!gl.getProgramParameter(this.$m_program, gl.LINK_STATUS))
			console.error("ERROR Linking Shader Program " + gl.getProgramInfoLog(this.$m_program));
	}
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

		gl.useProgram(this.$m_program);
		$RendererVariable.WebGL.Binding.Shader = this.$m_program;
	}
}
