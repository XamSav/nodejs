'use strict';
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
var app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var apijs = require('./api.js');
app.use('/', apijs);
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const SocketIo = require('socket.io');
const { searcher } = require('./api.js');
const io = SocketIo(server);

io.on('connection', (socket) =>{
    console.log('Nueva conexion de', socket.id);
});

module.exports = app;