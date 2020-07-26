const scores = require("../db/Scores");
const sanitizer = require("../controller/sanitizeInput");

const addRecord = async (req, res, next) => {
    let name = sanitizer.sanitizeName(req, req.body.name);
    const record = await scores.createRecord(name);
    req.session.user_id = record.id;
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