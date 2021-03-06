//Lets require/import the HTTP module
var dota = require('./dota.js');
var bodyParser = require('body-parser');
var baza =  require ('./baza.js');
var url = require('url');
var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , SteamStrategy = require('passport-steam').Strategy;


var sg = require('sendgrid')('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');
var helper = require('sendgrid').mail;

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
  if (req.user) {
    var collection = baza.db.collection('igraci');
    // Insert some documents
    collection.insertOne(req.user, function(err, result) {
      if (err) {
        console.log(err);
      }
    });
  }
  res.render('pages/index', { user: req.user });
});

// about page 
app.get('/najigraniji', ensureAuthenticated, function(req, res) {
    dota.getPlayedHeroes(req.user.id, function (data, response) {
      var najigraniji = data.slice(0, 6);
      var collection = baza.db.collection('steam_power_heroji');
      // Find some documents 
      collection.find({}).toArray(function(err, heroji) {
        if (err) {
          console.log(err);
          return;
        }
        res.render('pages/najigraniji', { user: req.user, najigraniji:najigraniji, heroji:heroji });
      });
    });
});

// mec page
app.get('/mec', ensureAuthenticated, function(req, res){
  dota.podacimecevi(req.user.id, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    var accId = dota.getAccId(req.user.id);
    res.render('pages/mec', { user: req.user, mecevi: results[0], heroji: results[1], accid: accId});
  });
});

// mec detalji
app.get('/mec-detalji', ensureAuthenticated, function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var matchId = query.match;
  var match = dota.getMatchDetails(matchId, function (data, response) {
      var accId = dota.getAccId(req.user.id);
      var detail = null;
      data.players.forEach(function(player) {
        if (player.account_id === accId) {
          detail = player;
        }
      });
      res.send(JSON.stringify(detail));
  });
});

//heroji page
app.get('/heroji', function(req, res) {
  // Get the documents collection 
  var collection = baza.db.collection('heroji');
  // Find some documents 
  collection.find({}).toArray(function(err, heroji) {
    if (err) {
      console.log(err);
      return;
    }
    res.render('pages/heroji', {user: req.user, heroji: heroji}); 
  });																																																																																				
});

//rekordi page
app.get('/rekordi', ensureAuthenticated, function(req, res){
    var collection = baza.db.collection('rekordi');
    // Find some documents 
    collection.find({}).sort({_id:-1}).limit(1).toArray(function(err, rekordi) {
      if (err) {
        console.log(err);
        return;
      }
      var accId = dota.getAccId(req.user.id);
      var collection = baza.db.collection('detalji');
      collection.aggregate([
          { "$unwind": "$players" },  
          { "$match": { "players.account_id": accId } },                                                                                                                                                                        
          { "$group": {
              "_id": "$players.account_id",
              "kills": { "$avg": "$players.kills" },
              "deaths": { "$avg": "$players.deaths" },
          }},
      ]).toArray(function(err, opcenito) {
        collection.count(function(error, broj) {
          collection.mapReduce( 
            function() {
              emit(this.radiant_win, this.duration);
            },
            function(key, values) {
              return Math.max.apply(Math, values) / 3600;
            },
            {
                query:{ "players": {
                    $elemMatch: {
                      "account_id": accId,
                    }
                  }
                },
                // sort: {'count': -1},
                // limit: 10,
                // jsMode: true,
                // verbose: false,
                out: { inline: 1 }
            },
            function(err, results) {
              var max = results[1].value;
              if (results[0].value > results[1].value) {
                max = results[0].value;
              }
              if (rekordi.length === 0) {
                dota.insertRecords(req.user.id, function (rekordi) {
                  res.render('pages/rekordi', { user: req.user, rekordi: rekordi[0], opcenito: opcenito[0], broj:broj, max:max  }); 
                });
              } else {
                res.render('pages/rekordi', { user: req.user, rekordi: rekordi[0], opcenito: opcenito[0], broj:broj, max:max }); 
              }
            }
          );
        });
      });
    }); 
});

//kontakt
app.get('/kontakt', function(req, res) {																																																																																																																																				
    res.render('pages/kontakt', { user: req.user, success: true, response: false, description: ''  });
  });



 app.post('/kontakt', function(req, res) {

    var name = req.body.name
        email= req.body.email
        msg= req.body.message;
        all= email+ ' : ' + msg ;

    var from_email = new helper.Email('drazen.strbad89@gmail.com');
    var to_email = new helper.Email('drazen.strbad89@gmail.com');
    var subject = name;
    var content = new helper.Content('text/plain', all);
    var mail = new helper.Mail(from_email, subject, to_email, content);


    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
      if(!error){
          res.render('pages/kontakt', {
            user: req.user,
            success: true,
            response: true,
            description:'Poruka poslana! Kontaktirat ćemo Vas uskoro.'
          });
      } else {
        res.render('pages/kontakt', {
          user: req.user,
          success: false,
          response: true,
          description: 'Poruka nije poslana! Molimo pokušajte ponovo.'
        });
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
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