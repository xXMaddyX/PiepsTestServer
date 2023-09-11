//Requires for Server
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const socketIO = require('socket.io');
//------------------------------------------------------------------------

//Init Main Needet Modules
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const serverOptions = {
    port: YOUR_PORT,
    hostName: 'YOUR_HOSTNAME'
}
const messageList = [];
const userList = [];
//------------------------------------------------------------------------

// Middleware
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json())
//------------------------------------------------------------------------

// Socket.io Communication
io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich verbunden.');
    socket.on('send-username', (user) => {
        console.log(`Ein Nutzer hat sich zu ${user} umbenannt`);
    });

    // Listen to send events
    socket.on('send-message', (message) => {
        console.log("Nachricht vom Client empfangen:", message);
        messageList.push(message);

        //Send MSG to all clients
        io.emit('new-message', messageList[messageList.length - 1]);
    });
    //Send Chat Log to new connecting clients
    socket.on('get-log', () => {
        socket.emit('chat-log', messageList);
    })

    //MSG on disconnect
    socket.on('disconnect', () => {
        console.log('Ein Benutzer hat sich getrennt.');
    });
});
//------------------------------------------------------------------------

// SERVER MSG, LOG
server.listen(serverOptions.port, serverOptions.hostName, () => {
    console.log(`Server läuft auf http://[${serverOptions.hostName}]:${serverOptions.port}`);
});
//------------------------------------------------------------------------
