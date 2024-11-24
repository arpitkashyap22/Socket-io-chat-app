const socket = io("ws://localhost:3000")

const msgInput = document.querySelector("#message");
const activity = document.querySelector(".activity");
const nameInput = document.querySelector("#name");
const chatRoom = document.querySelector("#room")
const userList = document.querySelector(".user-list")
const roomList = document.querySelector(".room-list")
const chatDisplay = document.querySelector(".chat-display")

function sendMessage(e){
    e.preventDefault();
    if(msgInput.value && chatRoom.value && nameInput.value){
        socket.emit("message", {
            "name": nameInput.value, "text": msgInput.value});
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
    activity.textContent = "";
    const {name, text, time} = data;
    // console.log(data);
    const li = document.createElement("li");
    li.className = "post";

    if(name === nameInput.value) li.className = "post post--left";
    if(name !== nameInput.value && name !== "Admin") li.className = "post post--right";
    if(name !== "Admin"){
        li.innerHTML = ` <div><div class = "post__header ${name === nameInput.value ? 'post__header--user' : 'post__header--reply'}">
        <span class="post__header--name">${name}</span>
        <span class="post__header--time">${time}</span>
        </div>
        <div class = "post__text"> ${text}</div>
        </div>`
    }else{
        li.innerHTML = `<div class = "post__text"> ${text}</div>`
    }

    chatDisplay.appendChild(li);

    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    // console.log(data);
    // const li = document.createElement("li");
    // li.textContent = data;
    // document.querySelector("#messages-list").appendChild(li);
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

socket.on("usersList", ({users}) => {
    showUsers(users);
})

socket.on("roomsList", ({rooms}) => {
    showRooms(rooms);
})

function showUsers(users){
    userList.textContent = "";

    if(users){
        userList.innerHTML = `<em>Users in ${chatRoom}:</em>` 
            users.forEach((user, i) =>{
                userList.textContent += `${user.name}`
                if(users.length !==1 && users.length - 1 !== i) userList.textContent += ", "
            } )
    }
}
function showRooms(rooms){
    userList.textContent = "";

    if(rooms){
        roomList.innerHTML = `<em>Active rooms:</em>` 
            rooms.forEach((room, i) =>{
                roomList.textContent += `${room}`
                if(rooms.length !==1 && rooms.length - 1 !== i) roomList.textContent += ", "
            } )
    }
}

