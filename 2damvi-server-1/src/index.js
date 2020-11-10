'use strict';
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apijs = require('./api');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  //mongodb://localhost:27017/test
mongoose.connect('mongodb+srv://SamuelNodeJs:xu6lNRFtrn2SqBdc@cluster0.lgws1.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

apijs.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});



  //////////////////////////////
apijs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
apijs.use('/api/v1', router);