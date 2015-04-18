var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var online = [];

function remove(arr, item) {
    for(var i = arr.length; i--;) {
        if(arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user ' + socket.username + ' disconnected');
    io.emit('offline', socket.username);
    remove(online, socket.username);
  });
  socket.on('login', function(msg){
    console.log('login: ' + msg);
    socket.username = msg;
    online.push(msg);
    io.emit('online', online);
    console.log('online message sent');
  });
  socket.on('message', function(msg){
    console.log('message: ' + msg);
    if (msg != '')
      io.emit('chat message', { u: socket.username, m: msg});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
