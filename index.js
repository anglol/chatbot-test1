var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var apiai = require('apiai');
var apiaiClient = apiai("82e98d777ee945bc912643cd073a9a20");

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.css', function(req, res){
  res.sendFile(__dirname + '/index.css');
});


function getRandomIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function getRandomExcuse() {

	var excuses = [

		'I am sorry. I haven\'t yet learned how to answer this question :)',
		'Please try to tell me that another way.',
		'Sorry, I don\'t know what that means.',
		'Mmmmh I don\'t understand, sorry.',
		'I wish I understand, but I don\'t.',
		'I feel stupid now.',
		'I don\'t understand yet, I just born !',
		'I have no idea what you are talking about :D',
		'Could you try to write it another way ?',
		'This is awkward, I have no idea about it.',
		'Sorry, I\'m not smarter than an octopus.'

	];
	var index = getRandomIntBetween(0, excuses.length - 1);

	return excuses[index];
}

io.on('connection', function(socket){
  	socket.on('chat message', function(msg){
  	
  		if (msg) {
		  	var request = apiaiClient.textRequest(msg.message, {sessionId: socket.id});
		  	request.end();

		  	var payload = {
		  		from: "self",
		  		content: msg.message,
		  	};

		    socket.emit('chat message', payload);
			request.on('response', function(response) {

				console.log(response);

			  	var payload = {
			  		from: "api.ai",
			  		content: (response.result.fulfillment.speech || getRandomExcuse())
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
