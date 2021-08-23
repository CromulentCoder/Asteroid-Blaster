const express = require("express");
const expressSanitizer = require('express-sanitizer');
const bodyParser = require("body-parser");
const path = require("path");

const ENV = require("../../config").ENV;
const session = require("../controller/session");
const sessionChecker = require("../middleware/authenticate").sessionChecker;
const cacheClear = require("../middleware/authenticate").cacheClear;
const addRecord = require("../middleware/dbOps").addRecord;

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressSanitizer());
router.use(express.static(path.resolve("public")));

const sess = session.session;
router.use(sess);

// Default route
router.route("/", cacheClear)
    .get((req,res,next) => {
        console.log("Sending welcome screen");
        res.sendFile(path.resolve("public/form.html"));
    })
    .post(addRecord, (req,res) => {
        console.log("Post received, record added");
        res.redirect("/game");
    });

// Game route
router.get("/game", cacheClear, sessionChecker, (req,res) => {
    res.render("game");
    require("../sockets/initializeSocket")(sess);
});

// Fetch("GET")
router.get("/getSocketUrl", (req, res) => {
    let connUrl = ""
    if (ENV) connUrl = "https://asteroid-blaster.herokuapp.com/";
    else connUrl = "localhost:3000";
    res.send(connUrl);
});

module.exports = {router, sess};