const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
let usersOnline = {userNumber: 0, type: "userCount"};

// Broadcast data to all users
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  usersOnline.userNumber++;
  console.log(usersOnline);
wss.broadcast(JSON.stringify(usersOnline));



  ws.on('message', function incoming(message) {
    let messageParse = JSON.parse(message)
    console.log(`User ${messageParse.username} said ${messageParse.content}`);
    wss.broadcast(message)
  });


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    usersOnline.userNumber--;
    wss.broadcast(JSON.stringify(usersOnline));
    console.log('Client disconnected')
    console.log(usersOnline);
});
})
