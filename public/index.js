const socket = io("ws://localhost:3000")

const msgInput = document.querySelector("input");
const activity = document.querySelector(".activity");
const nameInput = document.querySelector("#name");
const chatRoom = doacument.querySelector("#room")
const userList = doacument.querySelector(".user-list")
const roomList = doacument.querySelector(".room-list")
const chatDisplay = doacument.querySelector(".chat-display")

function sendMessage(e){
    e.preventDefault();
    if(nameInput.value && msgInput.value && chatRoom.value ){
        socket.emit("message", {
            name: nameInput.value, msg: msgInput.value});
        msgInput.value = "";
    }
    msgInput.focus();
}

function enterRoom(e){
    e.preventDefault();
    if(nameInput.value && chatRoom.value){
        socket.emit("enterRoom", {
            "name" : nameInput.value,
            "room" : chatRoom.value
        })
    }
}

document.querySelector(".form-msg").addEventListener("submit", sendMessage);

document.querySelector(".form-join").addEventListener("submit", enterRoom);


socket.on("message", (data) => {
    console.log(data);
    const li = document.createElement("li");
    li.textContent = data;
    document.querySelector("#messages-list").appendChild(li);
})

msgInput.addEventListener("keypress", (e) => {
    socket.emit("activity", nameInput.value);
})


let activityTimer
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`;

    // clear after 3 sec
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 3000)
})