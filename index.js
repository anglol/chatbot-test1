var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World !');
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(app.get('port'));

