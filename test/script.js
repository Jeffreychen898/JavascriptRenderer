let texture;
let transform_matrix;
let ang = 0;
let last_time;
let fps;
let drawcall = 0;
window.onload = () => {
	const config = {
		canvas: "canvas"
	};
	const renderer = $R.Create.Renderer(config);
	texture = new Texture(renderer.$m_gl, "https://i.imgur.com/oo7ZNVs.jpg?1");
	texture.load();

	transform_matrix = $R.Create.Matrix4();
	transform_matrix = $R.Apply.Rotation(transform_matrix, 0.1);
	last_time = new Date().getTime();

	animationLoop(renderer);
}

function animationLoop(renderer) {
	const current = new Date().getTime();
	//console.log(1 / ((current - last_time) / 1000));
	fps = 1 / ((current - last_time) / 1000);
	last_time = current;

	renderer.draw.image(texture, 0, 0, 400, 400, {});

	transform_matrix.identity();
	transform_matrix = $R.Apply.Translate(transform_matrix, 100, 100);
	transform_matrix = $R.Apply.Rotation(transform_matrix, ang);
	
	const rectangle_properties = {
		color: [255, 255, 0, 200],
		transformation: transform_matrix
	}

	for(let i=0;i<10000;i++)
		renderer.draw.rect(Math.random() * 400, Math.random() * 400, 5, 5, {color: [0, 255, 0, 50]});

	renderer.draw.rect(-50, -50, 100, 100, rectangle_properties);

	ang += 0.1;

	renderer.flush();
	drawcall = 0;

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
