attribute vec3 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_color;

varying vec2 v_texCoord;
varying vec4 v_color;

uniform mat4 u_projection;

void main() {
    v_texCoord = a_texCoord;
    v_color = a_color;
    gl_Position = u_projection * vec4(a_position, 1.0);
}