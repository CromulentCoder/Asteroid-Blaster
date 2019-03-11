/* NODEJS SERVER FILE

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import the modules
const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const logger = require("morgan");

const pug = require("pug");

const db = require('./highscore');
const sequelize = db.sequelize;
const Scores = db.Scores;

// Instantiate app
const app = express();

// Set view engine as pug
app.set("view engine", "pug");
app.set('views','./public/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(logger("dev"));

app.use(express.static("public"));

// Default route
app.route("/")
    .get((req,res,next) => {
        // Send welcome page/form
        res.sendFile(__dirname + "/public/index.html");
    })
    .post((req,res,next) => {
        let name = req.body.name;
        if (name == "") {
            name = "Anonymous";
        }
        // If new user create record
        if (req.cookies.user_id == undefined ){
            Scores.create({
                name: name,
                score: 0
            }).then(record => {
                res.cookie("user_id",record.id, {maxAge: 1000 * 60 * 60});
                // Query top 10 scores
                Scores.findAll({
                    order: [["score", "DESC"],["name", "ASC"]],
                    attributes: ["name", "score"],
                    limit: 10
                }).then(results => {
                    // Render game
                    res.render("game",{
                        "results": JSON.stringify(results)
                    });
                }).catch(err => {
                    console.log(`ERROR ${err}`);
                });
            }).catch(err => {
                console.log(`ERROR ${err}`);
            });
        } else { // Render without creating record
            Scores.findAll({
                order: [["score", "DESC"],["name", "ASC"]],
                attributes: ["name", "score"],
                limit: 10
            }).then(results => {
                res.render("game",{
                    "results": JSON.stringify(results)
                });
            }).catch(err => {
                console.log(`ERROR ${err}`);
            });
        }
    });

// Fetch API endpoints

// Fetch("GET")
app.get("/sendData", (req,res,next) => {
    Scores.findAll({
        order: [["score", "DESC"],["name", "ASC"]],
        attributes: ["name", "score"],
        limit: 10
    }).then(results => {
        let data = JSON.stringify(results);
        res.send(data);
    }).catch(err => {
        console.log(`ERROR ${err}`);
    });
});

// Fetch("POST")
app.post("/updateTable", (req,res,next) => {
    Scores.update(
        {
            score:req.body.score
        },
        {
            where:{
                    id: req.cookies.user_id
                }
            },
    ).then(count => {
        console.log(count)
        res.send(count);
    })
    .catch(err => {
        console.log(`ERROR ${err}`);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});