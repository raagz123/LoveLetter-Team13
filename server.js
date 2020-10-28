const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const escape = require('escape-html');


app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

let rooms = {};
let imgdest = '../images/';

let suits = {
    1: {
        id: 1,
        name: 'guard',
        image: imgdest + '1.jpg'
    },
    2: {
        id: 2,
        name: 'priest',
        image: imgdest + '2.jpg'
    },
    3: {
        id: 3,
        name: 'baron',
        image: imgdest + '3.jpg'
    },
    4: {
        id: 4,
        name: 'handmaid',
        image: imgdest + '4.jpg'
    },
    5: {
        id: 5,
        name: 'prince',
        image: imgdest + '5.jpg'
    },
    6: {
        id: 6,
        name: 'king',
        image: imgdest + '6.jpg'
    },
    7: {
        id: 7,
        name: 'countess',
        image: imgdest + '7.jpg'
    },
    8: {
        id: 8,
        name: 'princess',
        image: imgdest + '8.jpg'
    }
};

let buildDeck = function () {
    let deck = [];
    for (i = 0; i < 5; i++) {
        deck.push(suits[1])
    }
    for (i = 0; i < 2; i++) {
        deck.push(suits[2]);
        deck.push(suits[3]);
        deck.push(suits[4]);
        deck.push(suits[5]);
    }
    deck.push(suits[6]);
    deck.push(suits[7]);
    deck.push(suits[8]);


    return deck;
};

function addPlayer(id, username) {
    return {
        id: id,
        username: username,
        hand: [],
        discarded: [],
        tokens: 0,
        isProtected: false,
        isDead: false,
    }
}

function getPlayers(room, id) {
    let players = [];
    room.players.forEach(function (player) {
        if (player.id !== id) {
            players.push({
                username: player.username,
                discarded: player.discarded,
                tokens: player.tokens,
                isDead: player.isDead,
            })
        }
    });
    return players;
}

io.on('connection', function (socket) {
    console.log('User connected');

    //create new game room
    socket.on('createRoom', function (data) {
        if (!data.username) {
            socket.emit('err', { reason: 'Please enter username' });
            return;
        }

        if (data.room_name.length) {
            let room_name = escape(data.room_name);
            let username = escape(data.username);
            let room = io.sockets.adapter.rooms[room_name];
            if (!room) {
                socket.join(room_name);
                console.log('room: ' + room_name + ', created by ' + username);
                socket.emit('joined', {
                    username: username,
                    player_num: 1,
                    players: []
                });
                room = {
                    id: room_name,
                    players: [addPlayer(socket.id, username)],
                    disconnected: []
                };
                rooms[room_name] = room;
            }
            else {
                socket.emit('err', { reason: 'Room name already exists' });
            }
        }
        else {
            socket.emit('err', { reason: 'Please enter room id' });
        }
    });

    //join existing room
    socket.on('joinRoom', function (data) {
        if (!data.username) {
            socket.emit('err', { reason: 'Please enter username' });
            return;
        }

        if (data.room_name.length) {
            let room_name = escape(data.room_name);
            let username = escape(data.username);

            let room = io.sockets.adapter.rooms[room_name];

            if (room && rooms[room_name]) {
                room = rooms[room_name];
                if (room.players.length < 4) {
                    if (room.players.findIndex(p => p.username === username) === -1) {
                        socket.join(room_name);
                        room.players.push(addPlayer(socket.id, username));
                        if (room.playing) {
                            room.players[room.players.length - 1].isDead = true;
                        }
                        console.log('room: ' + room_name + ', joined by ' + username);
                        socket.emit('joined', {
                            player_num: room.players.length + 1,
                            username: username,
                            isDead: room.playing,
                            players: getPlayers(room, socket.id)
                        });

                        socket.to(room_name).emit('joinedRoom', {
                            player_num: room.players.length + 1,
                            username: username,
                            isDead: room.playing
                        });
                        socket.to(room_name).emit('logMessage', { msg: username + ' joined the room', });
                    }
                    else {
                        socket.emit('err', { reason: 'Username already taken' });
                    }
                }
            }
            else {
                socket.emit('err', { reason: 'Room does not exist' });
            }
        }
        else {
            socket.emit('err', { reason: 'Please enter room id' });
        }
    });


    //send a chat message
    socket.on('message', function (data) {
        let r = findRoomPlayer(socket);
        if (r) {
            socket.to(r.room).emit('message', {
                username: r.username,
                msg: escape(data.msg),
                color: stringToColor(socket.id)
            });
            socket.emit('message', {
                username: 'you',
                msg: escape(data.msg),
                color: stringToColor(socket.id)
            });
        }
    });


    //User disconnect
    socket.on('disconnect', function () {
        console.log('User Disconnected');
    })
});

server.listen(3000, function () {
    console.log('Web server running at: http://localhost:3000');
    console.log('Press Ctrl+C to shut down the web server');
});