'use strict';
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
var app = express()
//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//ApiJS
var apijs = require('./api.js');
var { searcher } = require('./api.js');
var { createPlayer } = require('./api.js');
app.use('/', apijs);
app.use(express.urlencoded({ extended: false }));

//HTML
app.use(express.static(path.join(__dirname, 'public')));


//Configuracion principal del Servidor
const port = process.env.PORT || 3000;
const server = app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));

//WebSockeys
const SocketIo = require('socket.io');
const io = SocketIo(server);

io.on('connection', (socket) =>{
    console.log('Nueva conexion de', socket.id);
    
    //Escuchar evento
      //Crear un jugador
    socket.on('player:create',(data)=>{
      var ok = apijs.searcher(data);
      //Emitir a todos los usuarios
      if(ok === true){
        apijs.createPlayer(data.alias, data.name, data.surname, data.score);
        io.sockets.emit('server:playercreated', data)
        console.log("Ok");
      }else{
        console.log("No"); 
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

module.exports = app;