

//Lets require/import the HTTP module
var dota = require('./dota.js');
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	var callback = function (err, data) {
		res.render('pages/index', { heroji: data.heroes});
	}
	dota.getHeros(callback);
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8080);
console.log('8080 is the magic port');