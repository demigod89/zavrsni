var Dota2Api = require('dota2api');
var dota = new Dota2Api('68D4BBB60FB8A8F9C99A62145A7B6E27');

//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=0.0.0.0:8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
	dota.getHeroes(function (err, res) {
		console.log(res.heroes.length);
	    response.end(JSON.stringify(res)); 
	});
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});