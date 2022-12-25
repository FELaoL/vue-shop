const express = require("express");
const compression = require("compression");
const https = require("https");
const fs = require("fs");

const options = {
	cert: fs.readFileSync("./full_chain.pem"),
	key: fs.readFileSync("./private.key")
};

const app = express();
// 一定要把这一行代码，写到静态资源托管之前
app.use(compression());
app.use(express.static("../front/dist"));

// app.listen(8081, () => {
// 	console.log("Web server running at http://127.0.0.1");
// });
https.createServer(options, app).listen(443);
