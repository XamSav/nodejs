'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apijs = require('./api');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

apijs.listen(port, () => {
    console.log("El servidor está inicializado en el puerto "+ port);
});



  //////////////////////////////
apijs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
