const express = require("express");
const app = express();

const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
	console.log(PORT);
});

app.get("/", express.static("test"));
app.get("/renderer", express.static("renderer"));
