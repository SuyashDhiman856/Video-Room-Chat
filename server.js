const express = require('express');
const path = require("path")
const { ExpressPeerServer } = require('peer');
const { v4: uuidV4 } = require('uuid');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const peerServer = ExpressPeerServer(http, { debug: true });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`); // Generate unique room ID and redirect user
});

app.get('/call/:room', (req, res) => {
    res.sendFile(__dirname + '/public/room.html'); // Serve the room page
});

app.get('/create-call', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/create.html'));
})

app.get('/join-call', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/join.html'));
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        io.to(roomId).emit('user-connected', userId); // Notify all users in the room

        socket.on('disconnect', () => {
            io.to(roomId).emit('user-disconnected', userId); // Notify all users in the room
        });
    });
});

http.listen(3000, () => {
    console.log('Server is running on port 3000');
});
