const lineReader = require("line-reader");
const express = require("express");
const app = express();

const PORT = 8080 || process.env.PORT;

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
