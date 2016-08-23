var Dota2Api = require('dota2api');
var dota = new Dota2Api('68D4BBB60FB8A8F9C99A62145A7B6E27');
var bignumber = require('bignumber.js');

exports.getHeros = function (callback) {
	dota.getHeroes(function (err, data) {
		if (err != null) {
			callback(err, null)
			return;
		}
		callback(null, data)
	});
}

exports.getSteamAccId = function (steamId) {
	return new bignumber(steamId).minus('76561197960265728') - 0;
}     

