const sanitize = require("express-sanitizer");

const sanitizeName = (req, input) => {
    input = req.sanitize(input);
    let pattern = /^[\x20-\x7E]*$/;
    if (!pattern.test(input)) {
        input = "";
    }
    if (input == "" || input == undefined) {
        input = "Anonymous";
    }
    return input;
}

module.exports = {sanitizeName};