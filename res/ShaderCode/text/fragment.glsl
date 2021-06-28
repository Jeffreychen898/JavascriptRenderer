precision mediump float;

varying vec2 v_texCoord;
varying vec4 v_color;

uniform sampler2D u_texture;

void main() {
    gl_FragColor = v_color * vec4(vec3(1.0), texture2D(u_texture, v_texCoord).a); 
}