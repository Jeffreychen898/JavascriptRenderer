const $ShaderCode = {
	//default shader <=================================
	default: {
		vert: `
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
		`,
		frag: `
			precision mediump float;

			varying vec3 v_color;
			varying vec2 v_texCoord;

			uniform sampler2D u_texture;

			void main() {
				gl_FragColor = texture2D(u_texture, v_texCoord) * vec4(v_color, 1.0);
			}
		`
	}
}
