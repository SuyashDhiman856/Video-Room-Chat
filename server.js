const express = require('express');
const path = require("path");
const { v4: uuidV4 } = require('uuid');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, { debug: true });

app.use(express.static('public'));
app.use('/peerjs', peerServer);

// const cors = require('cors');
// app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

// Serve the homepage for creating or joining a room
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Generate a room ID and redirect to the room page
app.get('/create-room', (req, res) => {
  const roomId = uuidV4();
  console.log('Creating room with ID:', roomId);
  res.redirect(`/room/${roomId}`);
});

// Serve the room HTML page
app.get('/room/:room', (req, res) => {
  // res.sendFile(__dirname + '/public/room.html');
  const roomId = req.params.room;  // Get the roomId from the URL
  res.render('room', { roomId }); 
});

app.get('/script/script', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/script.js'));
})

// WebSocket connection setup
io.on('connection', socket => {
  console.log('New socket connection:', socket.id);

  // When a user joins a room
  socket.on('join-room', (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId); // Notify others in the room

    // When user disconnects
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      socket.broadcast.to(roomId).emit('user-disconnected', userId); // Notify others of disconnection
    });
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
