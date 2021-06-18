const fs = require("fs");
const lineReader = require("line-reader");
const express = require("express");
const app = express();

const PORT = 8080 || process.env.PORT;
const VERSION = 1;

const paths = [];

app.listen(PORT, () => {
	console.log(`PORT: ${PORT}`);

	lineReader.eachLine("test/includes.txt", (line) => {
		paths.push(line);
		if(line.includes("main.js"))
			console.log(`${paths.length} javascript files found!`);
	});
});

app.set("view engine", "ejs");

app.use("/test", express.static("test"));
app.use("/renderer", express.static("renderer"));

app.get("/", (req, res) => {
	res.render("index.ejs", {
		library: paths
	});
});

app.get("/condense", async (req, res) => {
	try {
		const result = await condenseJSCode();
		const filename = "RendererV" + VERSION + ".js";
		fs.writeFile("library/condensed/" + filename, result, (err) => {
			if(err)
				res.send(err);
			else
				res.send("successfully minifed version " + VERSION);
		});
	} catch(err) {
		res.send(err);
	}
});

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
