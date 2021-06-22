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
