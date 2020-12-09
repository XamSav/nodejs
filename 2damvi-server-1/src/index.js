'use strict';
const path = require('path');
const express = require("express");
var app = express()
//const bodyParser = require("body-parser");

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ApiJS para WebSocket
var apijs = require('./api.js');
var { searcher } = require('./api.js');
var { createPlayer } = require('./api.js');
var { comprobadorDeDatos } = require('./api.js');
var { enviarJugadores } = require('./api.js');
//Configuracion principal del Servidor
const port = process.env.PORT || 4567;
const server = app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));

//WebSockets
const SocketIo = require('socket.io');
const io = SocketIo(server);

io.on('connection', (socket) =>{
    console.log('Nueva conexion de', socket.id);
    //Escuchar evento
  ///PRUEBAS///

  
  socket.on('player:look',(data)=>{
    var player = apijs.enviarJugadores(parseInt(data));
    if(player === false){
      socket.emit('noexist', false);
    }
    else{
      socket.emit('jugadores', player);
    }
  })
  






  ///CODIGO BUENO///
      //Crear un jugador
    socket.on('player:create',(data)=>{
      var ok = apijs.searcher(data.alias);
      var hey = apijs.comprobadorDeDatos(data.alias, data.name, data.surname, data.score);
      //Emitir a todos los usuarios
      if(ok === true){
        if(hey === true){
          apijs.createPlayer(data.alias, data.name, data.surname, data.score);
          io.sockets.emit('server:playercreated', data)
        }else{
          console.log("Parametros incorrectos");
        }
      }else{
        console.log("Ya hay un usuario en con ese alias"); 
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
    })*/
});

//Uso de ApiJS
app.use('/', apijs);
app.use(express.urlencoded({ extended: false }));
//HTML
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;