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

/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://SamuelNodeJs:<YPbhk6JyFSxkUYTB>@cluster0.lgws1.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

mongoose.connect('mongodb+srv://SamuelNodeJs:<YPbhk6JyFSxkUYTB>@cluster0.lgws1.mongodb.net/<dbname>?retryWrites=true&w=majority"', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

apijs.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});



  //////////////////////////////
apijs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
apijs.use('/api/v1', router);