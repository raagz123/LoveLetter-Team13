    
    var socket = io.connect('http://localhost:3000');
    var username = null;
    var players = [];
    
    //create game
    $('#newbtn').on('click', function () {
        $('#error-container').html('');
        if($('#username').val()){
            username = $('#username').val();
        }

        if($('#newRoom').val()){
           socket.emit('createGame', {room_name: $('#newRoom').val(), username: username})
        }else{
           $('#error-container').append('<p class="error-msg">please enter room id</p>')
        }
    });

    //join game
    $('#joinbtn').on('click', function () { 
        $('#error-container').html('');
        if($('#username').val()){
            username = $('#username').val();
        }

        if($('#joinRoom').val()){
            socket.emit('joinGame', {room_name: $('#joinRoom').val(), username: username})
        }else{
            $('#error-container').append('<p class="error-msg">please enter room id</p>')
        }
    });
    
    //socket events
    socket.on('err', function (data) {
        $('#error-container').html('');
        $('#error-container').append('<p class="error-msg">'+data.message+'</p>');
        });

        socket.on('error', function (data) {
        console.log(data);
    });
      
      
    var getChat = function(container_id){
        $.ajax({
            type: 'GET',
            async: false,
            url: "partials/chatroom.html",
            success: function (html) {
                $(container_id).append(html);
            },
            error: function (err) {
                console.warn(err);
                location.reload();
            }
        });

        $('#new-message').on('keydown', function (e) { //don't allow new lines
            if(e.keyCode === 13){
                return false;
            }
        });
        
        $('#new-message').on('keyup', function (e) { //send message with enter
            let val = $.trim($('#new-message').val());
            if(e.keyCode === 13 && val){
                socket.emit('message', {msg: val});
                $('#new-message').val('');
            }
        });

        $('#send-message').on('click', function () { //send message
            let val = $.trim($('#new-message').val());

            if(val){
                socket.emit('message', {msg: val});
                $('#new-message').val('');
            }
        });
    };

    
    socket.on('logMessage', function (data) {
        $('#messages').append('<p name="message">'+data.msg+'</p>');
        if(data.hasOwnProperty('color')){
            $('#messages p:last-child').css('color', data.color);
        }
    });