var Dota2Api = require('dota2api');
var dota = new Dota2Api('68D4BBB60FB8A8F9C99A62145A7B6E27');

exports.getHeros = function (callback) {
	dota.getHeroes(function (err, data) {
		if (err != null) {
			callback(err, null)
			return;
		}
		callback(null, data)
	});
}