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
app.use( (req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

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
    if (req.session.user_id == undefined) {
        res.cookie("user_id", "", { expires: new Date(Number(new Date()) - 1000)});      
    }
    next();
  });

// Check for users with valid session
const sessionChecker = (req, res, next) => {
    if (req.session.user_id) {
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
            req.session.user_id = record.id;
            res.redirect("/game");
        }).catch(err => {
            console.error(`ERROR ${err}`);
        });
    });

let hs;

// Game route
app.get("/game", (req,res) => {
    if (req.session.user_id) { // Check if valid session
        // Query top 10 scores
        res.render("game", {results: true});
        Scores.findOne({
            attributes: ["score"],
            where: {
                id: req.session.user_id
            }
        }).then(record => {
            hs = record.score;
        }).catch(err => {
            console.error(`ERROR ${err}`)
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
        console.error(`ERROR ${err}`);
    });
});

// Socket connection
io.on("connection",
    (client) => {
        // Client variables 
        let warning = 0;

        // Client highscore up till now
        let score = hs;
        
        // Date to join
        let prevTime = new Date().getTime();
        
        let Op = Sequelize.Op;
        
        if (client.handshake.session.user_id != undefined) {
            console.log(`A new client joined: ${client.id}`);
            
            // Initialize score for the client
            client.emit("setScore", {
                "score": 0,
                "highScore": hs
            });

            // Update client score
            client.on("updateScore", (data) => {
                let receivedTime = new Date().getTime();
                
                // Check difference between the two times 
                if (checkTime(prevTime, receivedTime)) {

                    // If new score is more than current high score
                    if (score < data.score){

                        // Check if it is possible to get that much score in delta time
                        if (data.score - score < 60 * (receivedTime - prevTime) / 1000) { // If true
                            score = data.score;
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
                        } else { // If not, user is cheating
                            console.log(`ID:${client.handshake.session.user_id} FOUND CHEATING! WARNING NUMBER ${++warning}`);
                        }
                    }

                    // Set prev time as last recieved time
                    prevTime = receivedTime;
                }

                // If user is cheating repeatedly delete that account
                if (warning >= 3) {
                    console.error(`Repeated Cheating! Deleting ID: ${client.handshake.session.user_id}`);
                    Scores.destroy({
                        where: {
                            id: client.handshake.session.user_id
                        }
                    }).then(count => {
                        console.log(`Deleted ${count} record(s)`);
                    }).catch(err => {
                        console.error(`Failed to delete ID ${client.handshake.session.user_id}`);
                    });
                    client.handshake.session.user_id = undefined;
                    client.disconnect();
                }
            })
            // When user disconnects
            client.on("disconnect", () => console.log("Client has disconnected:", client.id));
        }
    }
);

// Utility funciton to check difference between two times
const checkTime = (prevTime, newTime) => {
    if (newTime - prevTime >= 2800) {
        return true;
    }
    return false;
}