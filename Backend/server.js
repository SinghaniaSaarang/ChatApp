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

    socket.on('disconnect', () => {
      if (users[socket.id]) {
          // console.log(`${users[socket.id]} left, Users: ${Object.keys(users).length - 1}`);
          console.log(`${users[socket.id]} left the chat`);
          socket.broadcast.emit('user-left',users[socket.id]);
          delete users[socket.id];
          io.emit('total-users',users);
      }
  });
  })

server.listen(3000, () => {
  console.log('listening on *:3000');
});