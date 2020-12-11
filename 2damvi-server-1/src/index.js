'use strict';
const path = require('path');
const express = require("express");
var app = express()
const bodyParser = require("body-parser");

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ApiJS para WebSocket
var apijs = require('./api.js');
var { searcher } = require('./api.js');
var { comprobadorDeDatos } = require('./api.js');
var { enviarJugador } = require('./api.js');
var { enviarJugadores } = require('./api.js');
var { updatePlayers } = require('./api.js');
var { buyCoins } = require('./api.js');
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
  //Mirar 1 Jugador
  socket.on('player:look',(data)=>{
    var player = apijs.enviarJugador(parseInt(data));
    if(player === false){
      socket.emit('error', "The player does not exist");
    }
    else{
      socket.emit('jugador', player);
    }
  });
  //Mirar Varios Jugadores
  socket.on('players:look', () =>{
    var players = apijs.enviarJugadores();
    console.log(players)
    socket.emit('jugadores', players);
  });
  ///CODIGO BUENO///

    //Actualizar un jugador
  socket.on('player:playerupdate',(data)=>{
    var ok = apijs.searcher(data.alias);
    var hey = apijs.comprobadorDeDatos(data.alias, data.name, data.surname, data.score);
    if(ok === true){
      if(hey === true){
        apijs.updatePlayer(data.alias, data.name, data.surname, data.score);
        io.sockets.emit('server:playerupdate', data)
      }else{
        io.sockets.emit('error', "Uno de los parametros es erróneo");
        console.log("Uno de los parametros es erróneo");
      }    
    }    
    else{
      io.sockets.emit('error',"No hay ningun usuario con ese alias");
      console.log("No hay ningun usuario con ese alias"); 
    }
  });

    //Compra de Coins
  socket.on('player:buycoin',(data)=>{
    var ok = apijs.searcher(data);
    if(ok === true){
      var response = buyCoins(data);
      io.sockets.emit('server:buycoin', response)
    }else{
      io.sockets.emit('error', "No existe ese usuario")
    }
  });
  //Aumentar de Habilidad
  socket.on('player:powerup',(data)=>{
    //Emitir a todos los usuarios
    io.sockets.emit('server:powerup', data)
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