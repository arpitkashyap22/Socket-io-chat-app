import express from "express";
import {Server} from "socket.io";
import path from 'path';
import { fileURLToPath } from "url";

const __fileName =  fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

const ADMIN = "Admin";

// State

const UserState = {
    users: [],
    setUsers: function(newUserArray){
        this.users = newUserArray
    }
}


const io = new Server(expressServer, {
    cors: {
        // origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500/"]
        // methods: ["GET", "POST"]
        origin: "*",
    }
})

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // onconnection only to the user 
    socket.emit('message', `Welcome to chat app`);

    // on connection to all other user
    socket.broadcast.emit('message', `${socket.id.substring(0, 5)} has joined the chat app`);

    // listning for a message event
    socket.on("message", data =>{
        console.log(data);
        io.emit("message", `${socket.id.substring(0, 5)} : ${data}`)
    })

    // when user disconnect - to all other user
    socket.on("disconnect", () => {
        socket.broadcast.emit('message', `${socket.id.substring(0, 5)} has left the chat app`);
    })
     

    // Listne for activity event
    socket.on("activity", (name) => {
        socket.broadcast.emit("activity", `${name}`)
    })
})

function buildMessage(name,text){
    return {
        name,
        text,
        time: new Intl.DateTimeFormat("default", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }).format(new Date())
    }
}

function activateUser(id, name, room){
    const user = {id, name, room};
    UserState.setUsers([...UserState.users.filter(user => user.id !== id), user]);
    return user;
}

function exitUser(id){
    UserState.setUsers(UserState.users.filter(user => user.id !== id));
}

function getUser(id){
    return UserState.users.find(user => user.id === id);
}

function getUserInRoom(room){
    return UserState.users.filter(user => user.room === room);
}

function getActiveRoom(){
    return Array.from(new Set(UserState.users.map(user => user.room)));
}