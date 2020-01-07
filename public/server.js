let express = require('express');
let server = express();
const path = require('path');

server.use(express.static(path.join(__dirname)));

server.get('/auth', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'pages/auth.html'));
});

server.get('/menu', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'pages/menu.html'));
});

server.get('/game', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'pages/game.html'));
});

server.listen(3000, function () {
    console.log('Listening on port 3000!');
});