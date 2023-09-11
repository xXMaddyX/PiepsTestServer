//Init Variables
const inputField = document.getElementById('input-field');
const sendButton = document.getElementById('send-button');
const chatLog = document.getElementById('chat-log');
const userList = document.getElementById('user-list');
const socket = io.connect('http://YOUR_URL_ADRESS/');
const userChangeBtn = document.getElementById('user-button');
const userChangeWin = document.querySelector('.user-change');
const userNameInput = document.getElementById('username-input');
const userNameInputBtn = document.getElementById('unsername-input-button');
//------------------------------------------------------------------------

//User Infos
let clientUserName = 'User';
socket.emit('send-username', clientUserName)
//------------------------------------------------------------------------

//Stored Data Users and ChatLog
let messageLog = [];
let userListData = [];
//------------------------------------------------------------------------

//Function Event Listener Send Message
function sendMessage() {
    let messageText = inputField.value;
    let message = {clientUserName, message: messageText};
    socket.emit('send-message', message);
    inputField.value = '';
}

//Event Listener Send Button Click and Press Enter
sendButton.addEventListener('click', sendMessage);

inputField.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
        sendMessage();
        event.preventDefault();
    }
});
//------------------------------------------------------------------------

// Listen for messages from server
socket.on('new-message', (message) => {
    messageLog.push(message);
    diplayTextUserInput(messageLog);
});

//Display Chat Messages
const diplayTextUserInput = (messageLog) => {
    const chatLog = document.getElementById('chat-log');
    const message = messageLog[messageLog.length - 1];
    const newLi = document.createElement('li');

    const userSpan = document.createElement('span');
    userSpan.innerText = message.clientUserName + ': ';
    userSpan.classList.add('blue-text')

    newLi.appendChild(userSpan);
    newLi.innerHTML += '<br>' + message.message;
    
    chatLog.appendChild(newLi);

    chatLog.scrollTop = chatLog.scrollHeight;
}
//------------------------------------------------------------------------

//Display User List
const diplayUserList = (user) => {
    const userListLog = document.getElementById('user-list');
    for (user of user) {
        const newLi = document.createElement('li');
        newLi.innerHTML = user;
        userListLog.appendChild(newLi)
    }
}
//------------------------------------------------------------------------

//Button activator for user Name Change
userChangeBtn.addEventListener('click', () => {
    userChangeWin.classList.add('active')
})

//Button User Name Change Input
userNameInputBtn.addEventListener('click', () => {
    let newUsername = userNameInput.value;
    if (newUsername === '') {
        console.log("Ungültiger Username")
    } else {
        clientUserName = userNameInput.value;
    
        socket.emit('send-username', clientUserName)
        userNameInput.value = '';
        saveUserNameToLocal();
        userChangeWin.classList.remove('active'); 
    };
    
});
//------------------------------------------------------------------------
//Get Userlist on connect
const getChatLogOnConnect = () => {
    socket.emit('get-log');
    socket.on('chat-log', (resChatLog) => {
        for (let msg of resChatLog) {
            messageLog.push(msg);
        }

        for (let currentMessage of messageLog) {
            const chatLog = document.getElementById('chat-log');
            const newLi = document.createElement('li');

            const userSpan = document.createElement('span');
            userSpan.innerText = currentMessage.clientUserName + ': ';
            userSpan.classList.add('blue-text')

            newLi.appendChild(userSpan);
            newLi.innerHTML += '<br>' + currentMessage.message;
    
            chatLog.appendChild(newLi);

            chatLog.scrollTop = chatLog.scrollHeight;
        }
    });
};
//------------------------------------------------------------------------

//Save Username To Local
const saveUserNameToLocal = () => {
    localStorage.setItem('PiepsChat', clientUserName);
};
//------------------------------------------------------------------------

//Load User from Local
const loadUserNameFromLocal = () => {
    if (localStorage.getItem('PiepsChat') === null) {
        console.log('no Username set');
    } else {
        let loadUsername = localStorage.getItem('PiepsChat');
        clientUserName = loadUsername;
    }
};
//------------------------------------------------------------------------

//Function Calls
loadUserNameFromLocal();
diplayUserList(userListData);
getChatLogOnConnect();
