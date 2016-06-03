var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

$(window).load(function() {

  $messages.mCustomScrollbar();
  setTimeout(function() {
      var welcome = "Hi there, how can I help you ?";
      $('<div class="message new"><figure class="avatar"><img src="images/apiai.png" /></figure>' + welcome + '</div>').appendTo($('.mCSB_container')).addClass('new');
  }, 100);


  socket = io();

  $('.message-submit').click(function() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }

    var payload = {
      message: $('.message-input').val(),
    }

    socket.emit('chat message', payload);
    $('.message-input').val(null);

  });



  socket.on('chat message', function(response){

    if (response.from === "self") {
      $('<div class="message message-personal">' + response.content + '</div>').appendTo($('.mCSB_container')).addClass('new');
      $('<div class="message loading new"><figure class="avatar"><img src="images/apiai.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));          
    } else {
      $('.message.loading').remove();
      $('<div class="message new"><figure class="avatar"><img src="images/apiai.png" /></figure>' + response.content + '</div>').appendTo($('.mCSB_container')).addClass('new');
    }
    updateScrollbar();

//        $('#messages').append($('<li>').text(msg));
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

  socket.emit('chat message', payload);
  $('.message-input').val('');
  return false;                      


/*  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
  setTimeout(function() {
    fakeMessage();
  }, 1000 + (Math.random() * 20) * 100);*/
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
})

var Fake = [
  'Hi there, I\'m Fabio and you?',
  'Nice to meet you',
  'How are you?',
  'Not too bad, thanks',
  'What do you do?',
  'That\'s awesome',
  'Codepen is a nice place to stay',
  'I think you\'re a nice person',
  'Why do you think that?',
  'Can you explain?',
  'Anyway I\'ve gotta go now',
  'It was a pleasure chat with you',
  'Time to make a new codepen',
  'Bye',
  ':)'
]

function fakeMessage() {
  if ($('.message-input').val() != '') {
    return false;
  }
  $('<div class="message loading new"><figure class="avatar"><img src="images/apiai.png" /></figure><span></span></div>').appendTo($('.mCSB_container'));
  updateScrollbar();

  setTimeout(function() {
    $('.message.loading').remove();
    $('<div class="message new"><figure class="avatar"><img src="images/apiai.png" /></figure>' + Fake[i] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    setDate();
    updateScrollbar();
    i++;
  }, 1000 + (Math.random() * 20) * 100);

}