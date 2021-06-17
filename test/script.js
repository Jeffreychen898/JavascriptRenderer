/*const vert = `
attribute vec3 a_position;

uniform mat4 u_projection;

void main() {
	gl_Position = u_projection * vec4(a_position.xy, -0.5, 1.0);
}
`;

const frag = `
precision mediump float;

void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

let a = 0;
let frameBuffer;
let last_time;

let shader;
window.onload = () => {
	const config = {
		canvas: "canvas",
		canvasWidth: 400,
		canvasHeight: 400
	};
	const renderer = $R.Create.Renderer(config);

	frameBuffer = renderer.createTextureBuffer(400, 400);

	const attribs = [
		{
			name: "a_position",
			size: 3
		}
	];
	const matrix = $Renderer_Camera2D(0, 400, 0, 400);
	shader = renderer.createShader(vert, frag, attribs, [{name: "u_projection", type: Renderer.Uniform.Matrix4}]);
	shader.setUniform("u_projection", matrix.matrix);
	
	last_time = new Date().getTime();
	animationLoop(renderer);
}

function animationLoop(renderer) {
	const current = new Date().getTime();
	//console.log(1 / ((current - last_time) / 1000));
	fps = 1 / ((current - last_time) / 1000);
	last_time = current;

	const properties = {
		color: [255, 0, 255]
	};
	renderer.draw.rect(0, 0, 400, 400, {color: [0], textureBuffer: frameBuffer});
	renderer.draw.rect(a % 400, 100, 100, 100, {color: [255, 255, 0], textureBuffer: frameBuffer});

	//renderer.draw.shader(shader, 100, 150, 100, 100, [], {textureBuffer: frameBuffer});
	renderer.draw.rect(a % 400, 100, 100, 100, properties);
	renderer.draw.image(frameBuffer, 0, 0, 100, 100);
	a += 5;

	renderer.flush();

	requestAnimationFrame(() => {
		animationLoop(renderer);
	});
}*/

let texture;
let transform_matrix;
let ang = 0;
let last_time;
let fps;
let drawcall = 0;
let camera;
window.onload = () => {
	const config = {
		canvas: "canvas",
		canvasWidth: 400,
		canvasHeight: 400
	};
	const renderer = $R.Create.Renderer(config);
	texture = new Texture(renderer.$m_gl, "https://i.imgur.com/oo7ZNVs.jpg?1");
	texture.load();

	transform_matrix = $R.Create.Matrix4();
	transform_matrix = $R.Apply.Rotation(transform_matrix, 0.1);
	last_time = new Date().getTime();

	camera = $R.Create.Camera2D(0, 400, 0, 400);

	document.addEventListener("keydown", (e) => {
		if(e.keyCode == 38) {
			camera = $R.Create.Camera2D(0, 800, 0, 800);
		} else if(e.keyCode == 40) {
			camera = $R.Create.Camera2D(0, 400, 0, 400);
		}
	})

	animationLoop(renderer);
}

function animationLoop(renderer) {
	const current = new Date().getTime();
	//console.log(1 / ((current - last_time) / 1000));
	fps = 1 / ((current - last_time) / 1000);
	last_time = current;

	//renderer.setCamera(camera);

	renderer.draw.image(texture, 0, 0, 400, 400, {});

	transform_matrix.identity();
	transform_matrix = $R.Apply.Translate(transform_matrix, 100, 100);
	transform_matrix = $R.Apply.Rotation(transform_matrix, ang);
	
	const rectangle_properties = {
		color: [255, 255, 0, 200],
		transformation: transform_matrix
	}

	//for(let i=0;i<10000;i++)
		//renderer.draw.rect(Math.random() * 400, Math.random() * 400, 5, 5, {color: [0, 255, 0, 50]});

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
