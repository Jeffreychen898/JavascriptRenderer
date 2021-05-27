window.onload = () => {
	const config = {
		canvas: "canvas"
	};
	const renderer = $R.Create.Renderer(config);
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
