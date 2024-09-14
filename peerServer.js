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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Use PeerJS server on '/peerjs' path
app.use('/peerjs', peerServer);

// Start the server on port 3001
server.listen(9000, () => {
  console.log('PeerJS server is running on port 3001');
});
