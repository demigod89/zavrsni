var bignumber = require('bignumber.js');
var Client = require('node-rest-client').Client;
var client = new Client();
var async = require('async');
var baza =  require ('./baza.js');

var host = 'http://api.steampowered.com/'
var key = '68D4BBB60FB8A8F9C99A62145A7B6E27'
var slikeitem = 'http://cdn.dota2.com/apps/dota2/images/items/'
var host1 = 'https://api.opendota.com/api/players/'


var player = null;
var heroji;
exports.heroji = heroji;

// http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1?key=68D4BBB60FB8A8F9C99A62145A7B6E27&account_id=208648896 

var getMatchHistory = function (account_id, callback) {
	account_id = new bignumber(account_id).minus('76561197960265728') - 0
	client.get(host + "IDOTA2Match_570/GetMatchHistory/v1?key=" + key + "&account_id=" + account_id, callback);
}

// http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=68D4BBB60FB8A8F9C99A62145A7B6E27&language=en

var getHeroes = function (callback) {
	client.get(host + "IEconDOTA2_570/GetHeroes/v1?key=" + key + "&language=en" , callback);

}

exports.podacimecevi = function (account_id) {
	async.parallel([
	    function(callback) {
	        getMatchHistory(account_id, function (data, response) {
			    callback(null, data);
			});
	    },
	    function(callback) {
	        getHeroes(function (data, response) {
			    callback(null, data);
			});
	    }
	], function(err, results) {
	    console.log(results[0].result.matches);
	    heroji = results[1].result.heroes;
	    console.log (heroji);
	});
};

// http://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1?key=68D4BBB60FB8A8F9C99A62145A7B6E27&language=en

exports.getGameItems = function (callback) {
	client.get(host + "IEconDOTA2_570/GetHeroes/v1?key=" + key + "&language=en", callback);
}

// http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1?key=68D4BBB60FB8A8F9C99A62145A7B6E27&match_id=2622697116

exports.getMatchDetails = function (match_id,callback) {
	client.get(host + "IDOTA2Match_570/GetMatchDetails/v1?key=" + key + "&language=en&match_id=" + match_id,callback);
}

// https://api.opendota.com/api/players/{account_id}/heroes

exports.getPlayedHeroes = function (account_id, callback) {
	account_id = new bignumber(account_id).minus('76561197960265728') - 0
	client.get(host1 + account_id + '/heroes', callback);
}

// https://api.opendota.com/api/players/{account_id}/wl

exports.getWinLose = function (account_id,callback) {
	account_id = new bignumber(account_id).minus('76561197960265728') - 0
	client.get(host1 + account_id + '/wl', callback);
}

// https://api.opendota.com/api/players/{account_id}/records

var getDotaRecords = function (account_id, callback) {
	account_id = new bignumber(account_id).minus('76561197960265728') - 0
	console.log(account_id);
	client.get(host1 + account_id + '/records', callback);
}

var rekordi = function (account_id, finalCallback) {

	async.parallel([
	    function(callback) {
	        getDotaRecords(account_id, function (data, response) {

				callback(null, data);
			});
	    },
	    function(callback) {
		  var collection = baza.db.collection('steam_power_heroji');
		  // Find some documents 
		  collection.find({}).toArray(function(err, heroji) {
		    if (err) {
		      console.log(err);
		      return;
		    }
		    callback(null, heroji);
		  });
	    },
	], function(err, results) {
		finalCallback(err, results);
	});

};

exports.insertRecords = function(account_id, callback) {
  rekordi(account_id, function(err, results) {
    results[1].forEach(function(entry) {
      if (results[0].kills.hero_id === entry.id) {
        results[0].kills.hero = entry.localized_name;
        results[0].kills.img = entry.localized_name.toLowerCase().split(' ').join('_') + '_full.png';
      }
      if (results[0].assists.hero_id === entry.id) {
        results[0].assists.hero = entry.localized_name;
        results[0].assists.img = entry.localized_name.toLowerCase().split(' ').join('_') + '_full.png';
      }
      if (results[0].kda.hero_id === entry.id) {
        results[0].kda.hero = entry.localized_name;
        results[0].kda.img = entry.localized_name.toLowerCase().split(' ').join('_') + '_full.png';
      }
      if (results[0].gold_per_min.hero_id === entry.id) {
        results[0].gold_per_min.hero = entry.localized_name;
        results[0].gold_per_min.img = entry.localized_name.toLowerCase().split(' ').join('_') + '_full.png';
      }
      if (results[0].last_hits.hero_id === entry.id) {
        results[0].last_hits.hero = entry.localized_name;
        results[0].last_hits.img = entry.localized_name.toLowerCase().split(' ').join('_') + '_full.png';
      }
      if (results[0].denies.hero_id === entry.id) {
        results[0].denies.hero = entry.localized_name;
        results[0].denies.img = entry.localized_name.toLowerCase().split(' ').join('_') + '_full.png';
      }
    });
    results[0].igrac = account_id;
	var collection = baza.db.collection('rekordi');
	// Insert some documents
	collection.insertOne(results[0], function(err, result) {
		if (err) {
			console.log(err);
		}
		callback(results);
	});
  });	
}