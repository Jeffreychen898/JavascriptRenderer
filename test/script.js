const vert2 = `
attribute vec2 pos;
attribute vec3 a_col;

uniform mat4 proj;

varying vec3 v_col;

void main() {
	v_col = a_col;
	gl_Position = proj * vec4(pos, 0.0, 1.0);
}
`;
const frag2 = `
precision mediump float;

varying vec3 v_col;

void main() {
	gl_FragColor = vec4(v_col, 1.0);
}
`;
window.onload = () => {
	const config = {
		canvas: "canvas"
	};
	const renderer = $R.Create.Renderer(config);
	const texture = new Texture(renderer.$m_gl, "https://i.imgur.com/oo7ZNVs.jpg?1");
	texture.load();

	animationLoop(renderer);
}

function animationLoop(renderer) {
	renderer.draw.rect(0, 0, 400, 400, {color: [0, 0, 0]});
	renderer.draw.rect(100, 100, 100, 100, {color: [1, 1, 0]});

	requestAnimationFrame(() => {
		animationLoop(renderer)
	});
}

/*
const config = {
	canvas: "canvID",
};
const renderer = new JSRenderer(config);

const parameters = [
	{string: "", size: 4}
]
const shaderProgram = new Shader(vert, frag, parameters);

const data = [
	{"property", [val, val, val]},
	{"property2", [val, val, val]}
]
const vertices_data = [
	new VertexData([data]),
	new VertexData([data])
]
const rect_shader_setting = [
	position_name: "vert_pos",
	same: [//applies to all vertices
		"property": [val, val, val],
		"property2": [val, val]
	],
	different: [
		//vertex one
		[
			{"property", [val, val, val]},
			{"property2", [val, val, val]}
		]
	]
]
renderer.shader.rect(x, y, w, h, rect_shader_setting);

const shader_setting = [
	same: [
	],
	different: [
	]
]
renderer.shader.render(x, y, w, h, shader_setting);

const settings = {
	color: ...
	align: ...
}
renderer.draw.rect(x, y, w, h, settings);
*/
