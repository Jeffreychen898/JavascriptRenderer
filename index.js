const express = require("express");
const app = express();

const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
	console.log(PORT);
});

app.use("/", express.static("test"));
app.use("/renderer", express.static("renderer"));
