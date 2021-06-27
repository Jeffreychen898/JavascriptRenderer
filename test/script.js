const vert = `
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

let renderer;

let a = 0;
let frameBuffer;
let last_time;

let shader;

let mat;
let def;

let font;
let fontloaded = false;

function onWindowResize() {
	renderer.resizeCanvas(window.innerWidth, window.innerHeight);
}

function everythingLoaded() {
	const config = {
		canvas: "canvas",
		canvasWidth: 400,
		canvasHeight: 400
	};
	renderer = $R.Create.Renderer(config);

	font = new $Renderer_Font(renderer.$m_gl, "/res/arial.ttf");
	font.loadFont(() => {
		fontloaded = true;
	});

	frameBuffer = renderer.create.textureBuffer(100, 100);

	const attribs = [
		{
			name: "a_position",
			size: 3
		}
	];
	mat = $R.Create.Camera2D(0, 100, 0, 100);
	def = $R.Create.Camera2D(0, 400, 0, 400);
	//shader = renderer.create.shader(vert, frag, attribs, [{name: "u_projection", type: Renderer.Uniform.Matrix4}]);
	//shader.setUniform("u_projection", matrix.matrix);
	window.addEventListener("resize", onWindowResize);
	
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
	renderer.draw.rect((a/4) % 100, 40, 20, 20, {color: [255, 255, 0], textureBuffer: frameBuffer});

	//renderer.draw.shader(shader, 100, 150, 100, 100, [], {textureBuffer: frameBuffer});
	renderer.draw.rect(a % 400, 100, 100, 100, properties);
	renderer.draw.image(frameBuffer, 0, 0, 100, 100);
	a += 5;

	const shape = renderer.create.shape({color: [0, 150, 0]});
	renderer.draw.vertex(shape, {x: 100, y: 100});
	renderer.draw.vertex(shape, {x: 200, y: 100});
	renderer.draw.vertex(shape, {x: 150, y: 200});
	renderer.draw.shape(shape);

	if(fontloaded)
		renderer.draw.text(font, "Hello World!", 100, 100, {fontSize: 48});

	renderer.flush();

	requestAnimationFrame(() => {
		animationLoop(renderer);
	});
}

/*let texture;
let transform_matrix;
let ang = 0;
let last_time;
let fps;
let camera;
function everythingLoaded() {
	const config = {
		canvas: "canvas",
		canvasWidth: 400,
		canvasHeight: 400
	};
	const renderer = $R.Create.Renderer(config);

	texture = renderer.create.texture("https://i.imgur.com/oo7ZNVs.jpg?1");

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

	for(let i=0;i<10000;i++)
		renderer.draw.rect(Math.random() * 400, Math.random() * 400, 5, 5, {color: [0, 255, 0, 100]});

	renderer.draw.rect(-50, -50, 100, 100, rectangle_properties);

	ang += 0.1;

	renderer.flush();
	//console.log(drawcall);
	drawcall = 0;

	requestAnimationFrame(() => {
		animationLoop(renderer)
	});
}*/

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
