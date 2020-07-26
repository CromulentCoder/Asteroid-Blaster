const express = require("express");
const expressSanitizer = require('express-sanitizer');
const bodyParser = require("body-parser");
const path = require("path");

const session = require("../controller/session");
const sessionChecker = require("../middleware/authenticate").sessionChecker;
const cacheClear = require("../middleware/authenticate").cacheClear;
const addRecord = require("../middleware/dbOps").addRecord;
const getHighScores = require("../middleware/dbOps").getHighScores;

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
        res.sendFile(path.resolve("public/form.html"));
    })
    .post(addRecord, (req,res) => {
        res.redirect("/game");
    });

// Game route
router.get("/game", cacheClear, sessionChecker, (req,res) => {
    res.render("game");
    require("../sockets/initializeSocket")(sess);
});

// Fetch("GET")
router.get("/sendData", getHighScores);

module.exports = {router, sess};