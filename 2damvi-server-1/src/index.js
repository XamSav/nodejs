const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(3000, () =>{
    console.log("El servidor esta inicializado en el puerto 3000");

let gamer = {
    nombre: '',
    apellido: '',
    score: ''
};
let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
};

////////////////////////////////////// POST //////////////////////////////////////
app.post('/gamer', function (req, res) {

    var nom = req.body.nombre || null;
    var cognom = req.body.apellido || null;;
    var coins = req.body.score || null;
    // Si falta algun parametro dara error.
    if(nom == null|| cognom == null || coins == null) {
        respuesta = {
        error: true,
        codigo: 502,
        mensaje: 'Camps obligatoris camp nom, cognom o score'
        };
    } 
    else {
        //Si alguno de los parametros es igual a alguno ya creado dara error
        if(gamer.nombre == nom && gamer.apellido == cognom) {
            respuesta = {
            error: true,
            codigo: 503,
            mensaje: 'El jugador ya fue creado previamente'
        };} 
        else {
            //En "Gamer" pondra los parametros que se dieron en Post de draw -> Json
            gamer = {
            nombre: nom,
            apellido: cognom,
            score: coins
        };
        // Dira que no hay error, dara el codigo 200, un mensaje de jugador creado y tambien ensenara "Gamer" que esta en las lineas de arriba.
        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Jugador creado',
            respuesta: gamer
        };
        }
    }
    res.send(respuesta);
});
})