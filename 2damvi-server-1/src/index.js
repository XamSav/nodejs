'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apijs = require('./api');
const serverjs = require('./server');

const port = process.env.PORT || 3000;

apijs.app.listen(port, () => 
    console.log("El servidor está inicializado en el puerto " + port
));


apijs.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));