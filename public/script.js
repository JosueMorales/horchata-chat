let socket = io();
let app = angular.module('horchata', []);
app.controller("ChatController", function ($scope, $timeout) {
  let vm = this;
  vm.messages = [];
  vm.users = [];
  vm.privateChats = [];
  vm.setUser = () =>{
    socket.emit('setUser', vm.nickname);
  };
  vm.sendMessage = () =>{
    socket.emit('sendMessage', {user: vm.user, text: vm.message});
    vm.message = null;
  };
  socket.on('userExists', ()=>{
    $scope.$apply(()=>{
      vm.userExists = true;
    });
  });
  socket.on('setUser', (data)=>{
    $scope.$apply(()=>{
      vm.user = data.user;
      vm.messages = [];
      console.log('user '+data.user+' set up!.');
    });
  });
  socket.on('userJoined', (data)=>{
    $scope.$apply(()=>{
      console.log('user '+data.user.nickname+' joined.');
      vm.messages.push({
          time: new Date(new Date().getTime()).toLocaleTimeString(),
          text: data.user.nickname + ' has joined.'
      });
      scrollMessages();
      vm.users = data.users;
    });
  });
  socket.on('userLeft', (data)=>{
    $scope.$apply(()=>{
      console.log('user '+data.nickname+' left.');
      vm.messages.push({
          time: new Date(new Date().getTime()).toLocaleTimeString(),
          text: data.nickname + ' has left.'
      });
      scrollMessages();
      vm.users = data.users;
    });
  });
  socket.on('sendMessage', (data)=>{
    $scope.$apply(()=>{
      vm.messages.push({
          time: new Date(new Date().getTime()).toLocaleTimeString(),
          user: data.user,
          text: data.text
      });
      scrollMessages();
    });
  });
  var scrollMessages = ()=>{
    $timeout(()=>{
      var scroller = document.getElementById("chat-messages");
      scroller.scrollTop = scroller.scrollHeight;
    }, 0, false);
  }
});
