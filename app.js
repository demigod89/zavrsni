var Dota2Api = require('dota2api');
var dota = new Dota2Api('68D4BBB60FB8A8F9C99A62145A7B6E27');

//Lets require/import the HTTP module

var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	dota.getHeroes(function (err, data) {
		console.log(data);
		res.render('pages/index', { heroji: data.heroes});
	});
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8080);
console.log('8080 is the magic port');