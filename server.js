
const indexRouter = require('./routes/index.js');
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {addPlayer, getPlayers} = require('./myfunction.js');


const rooms = {};

//socket.io connection
io.on('connection', function (socket){
  console.log('player connected');

  //create game
  socket.on('createGame', function (data) {
    if(!data.username){
        socket.emit('err', {message:'please enter username'});
        return;
   }
   if(data.room_name.length){
       var room_name = data.room_name;
       var username = data.username;
       var room = io.sockets.adapter.rooms[room_name];
       if(!room){
           socket.join(room_name);
           console.log(username +' created '+  room_name);
           socket.emit('joined')
           
       var room = {
               id: room_name,
               players: [addPlayer(socket.id, username)],
               disconnected: []
           };
           rooms[room_name] = room;
       }
       else{
           socket.emit('err', {message: 'Room name already exists'});
       }
   }
   else{
       socket.emit('err', {message: 'please enter room id'});
   }
  });
   
    //join game
   socket.on('joinGame', function (data) {
       if(!data.username){
           socket.emit('err', {message: 'please enter username'});
           return;
       }
       if(data.room_name.length) {
           var room_name = data.room_name;
           var username = data.username;
           var room = io.sockets.adapter.rooms[room_name];

           if(room && rooms[room_name]) {
               room = rooms[room_name];
               if(room.players.length < 4) {
                if(room.players.findIndex(p => p.username === username) === -1) {
                    socket.join(room_name);
                    room.players.push(addPlayer(socket.id, username));
                    console.log(username +' joined '+ room_name);
                    socket.emit('joined', {
                        player_num: room.players.length + 1,
                        username: username,
                        isDead: room.playing,
                        players: getPlayers(room, socket.id)
                    });
                    socket.to(room_name).emit('logMessage', {msg: username+' joined the game',});
                }else{
                    socket.emit('err', {message: 'Username already taken'});
                }
                }else{
                    socket.emit('err', {message: 'please enter room id'});
                }}else{
                    socket.emit('err', {message: 'Room does not exist'});
                }
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
