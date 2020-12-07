/*const path = require('path');
const express = require("express");
const app = express();
// Puerto server
const port = process.env.PORT || 80;
const apijs = require('./api.js');

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));

//Parte de Websocket
const SocketIo = require('socket.io');
const { searcher } = require('./api.js');
const io = SocketIo(server);

//Escuchar evento de conexion
io.on('connection', (socket) =>{
  console.log('Nueva conexion de', socket.id);
  console.log('Nueva conexion de', socket.handshake.address);
  
  //Escuchar evento
    //Crear un jugador
  socket.on('player:create',(data)=>{
    var ok = searcher(data);
    //Emitir a todos los usuarios
    if(ok === true){
    io.sockets.emit('server:playercreated', data)
    }
  });

    //Actualizar un jugador
  socket.on('player:playerupdate',(data)=>{
    //Emitir a todos los usuarios
    io.sockets.emit('server:playerupdate', data)
  });

    //Compra de Coins
  socket.on('player:buycoin',(data)=>{
    //Emitir a todos los usuarios
    io.sockets.emit('server:buyshop', data)
  });

    /*
  socket.on('player:onlyadata', (data) =>{
    //Emitir a todos menos al cliente en cuestion.
    socket.broadcast.emit('server:onlyadata')
  })
});
*/