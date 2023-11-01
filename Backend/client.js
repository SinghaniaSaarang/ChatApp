const socket = io(`http://localhost:3000`);

const form=document.getElementById('message-form');
const inputmsg=document.getElementById('inputmsg');
const msgsendbtn=document.getElementById('msgsendbtn');
const messagebox=document.getElementById('messagebox');
const chatpeoples=document.getElementById('chatpeoples');

const name=prompt('Enter your name');
socket.emit('new-user',name);

socket.on('user-joined',name=>{
    const newjoindiv=document.createElement('div');
    newjoindiv.id='newjoindiv';
    newjoindiv.innerHTML=`${name} joined the chat`;
    messagebox.append(newjoindiv);
})

socket.on('total-users',users=>{
    const totalconnected=document.getElementById('total-connected');
    totalconnected.innerText=`Connected chats:-${Object.keys(users).length}`;

    // let usernames='';
    // const totalconnectednames=document.getElementById('total-connected-names');
    // Object.values(users).forEach(username=>{
    //     usernames+=`${username},`;
    // });

    // totalconnectednames.innerText=usernames;
})

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const message=inputmsg.value.trim();
    if (message.length>0) {
      const yourmsg=document.createElement('div');
      yourmsg.className=`message right`;
      yourmsg.innerHTML=`<h5>You:</h5>${inputmsg.value}`;
      messagebox.append(yourmsg);
      socket.emit('send',message);
      inputmsg.value = '';
    }
  });

socket.on('receive',data=>{
    const receivemsg=document.createElement('div');
    receivemsg.className=`message left`;
    receivemsg.innerHTML=`<h5>${data.name}:</h5>${data.message}`;
    messagebox.append(receivemsg);
    // socket.emit('send',message);
    // inputmsg.value = '';
})