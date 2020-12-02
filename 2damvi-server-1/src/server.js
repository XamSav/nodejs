const path = require('path');
const express = require("express");
const app = express()

// Puerto server
const port = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));





//Parte de Websocket
const SocketIo = require('socket.io');

//WebSockets
const io = SocketIo(server);

//Escuchar evento de conexion
io.on('connection', (socket) =>{
  console.log('nueva conexion', socket.id);

  //Escuchar evento
  socket.on('player:create',(data)=>{
    //Emitir a todos los usuarios
    io.sockets.emit('server:playercreated', data)
  });

  socket.on('player:onlyadata', (data) =>{
    //Emitir a todos menos al cliente en cuestion.
    socket.broadcast.emit('server:onlyadata')
  })

});