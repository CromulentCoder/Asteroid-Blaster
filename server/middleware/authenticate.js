// Check for users with valid session
const sessionChecker = (req, res, next) => {
    if (!req.session.user_id) {
        res.cookie("user_id", "", { expires: new Date(Number(new Date()) - 1000)});
        res.redirect("/");
    } else {
        next();
    }
};

const cacheClear = (req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
};

module.exports = {sessionChecker, cacheClear};
