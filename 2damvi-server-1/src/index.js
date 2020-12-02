'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apijs = require('./api');
const serverjs = require('./server');

const port = process.env.PORT || 3000;

apijs.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));


apijs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/*

//Parte de Websocket
const SocketIo = require('socket.io');

//WebSockets
const io = SocketIo(server);

//Escuchar evento de conexion
io.on('connection', () =>{
  Console.log('nueva conexion');
})
*/