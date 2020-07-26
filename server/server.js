/* NODEJS SERVER FILE

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import the necessary modules
const express = require("express");
const http = require("http");
const logger = require("morgan");
const pug = require("pug");

const ENV = require("../config").ENV;
const VIEW_PATH = require("../config").VIEW_PATH;
const PORT = require("../config").PORT;
const router = require("./routes/routes").router;

const app = express();
// Set view engine as pug
app.set("view engine", "pug");
app.set('views', VIEW_PATH);

if (ENV) app.use(logger("combined"));
else app.use(logger("dev"));

app.use("/", router);

const server = http.Server(app);
server.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
})

module.exports = {server};



