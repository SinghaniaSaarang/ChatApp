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
  const typingusers={};

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

    // const typingusers={};

    // socket.on('typing',verification=>{
    //   if(verification==true){
    //     typingusers[socket.id]=users[socket.id];
    //     socket.broadcast.emit('typingmsg',{name:typingusers[socket.id]});
    //   }else{
    //     delete typingusers[socket.id];
    //     // let currenttyper=Object.values(typingusers)[Object.keys(typingusers).length-1];
    //     // console.log(Object.values(typingusers)[Object.keys(typingusers).length-1]);
    //     // let lasttypename=currenttyper!=undefined?currenttyper:null;
    //     socket.broadcast.emit('typingmsg',{name:Object.values(typingusers)[Object.keys(typingusers).length-1]});
    //   }
    // });

    socket.on('typing', verification => {
      if (verification) {
        typingusers[socket.id] = users[socket.id];
      } else {
        delete typingusers[socket.id];
      }
    
      const typingUserIds = Object.values(typingusers);
      const lastTypingUserId = typingUserIds[typingUserIds.length - 1];
    
      if (lastTypingUserId) {
        // const lastTypingUser = typingusers[lastTypingUserId];
        console.log(lastTypingUserId);
        socket.broadcast.emit('typingmsg', { name: lastTypingUserId });
      } else {
        socket.broadcast.emit('typingmsg', { name: null });
      }
    });
    
  })

server.listen(3000, () => {
  console.log('listening on *:3000');
});