const socket = io(`http://localhost:3000`);

const form=document.getElementById('message-form');
const inputmsg=document.getElementById('inputmsg');
const msgsendbtn=document.getElementById('msgsendbtn');
const messagebox=document.getElementById('messagebox');

const name=prompt('Enter your name');
socket.emit('new-user',name);

socket.on('user-joined',name=>{
    const newjoindiv=document.createElement('div');
    newjoindiv.id='newjoindiv';
    newjoindiv.innerHTML=`${name} joined the chat`;
    messagebox.append(newjoindiv);
})