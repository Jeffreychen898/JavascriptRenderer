class $Renderer_Shader {
	/* @param {gl, String, String, Object} */
	/* [{name: String, size: number}] */
	constructor(gl, vertexCode, fragmentCode, attributes, uniforms) {
		this.$m_gl = gl;

		this.$createProgram(vertexCode, fragmentCode);
		this.$setupAttribute(attributes);
		if(uniforms) this.$setupUniform(uniforms);
		this.$setupIndexBuffer();
		this.bind();
	}

	/* @param {String, array} */
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

	/* @param {array} */
	setIndices(data) {
		const gl = this.$m_gl;

		this.bind();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$m_ibo);
		$RendererVariable.WebGL.Binding.BufferObject = this.$m_ibo;

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.DYNAMIC_DRAW);
	}

	/* @param {array|number} */
	setUniform(name, data) {
		const gl = this.$m_gl;

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
		}
	}

	bind() {
		const gl = this.$m_gl;

		if($RendererVariable.WebGL.Binding.Shader != this.$m_program) {
			gl.useProgram(this.$m_program);
			gl.bindVertexArray(this.$m_vao);

			for(let [key, value] of this.$m_uniformData)
				this.setUniform(key, value);

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
		for(let attribute of attributes) {
			const vbo = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
			$RendererVariable.WebGL.Binding.BufferObject = vbo;

			const attrib_location = gl.getAttribLocation(this.$m_program, attribute.name);
			this.$m_attributeLocations.set(attribute.name, vbo);

			gl.vertexAttribPointer(attrib_location, attribute.size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(attrib_location);
		}
	}

	/* @param {array} */
	/* [{name: String, type: Renderer.Uniform}] */
	$setupUniform(uniforms) {
		const gl = this.$m_gl;

		this.$m_uniformLocations = new Map();
		for(let uniform of uniforms) {
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
			console.error("ERROR Linking Shader Program " + gl.getProgramInfoLog(this.$m_program));
	}

	/* @param {GL_Shader_Program, String} */
	$compileShader(type, shaderCode) {
		const gl = this.$m_gl;

		const shader = gl.createShader(type);
		gl.shaderSource(shader, shaderCode);

		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
			console.error("ERROR Compiling Shader " + gl.getShaderInfoLog(shader));

		return shader;
	}
}
