const socket = io(`ws://localhost:3000/room/${roomId}`);
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, { host: 'localhost', port: '3001', path: '/peerjs' });
const myVideo = document.createElement('video');
myVideo.muted = true; // To avoid echo feedback of own audio
const peers = {};

console.log('Room ID:', roomId);
console.log(socket);
// Get the user's media stream (video and audio)
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    console.log('Stream obtained:', stream);
    addVideoStream(myVideo, stream); // Add user's own stream to the page

    // Listen for incoming calls (other peers connecting to this peer)
    myPeer.on('call', call => {
      console.log('Receiving call from:', call.peer);
      call.answer(stream); // Answer with your own stream
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {
        console.log('Receiving remote stream from peer:', call.peer);
        addVideoStream(video, userVideoStream); // Add other user's stream
      });
    });

    // When a new user connects, send them your video stream
    socket.on('user-connected', userId => {
      console.log('User connected:', userId);
      connectToNewUser(userId, stream); // Call the new user
    });
  })
  .catch(err => {
    console.error('Error accessing media devices:', err);
  });

// If a user disconnects, remove their video stream
socket.on('user-disconnected', userId => {
  console.log('User disconnected:', userId);
  if (peers[userId]) peers[userId].close();
});

// Join the room and notify the server
myPeer.on('open', id => {
  const roomId = window.location.pathname.split('/')[2];
  console.log('Joining room:', roomId, 'with ID:', id);
  socket.emit('join-room', roomId, id);
});

// Function to connect to a new user
function connectToNewUser(userId, stream) {
  console.log('Calling new user:', userId);
  const call = myPeer.call(userId, stream); // Call the new user
  const video = document.createElement('video');
  call.on('stream', userVideoStream => {
    console.log('Received stream from new user:', userId);
    addVideoStream(video, userVideoStream); // Display new user's stream
  });
  call.on('close', () => {
    console.log('Closing connection to user:', userId);
    video.remove();
  });
  peers[userId] = call; // Store peer connection
}

// Function to add a video stream to the page
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play(); // Play the video when it loads
  });
  videoGrid.append(video); // Append video to the grid
}
