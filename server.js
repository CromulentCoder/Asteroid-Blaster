const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', (req,res,next) => {
    res.sendFile('public/index.html');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});