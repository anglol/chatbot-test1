var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var apiai = require('apiai');
var apiaiClient = apiai("82e98d777ee945bc912643cd073a9a20");

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.css', function(req, res){
  res.sendFile(__dirname + '/index.css');
});

io.on('connection', function(socket){
  	socket.on('chat message', function(msg){
  	
  		if (msg) {
  			console.log("socket.id : " + socket.id);
		  	var request = apiaiClient.textRequest(msg.message, {sessionId: socket.id});
		  	console.log(request);
		  	request.end();

		  	var payload = {
		  		from: "self",
		  		content: msg.message,
		  	};

		    io.emit('chat message', payload);
			request.on('response', function(response) {

				console.log(response);

			  	var payload = {
			  		from: "api.ai",
			  		content: response.result.fulfillment.speech
			  	};				
		    	socket.emit('chat message', payload);
			});
  		}


 
	request.on('error', function(error) {
	    console.log(error);
	});


  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});
