$(function () {

    var socket = io.connect('http://localhost:3000');
    var protection = [];
    var players = [];
    var lastPlayed = null;
    var username = null;


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


    $('#newbtn').on('click', function () { //create new room

        $('#error-container').html('');
        if($('#username').val()){
            username = $('#username').val();
        }

       if($('#newRoom').val()){
           socket.emit('createRoom', {room_name: $('#newRoom').val(), username: username})
       }else{
           $('#error-container').append('<p class="error-msg">Please enter room id</p>')
       }
    });

    $('#joinbtn').on('click', function () { // join room

        $('#error-container').html('');
        if($('#username').val()){
            username = $('#username').val();
        }

        if($('#joinRoom').val()){
            socket.emit('joinRoom', {room_name: $('#joinRoom').val(), username: username})
        }else{
            $('#error-container').append('<p class="error-msg">Please enter room id</p>')
        }
    });

     //socket events

     socket.on('err', function (data) {
        $('#error-container').html('');
        $('#error-container').append('<p class="error-msg">'+data.reason+'</p>');
    });

    socket.on('error', function (data) {
        console.log(data);
    });

    

});