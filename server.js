/* NODEJS SERVER FILE

Made by Cromulent Coder (https://github.com/CromulentCoder)

*/

// Import the necessary modules
const express = require("express");

const bodyParser = require("body-parser");
const expressSanitizer = require('express-sanitizer');
const logger = require("morgan");

// Secret for the session
const secretJSON = require("./secret.json");
// Create session
const session = require("express-session")({
    key: "user_id",
    secret: secretJSON["secret"],
    resave: true,
    saveUninitialized: true,
});
// Create socket + express session
const sharedsession = require("express-socket.io-session");

// Template engine
const pug = require("pug");

// Database model
const Sequelize = require("sequelize");
const db = require("./highscore");
const Scores = db.Scores;

// Socket
const socket = require('socket.io');

// Instantiate app
const app = express();

// Set view engine as pug
app.set("view engine", "pug");
app.set('views','./public/views');

// Mount middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(logger("dev"));
app.use(session);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
})

// Socket
let io = socket(server);

io.use(sharedsession(session, {
    autoSave: true
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
        let name = req.sanitize(req.body.name);
        let pattern = /^[\x20-\x7E]*$/;
        if (!pattern.test(name)) {
            name = "";
        }
        if (name == "" || name == undefined) {
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
            console.error(`ERROR ${err}`);
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
        }).then(records => {
        // Render game
            res.render("game",{
                "results": JSON.stringify(records)
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
    }).then(records => {
        let data = JSON.stringify(records);
        res.send(data);
    }).catch(err => {
        console.log(`ERROR ${err}`);
    });
});

// Fetch("POST")
// app.post("/updateTable", (req,res,next) => {
//     const Op = Sequelize.Op;
//     Scores.update(
//         {
//             score:req.body.score
//         },
//         {
//             where:{
//                     id: req.session.user_id,
//                     score : {
//                         [Op.lt]: req.body.score
//                     }
//                 }
//             },
//     ).then(count => {
//         res.send(count);
//     })
//     .catch(err => {
//         console.log(`ERROR ${err}`);
//     });
// });

io.on("connection",
    (client) => {
        let warning = 0;
        let score = 0;
        if (client.handshake.session.user_id != undefined) {
            console.log(`A new client joined: ${client.id}`);

            client.emit("start",{"score":0})

            client.on("updateScore", (data) => {
                console.log(`Data received: ${data.score}\n Previous score: ${score}`);
                if (data.score - score <= 1000) {
                    score = data.score;
                    let Op = Sequelize.Op;
                    Scores.update({
                            score: score
                        },
                        {
                            where:{
                                id: client.handshake.session.user_id,
                                score : {
                                    [Op.lt]: score
                                }
                            }
                        },
                    ).catch(err => {
                        console.error(err);
                    });
                } else {
                    warning++;
                    console.log(`FOUND CHEATING! WARNING NUMBER ${warning}`);
                }
                if (warning >= 3) {
                    console.log("No cheating! :)");
                    client.handshake.session.user_id = undefined;
                    client.handshake.session.user = undefined;
                    client.disconnect();
                }
            })
            // When user disconnects
            client.on("disconnect", () => console.log("Client has disconnected:", client.id));
        }
    }
);