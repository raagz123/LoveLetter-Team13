
const indexRouter = require('./routes/index.js');
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);


const rooms = {};

function addPlayer(id, username) {
  return {
      id: id,
      username: username
  }
}

//socket.io connection
io.on('connection', function (socket){
  console.log('player connected');

  //create game
  socket.on('createGame', function (data) {
    if(!data.username){
        socket.emit('err', {reason:'please enter username'});
        return;
   }
   if(data.room_name.length){
       var room_name = data.room_name;
       var username = data.username;
       var room = io.sockets.adapter.rooms[room_name];
       if(!room){
           socket.join(room_name);
           console.log('Game: ' +room_name+ ', started by ' + username);
           socket.emit('joined')
           
           room = {
               id: room_name,
               players: [addPlayer(socket.id, username)],
               disconnected: []
           };
           rooms[room_name] = room;
       }
       else{
           socket.emit('err', {reason: 'Room name already exists'});
       }
   }
   else{
       socket.emit('err', {reason: 'please enter room id'});
   }
});

  //socket.io disconnection
  socket.on('disconnect', function() {
    console.log('player disconnected');
  });
});

//views engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Start the server on port 3000
http.listen(3000, function (){     
    console.log('Web server running at: http://localhost:3000');     
    console.log('Press Ctrl+C to shut down the web server'); 
});