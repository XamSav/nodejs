const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(3000, () =>{
    console.log("El servidor esta inicializado en el puerto 3000");

let gamer = {
        nombreJugadors: 3,
        jugadors: [{
                posicio: "1",
                alies: "jperez",
                nom: "Jose",
                congnom: "Perez",
                score: "1000"
        },
        {
                posicio: "2",
                alies: "jsanz",
                nom: "Juan",
                congnom: "Sanz",
                score: "950"
        },
        {
                posicio: "3",
                alies: "mgutierrez",
                nom: "Maria",
                congnom: "Gutierrez",
                score: "850"
        },
        {
            posicio: "",
            alies: "",
            nom: "",
            congnom: "",
            score: ""
        }
        ]
};

let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
};
////////////////////////////////////// GET //////////////////////////////////////

app.get('/gamer', function (req, res){

    res.send(gamer);
})
app.get('/gamer/:alies', function(req,res){
    const {alies} = req.params;
    var max = jugadors.lenght;
    for(var x = 0; x < max ; x++){
        if(jugadors[x].alies == req.params.alies){
        res.send(jugadors[x]);
        }
}
})

////////////////////////////////////// POST //////////////////////////////////////
app.post('/gamer', function (req, res) {

    var nom = req.body.nombre || null;
    var cognom = req.body.apellido || null;
    var coins = req.body.score || null;
    var pos = req.body.posicio || null;
    // Si falta algun parametro dara error.
    if(nom == null|| cognom == null || coins == null || pos == null) {
        respuesta = {
        error: true,
        codigo: 502,
        mensaje: 'Camps obligatoris camp nom, cognom, score y posicio'
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


////////////////////////