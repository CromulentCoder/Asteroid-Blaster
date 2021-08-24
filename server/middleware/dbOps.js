const scores = require("../db/Scores");
const sanitizer = require("../controller/sanitizeInput");

const addRecord = (req, res, next) => {
    console.log("In addrecord");
    let name = sanitizer.sanitizeName(req, req.body.name);
    console.log("Sanitized name");
    scores.createRecord(name).then( record =>
        req.session.user_id = record.id
    )
    console.log("Moving to next");
    next();
}

const getHighScores = async (req,res,next) => {
    if (req.session.user_id) {
        const records = await scores.getHighScores();
        res.send(JSON.stringify(records));
    } 
    next();
}

module.exports = {addRecord, getHighScores};