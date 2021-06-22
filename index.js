const fs = require("fs");
const lineReader = require("line-reader");
const express = require("express");
const app = express();

const PORT = 8080 || process.env.PORT;
const VERSION = 2;

const paths = [];
const shaderList = [];

app.listen(PORT, () => {
	console.log(`PORT: ${PORT}`);

	lineReader.eachLine("test/includes.txt", (line) => {
		paths.push(line);
		if(line.includes("main.js"))
			console.log(`${paths.length} javascript files found!`);
	});

	lineReader.eachLine("res/list.txt", (line) => {
		if(line.includes("END")) {
			console.log("finished loading res/list.txt");
		} else
			shaderList.push(line);
	});
});

app.set("view engine", "ejs");

app.use("/test", express.static("test"));
app.use("/res", express.static("res"));
app.use("/renderer", express.static("renderer"));

app.get("/", (req, res) => {
	res.render("index.ejs", {
		library: paths
	});
});

app.get("/shaderlist", (req, res) => {
	res.send(shaderList);
});

app.get("/condense", async (req, res) => {
	try {
		const js_code = await condenseJSCode();
		const shader_code = await loadShaderCode();
		const result = shader_code + js_code;
		const filename = "RendererV" + VERSION + ".js";
		fs.writeFile("library/condensed/" + filename, result, (err) => {
			if(err)
				res.send(err);
			else {
				console.log("successfuly written file " + filename);
				res.send("successfully minifed version " + VERSION);
			}
		});
	} catch(err) {
		res.send(err);
	}
});

async function loadShaderCode() {
	return new Promise((resolve, reject) => {
		let javascript = `const $ShaderCode = new Map();`;
		let shaders_loaded = 0;
		try {
			for(let i=0;i<shaderList.length;i++) {
				loadEachShader(shaderList[i], (sourceCode) => {
					javascript += "\n$ShaderCode.set(\"" + shaderList[i] + "\", " + sourceCode + ");\n";
					if(++shaders_loaded == shaderList.length)
						resolve(javascript + "\n");
				});
			}
		} catch(err) {
			reject(err);
		}
	});
}

async function loadEachShader(shader, callback) {
	return new Promise((resolve, reject) => {
		const vertex_path = "res/ShaderCode/" + shader + "/vertex.glsl";
		const fragment_path = "res/ShaderCode/" + shader + "/fragment.glsl";
		let vertex_code = "";
		let fragment_code = "";
		fs.readFile(vertex_path, "utf8", (err, data) => {
			console.log("reading shader /" + vertex_path);

			if(err)
				reject(err);
			else {
				vertex_code = data;
				if(fragment_code.length > 0) {
					const result = `{\nvert:\`\n${vertex_code}\`,\nfrag:\`\n${fragment_code}\`}`;
					callback(result);
					resolve();
				}
			}
		});

		fs.readFile(fragment_path, "utf8", (err, data) => {
			console.log("reading shader /" + fragment_path);

			if(err)
				reject(err)
			else {
				fragment_code = data;
				if(vertex_code.length > 0) {
					const result = `{\nvert:\`\n${vertex_code}\`,\nfrag:\`\n${fragment_code}\`}`;
					callback(result);
					resolve();
				}
			}
		});
	});
}

async function condenseJSCode() {
	return new Promise((resolve, reject) => {
		let tracker = 0;
		let source_code = new Array(paths.length);
		for(let i=0;i<paths.length;i++) {
			const path = paths[i];

			fs.readFile(path, "utf8", (err, data) => {
				console.log(`reading /${path}`);

				if(err)
					reject(err);
				else {
					console.log(`successfully read /${path}`);
					source_code[i] = data;
				}
				if(++tracker == paths.length) {
					resolve(source_code.join(""));
				}
			});

		}
	});
}
