var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

var options = {
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
};



$(window).load(function() {

  $messages.mCustomScrollbar();
  setTimeout(function() {
      var welcome = "Hi there, how can I help you ?";
      $('<div class="message new"><figure class="avatar"><img src="images/apiai.png" /></figure>' + welcome + '</div>').appendTo($('.mCSB_container')).addClass('new');
  }, 100);


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError, options);
  }

  socket = io();

  $('.message-submit').click(function() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }



    var payload = {
      message: $('.message-input').val()
    }


    socket.emit('chat message', payload);
    $('.message-input').val(null);

  });



  socket.on('chat message', function(response){

//    console.log(response);
    $('.message.loading').remove();

    var text;


    switch(response.from) {



      case "self":
        text = response.content.replace(/\n/g, "<br />");
        $('<div class="message message-personal">' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');
        $('<div class="message loading new"><figure class="avatar"><img src="images/apiai.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));                  
        break;

      case "api.ai":

        console.log("action: " + response.content.action);

        switch(response.content.action) {
          default:
            text = (response.content.fulfillment.speech.replace(/\n/g, "<br />") || getRandomText());
            $('<div class="message new"><figure class="avatar"><img src="images/apiai.png" /></figure>' + text + '</div>').appendTo($('.mCSB_container')).addClass('new');        
            break;
        }
    }

    updateScrollbar();

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



function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }


  var payload = {
    message: $('.message-input').val(),
  }

  if (position && position.coords) {
      payload.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
  }


  socket.emit('chat message', payload);
  $('.message-input').val('');
  return false;                      
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});

function getRandomIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}


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
