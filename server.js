
const indexRouter = require('./routes/index.js');
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);


const getPlayer = function () {
  let clients = io.sockets.clients().connected;
  let sockets = Object.values(clients);
  let users = sockets.map(s => s.data);
  return users;
}

const emitPlayer = function () {
  io.emit('player', getPlayer());
};

//socket.io connection
io.on('connection', function (socket){
  console.log('player connected');

  //create new game
  socket.on('createGame', function(data) {
    console.log('createGame', data)
    socket.data = data;
    emitPlayer();

  })

  //socket.io disconnection
  socket.on('disconnect', function() {
    emitPlayer();
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