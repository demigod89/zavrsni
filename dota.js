var bignumber = require('bignumber.js');
var Client = require('node-rest-client').Client;
var client = new Client();
var async = require('async');
var baza =  require ('./baza.js');

var host = 'http://api.steampowered.com/'
var key = 'xxxxxxxxxxxxxxxxxxxxxxxxx'
var host1 = 'https://api.opendota.com/api/players/'


var player = null;
var heroji;
exports.heroji = heroji;


var getAccId = function (account_id) {
	return new bignumber(account_id).minus('76561197960265728') - 0;
}

exports.getAccId = getAccId

var getMatchHistory = function (account_id, callback) {
	account_id = new bignumber(account_id).minus('76561197960265728') - 0;
	client.get(host + "IDOTA2Match_570/GetMatchHistory/v1?key=" + key + "&account_id=" + account_id, callback);
}



var getHeroes = function (callback) {
	client.get(host + "IEconDOTA2_570/GetHeroes/v1?key=" + key + "&language=en" , callback);

}

exports.podacimecevi = function (account_id, callback) {
	async.parallel([
		function(callback) {
			getMatchHistory(account_id, function (data, response) {
				var collection = baza.db.collection('mecevi');
				// Insert some documents
				collection.insertMany(data.result.matches, function(err, result) {
					if (err) {
						if (err.message.indexOf('duplicate key') === -1) {
							console.log(err);
						}
					}
					//Makni duplikate nakon unosa meceva
					collection.ensureIndex({match_id: 1}, {unique: true, dropDups: true});
				});
				callback(null, data);
			});
		},
		function(callback) {
			getHeroes(function (data, response) {
				callback(null, data);
			});
		}
		], function(err, results) {
			callback(err, results);
		});
};



exports.getGameItems = function (callback) {
	client.get(host + "IEconDOTA2_570/GetHeroes/v1?key=" + key + "&language=en", callback);
}



var getMatchDetails = function (match_id,callback) {
	client.get('https://api.opendota.com/api/matches/' + match_id, callback);
}

exports.getMatchDetails = getMatchDetails;

// https://api.opendota.com/api/players/{account_id}/heroes

exports.getPlayedHeroes = function (account_id, callback) {
	account_id = new bignumber(account_id).minus('76561197960265728') - 0
	client.get('https://api.opendota.com/api/players/' + account_id + '/heroes', callback);
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

var spremiDetalje = function () {
	var collection = baza.db.collection('mecevi');
	collection.find({}).toArray(function(err, mecevi) {
		if (err) {
			console.log(err);
			return;
		}
		mecevi.forEach(function(mec) {
			getMatchDetails(mec.match_id, function (data, response) {
				baza.db.collection('detalji').update({ "match_id": data.match_id }, { '$set': data }, { 'upsert': true });
			});
		});
	});
}

setTimeout(function(){ spremiDetalje(); }, 1000);

setInterval(function() {
	spremiDetalje();
}, 24*60*60*1000);
