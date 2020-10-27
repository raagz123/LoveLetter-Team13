    
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
      
      
    
    