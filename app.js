//Lets require/import the HTTP module
var dota = require('./dota.js');
var bodyParser = require('body-parser');
var url = require('url');
var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , SteamStrategy = require('passport-steam').Strategy;


  

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '68D4BBB60FB8A8F9C99A62145A7B6E27'
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

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
    secret: 'your secret',
    name: 'name of session id',
    resave: true,
    saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
  res.render('pages/index', { user: req.user });
});

// about page 
app.get('/about', function(req, res) {																																																																																																																																					
    res.render('pages/about', { user: req.user });
});

// mec page
app.get('/mec', ensureAuthenticated, function(req, res){
  dota.podacimecevi(req.user.id);
  res.render('pages/mec', { user: req.user});
});

// mec detalji
app.get('/mec-detalji', ensureAuthenticated, function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var matchId = query.match;
  var match = dota.getMatchDetails(matchId, function (data, response) {
      console.log(data);
      res.render('pages/mec', { user: req.user});
  });
});

//heroji page
app.get('/heroji', function(req, res) {
  res.render('pages/heroji', {user: req.user}); 																																																																																							
});

//rekordi page
app.get('/rekordi', ensureAuthenticated, function(req, res){																																																																																																																																					
    res.render('pages/rekordi', { user: req.user });
});
//snimke
app.get('/snimke', ensureAuthenticated, function(req, res){ 																																																																																																																																				
    res.render('pages/snimke', { user: req.user });
});

//kontakt
app.get('/kontakt', function(req, res) {																																																																																																																																					
    res.render('pages/kontakt', { user: req.user });
});

//skini
app.get('/skini', ensureAuthenticated, function(req, res){ 																																																																																																																																				
    res.render('pages/skini', { user: req.user });
});

app.get('/login', function(req, res) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
    res.render('pages/login');
});

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', ensureAuthenticated, function(req, res){ 
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

app.listen(3000);
console.log('The magic port is 3000');