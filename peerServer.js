// peerServer.js
const express = require('express');
const http = require('http');
const { ExpressPeerServer } = require('peer');

// Initialize Express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize the PeerJS server with debug enabled
const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true,
  debug: true,
});

// Use PeerJS server on '/peerjs' path
app.use('/peerjs', peerServer);

// Start the server on port 3001
server.listen(3001, () => {
  console.log('PeerJS server is running on port 3001');
});
