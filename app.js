//Lets require/import the HTTP module
var dota = require('./dota.js');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var Steam = require('steam');
var crypto = require("crypto")
var app = express();


// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));



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

app.get('/login', function(req, res) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    res.render('pages/login');
});

app.post('/login', function(req, res) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);
    var steamClient = new Steam.SteamClient();
    var steamUser = new Steam.SteamUser(steamClient);
    var user = null;
    steamClient.connect();
    steamClient.on('connected', function() {
        var SentryData = fs.readFileSync('sentry');
        steamUser.logOn({
            account_name: username,
            password: password,
            //auth_code: '8VKJ2',
            sha_sentryfile: SentryData,
        });
    });
    steamClient.on('logOnResponse', function(logonResp) {
        if (logonResp.eresult == Steam.EResult.OK) {
            console.log('Logged in!');
            console.log(logonResp);
            user = username;
        }
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = username;
                res.redirect('/');
            });
        } else {
            console.log('Neispravni login podaci');
            res.redirect('/login');
        }
    });
    steamUser.on('updateMachineAuth', function(response, callback){
        var hashedSentry = crypto.createHash('sha1').update(response.bytes).digest();
        fs.writeFileSync('sentry', hashedSentry)
        callback({
            sha_file: hashedSentry
        });
    });
});


app.listen(3000);
console.log('The magic port is 3000');