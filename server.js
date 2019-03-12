/* NODEJS SERVER FILE

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import the necessary modules
const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");

// Template engine
const pug = require("pug");

// Secret for the session
const secretJSON = require("./secret.json");

// Database model
const Sequelize = require("sequelize");
const db = require("./highscore");
const Scores = db.Scores;

// Instantiate app
const app = express();

// Set view engine as pug
app.set("view engine", "pug");
app.set('views','./public/views');

// Instantiate utility modules
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(logger("dev"));

app.use(session({
    key: "user_id",
    secret: secretJSON["secret"],
    resave: false,
    saveUninitialized: false,
    })
);

// Check if session cookie is still saved in browser and user is not set, then automatically log the user out.
app.use((req, res, next) => {
    if (req.session.user == undefined || req.session.user_id == undefined) {
      res.cookie("user_id", "", { expires: new Date()});      
    }
    next();
  });


// Check for users with valid session
const sessionChecker = (req, res, next) => {
    if (req.session.user && req.session.user_id) {
        
        res.redirect("/game");
    } else {
        next();
    }    
  };

app.use(express.static("public"));

// Default route
app.route("/")
    .get(sessionChecker, (req,res,next) => {
        // Send welcome page/form
        res.sendFile(__dirname + "/public/form.html");
    })
    .post(sessionChecker, (req,res,next) => {
        let name = req.body.name;
        if (name == "") {
            name = "Anonymous";
        }
        // Create new record
        Scores.create({
            name: name,
            score: 0
        }).then(record => {
            req.session.user = record.name;
            req.session.user_id = record.id;
            res.redirect("/game");
        }).catch(err => {
            console.log(`ERROR ${err}`);
        });
    });

// Game route
app.get("/game", (req,res) => {
    if (req.session.user && req.session.user_id) { // Check if valid session
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
        })
    } else {
        res.redirect("/");
    };
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
    const Op = Sequelize.Op
    Scores.update(
        {
            score:req.body.score
        },
        {
            where:{
                    id: req.session.user_id,
                    score : {
                        [Op.lt]: req.body.score
                    }
                }
            },
    ).then(count => {
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