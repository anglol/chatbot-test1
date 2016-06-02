var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var apiai = require('apiai');
var apiaiClient = apiai("82e98d777ee945bc912643cd073a9a20");

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  	socket.on('chat message', function(msg){
  	var request = apiaiClient.textRequest(msg);
  	request.end();
    io.emit('chat message', 'MOI > ' + msg);
	request.on('response', function(response) {
	    console.log(response);
    	io.emit('chat message', 'ROBOT > ' + response.result.fulfillment.speech);	    
	});

 
	request.on('error', function(error) {
	    console.log(error);
	});


  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});