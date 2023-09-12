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
    port: 'YOUR_PORT',
    hostName: 'YOUR_HOSTE_ADRESS'
}
const messageList = [];
const userList = [];
const greeting = [{clientUserName: 'Piep´s Server', message: 'Willkommen auf unserem Server "piep´s pieps!!!" <br> Bitte halte dich an unsere Regeln. <br> und jetzt Viel Spaß... "piep´s piep´s!!!'}]
//------------------------------------------------------------------------

// Middleware
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json())
//------------------------------------------------------------------------

// Socket.io Communication
io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich verbunden.');
    socket.on('send-username', (username) => {
        console.log(`Ein Nutzer hat sich zu ${username} umbenannt`);

        let user = {
            id: socket.id,
            username: username
        };
        userList.push(user);
        io.emit('update-user', userList);
        console.log(userList)
        
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
        socket.emit('chat-log', greeting);
    });

    //MSG on disconnect
    socket.on('disconnect', () => {
        console.log('Ein Benutzer hat sich getrennt.');

        for (let i = 0; i < userList.length; i++) {
            if (userList[i].id == socket.id) {
                userList.splice(i, 1)
                console.log(userList)
                break;
            }
        }
        io.emit('user-disconnect', userList);

    });
});
//------------------------------------------------------------------------

// SERVER MSG, LOG
server.listen(serverOptions.port, serverOptions.hostName, () => {
    console.log(`Server läuft auf http://[${serverOptions.hostName}]:${serverOptions.port}`);
});
//------------------------------------------------------------------------
