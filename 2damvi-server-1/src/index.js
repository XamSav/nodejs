'use strict';
const path = require('path');
const express = require("express");
var app = express()
app.disable('x-powered-by');
const bodyParser = require("body-parser");

//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//ApiJS para WebSocket
var apijs = require('./api.js');
var { searcher } = require('./api.js');
var { newCoins } = require('./api.js');
var { updatePower } = require('./api.js');
var { buyCoins } = require('./api.js');
var { topJugadores } = require('./api.js');
var { updateScore } = require('./api.js');
//Configuracion principal del Servidor
const port = process.env.PORT || 4567;
const server = app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port)
    );

//WebSockets
const SocketIo = require('socket.io');
const { debug } = require('console');
const io = SocketIo(server);

io.on('connection', (socket) =>{
  console.log('Nueva conexion de', socket.id);
  /*var lostop = topJugadores(0);
  io.emit('server:ranking1', lostop);
  var lostop1 = topJugadores(1);
  io.emit('server:ranking2', lostop1);
  var lostop2 = topJugadores(2);
  io.emit('server:ranking3', lostop2);
  var lostop3 = topJugadores(3);
  io.emit('server:ranking4', lostop3);
  var lostop4 = topJugadores(4);
  io.emit('server:ranking5', lostop4);*/
  socket.on('player:look',(data)=>{
    var player = apijs.enviarJugador(parseInt(data));
    if(player === false){
      socket.emit('error', "The player does not exist");
    }
    else{
      socket.emit('jugador', player);
    }
  });
    //Actualizar un jugador
  socket.on('player:playerupdate',(data)=>{
    var ok = apijs.searcher(data.alias);
    var hey = apijs.comprobadorDeDatos(data.alias, data.name, data.surname, data.score);
    if(ok.bool === true){
      if(hey === true){
        apijs.updatePlayer(data.alias, data.name, data.surname, data.score);
        socket.emit('server:playerupdate', data);
      }else{
        socket.emit('error', "Uno de los parametros es erróneo");
      }    
    }    
    else{
      socket.emit('error',"No hay ningun usuario con ese alias");
    }
  });
  socket.on('player:collectcoin', (data) =>{
    var ok = apijs.searcher(data.alias);
    if(ok === true){
    var hey = newCoins(data.alias, data.coin);
      if(hey > 0){
        socket.emit('server:coincollected', hey);
      }
    }
  });
  socket.on('player:collectbilletes', (data) =>{
    var ok = apijs.searcher(data.alias);
    if(ok === true){
    var hey = newCoins(data.alias, data.billetes);
      if(hey > 0){
        socket.emit('server:billetescollected', hey);
      }
    }
  });
    //Compra de Coins
  socket.on('player:buycoin',(data)=>{
    var ok = apijs.searcher(data);
    if(ok.bool === true){
      var response = buyCoins(data);
      socket.emit('server:buycoin', response)
    }else{
      socket.emit('error', "No existe ese usuario")
    }
  });
  //Aumentar de Habilidad
  socket.on('player:buyHability',(data)=>{
    var ok = updatePower(data);
    if(ok.error){
      socket.emit('server:error', "No se pudo mejorar la habilidad")
    }else{
      var respuesta = { habilidad: data.habilidad, nivel: ok};
      socket.emit('server:buyHability', respuesta);
    }
  });
  //Nuevo Score
  socket.on('player:newscore', (data)=>{
    console.log(data)
      var ok = updateScore(data);
      if(!ok){
        socket.emit('server:error', "Error al agregar la puntuacion");
      }else{
        var lostop = topJugadores();
        io.emit('server:ranking', lostop[0]);
        io.emit('server:ranking1', lostop[1]);
        io.emit('server:ranking2', lostop[2]);
        io.emit('server:ranking3', lostop[3]);
        io.emit('server:ranking4', lostop[4]);
        
        socket.emit('server:newscore', ok);
    }
  });
  socket.on('player:ranking', ()=>{
    var lostop = topJugadores();
        io.emit('server:ranking', lostop[0]);
        io.emit('server:ranking1', lostop[1]);
        io.emit('server:ranking2', lostop[2]);
        io.emit('server:ranking3', lostop[3]);
        io.emit('server:ranking4', lostop[4]);
  });
    //Emitir a todos menos al cliente en cuestion.
    //socket.broadcast.emit('server:onlyadata');
  socket.on('disconnect', () =>{
    console.log("Se fue: ", socket.id);
  })
});

//Uso de ApiJS
app.use('/', apijs);
app.use(express.urlencoded({ extended: false }));
//HTML
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
