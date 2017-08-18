let express = require('express');
let app = express();
let socketio = require('socket.io');
let users = [];

//Server setup
let server = app.listen(4000, () => {
  console.log('magic happens on port 4000');
});

//Static Files
app.use(express.static('public'));

//WebSocket setup
let io = socketio(server);
io.on('connection', (socket) => {
  console.log('new user connected, socket id: '+socket.id);
  socket.on('setUser', (nickname) => {
    //check if user exists
    let userExists = users.filter((user)=>{
      return user.nickname === nickname;
    }).length > 0;

    if(userExists){
      socket.emit('userExists', {});
      return;
    }
    socket.nickname = nickname;
    let user = {socketId: socket.id, nickname: nickname};
    users.push(user);
    socket.emit('setUser', {user: user});
    io.sockets.emit('userJoined', {user: user, users: users});
  });
  socket.on('sendMessage', (data) => {
    io.sockets.emit('sendMessage', data);
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => {
      return user.nickname !== socket.nickname;
    });
    if(!socket.nickname) return;
    socket.broadcast.emit('userLeft', {nickname: socket.nickname, users: users});
  });
});
