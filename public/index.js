const socket = io("ws://localhost:3000")

const msgInput = document.querySelector("input");
const activity = document.querySelector(".activity");

document.querySelector("form").addEventListener("submit",(e) =>{
    e.preventDefault();
    // const input = document.querySelector("input");
    // console.log(input.value);
    if(msgInput.value){
        socket.emit("message", msgInput.value);
        msgInput.value = "";
    }
    msgInput.focus();
})

socket.on("message", (data) => {
    console.log(data);
    const li = document.createElement("li");
    li.textContent = data;
    document.querySelector("#messages-list").appendChild(li);
})

msgInput.addEventListener("keypress", (e) => {
    socket.emit("activity", socket.id.substring(0, 5));
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