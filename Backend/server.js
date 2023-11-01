const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path=require('path');

app.use(express.static(path.join(__dirname,"../Frontend/")));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,"../Frontend/index.html"));
  })

app.get('/Backend/client.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '../Backend/client.js'));
});

  const users={};

  io.on('connection',socket=>{
    socket.on('new-user',name=>{
        console.log(`${name} joined, Users:-${Object.keys(users).length+1}`);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
        // socket.emit('total-users',users);
        io.emit('total-users',users);
    })

    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    })
  })

server.listen(3000, () => {
  console.log('listening on *:3000');
});