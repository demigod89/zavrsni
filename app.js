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

// mec page
app.get('/mec', function(req, res) {																																																																																																																																					
    res.render('pages/mec');
});

//heroji page
app.get('/heroji', function(req, res) {																																																																																																																																					
    res.render('pages/heroji');
});

//rekordi page
app.get('/rekordi', function(req, res) {																																																																																																																																					
    res.render('pages/rekordi');
});
//snimke
app.get('/snimke', function(req, res) {																																																																																																																																					
    res.render('pages/snimke');
});

//kontakt
app.get('/kontakt', function(req, res) {																																																																																																																																					
    res.render('pages/kontakt');
});

//skini
app.get('/skini', function(req, res) {																																																																																																																																					
    res.render('pages/skini');
});


app.listen(3000);
console.log('The magic port is 3000');