var $messages = $('.messages-content');

var d, h, m, i = 0;

/*
* adds a message from the bot in the chat
*/
function addBotMessage(message) {
      // removes the current loader if it exists
      $('.message.loading').remove();  
      $('<div class="message new"><figure class="avatar"><img src="images/avatar-bot-75.png" /></figure>' 
        + message + '</div>').appendTo($('.mCSB_container')).addClass('new');  

      updateScrollbar();

}

/*
* shows that the bot is preparing a message
*/
function addBotLoader() {
      $('<div class="message loading new"><figure class="avatar"><img src="images/avatar-bot-75.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));                  

      updateScrollbar();      

}

function addSelfMessage(message) {
      $('<div class="message message-personal">' + message + '</div>').appendTo($('.mCSB_container')).addClass('new');

      updateScrollbar();      

}


function sendMessage() {

  // no message is sent if the text field is empty
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }


  // initially the payload contains only the user input
  var payload = {
    message: $('.message-input').val(),
  }

/*  if (position && position.coords) {
      payload.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
  }*/

  // the payload is sent to the websocket
  socket.emit('chat message', payload);
  $('.message-input').val('');
  return false;                      
}



/*var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var position;


function geolocSuccess(pos) {
  position = pos;

  console.log('Your current position is:');
  console.log('Latitude : ' + position.coords.latitude);
  console.log('Longitude: ' + position.coords.longitude);
  console.log('More or less ' + position.coords.accuracy + ' meters.');
};

function geolocError(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};*/



$(window).load(function() {


  // Messages initially displayed. They should be sent by the server when the websocket is initialized

  $messages.mCustomScrollbar();
  setTimeout(function() {
      addBotMessage("Hello, my name is Gaëlle, I’m your personal BotBank Assistant. I can provide some assistance on BotBank products and services or help you find an ATM. You can also ask me about weather forecast.");

  }, 100);
  setTimeout(function() {
      addBotMessage("How can I help you?");
  }, 1000);  


/*  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError, options);
  }*/

  // websocket initialization
  socket = io();

  // sends a message when the SEND button is clicked
  $('.message-submit').click(function() {
    sendMessage();
  });

  // sends a message when the RETURN key is pressed
  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      sendMessage();
      return false;
    }
  });


  // reception of a message from the websocket
  socket.on('chat message', function(response){

    var text;

    switch(response.from) {

      // message I sent myself. 
      // Not automatically shown from the client-side, it passes by the server-side to be sure we're online
      case "self":

        // carriage returns are replaces by BR to improve the display
        text = response.content.replace(/\n/g, "<br />");

        // my message is displayed in the chat
        addSelfMessage(text);
        
        // we show that the bot is preparing its response
        addBotLoader();  
        break;

      // message sent by the bot
      case "api.ai":

        // the action is displayed in the console for debugging purposes
        console.log("action: " + response.content.action);

        // we could react according to the type of action (unused so far)
        switch(response.content.action) {
          default:
            if (response.content.fulfillment.speech) {
              text = response.content.fulfillment.speech.replace(/\n/g, "<br />");
            } else {
              text = getRandomText();
            }
            addBotMessage(text);
            break;
        }
    }
  });


});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

// Generation of random messages when the bot doesn't understand a message (action = null)
function getRandomText() {

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
  return excuses[getRandomIntBetween(0, excuses.length - 1)];
}

function getRandomIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
