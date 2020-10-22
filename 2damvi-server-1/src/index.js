const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(3000, () =>{
    console.log("El servidor esta inicializado en el puerto 3000");
});

let jugadors = [{
                posicio: 1,
                alies: "jperez",
                nom: "Jose",
                congnom: "Perez",
                score: 1000
        },
        {
                posicio: 2,
                alies: "jsanz",
                nom: "Juan",
                congnom: "Sanz",
                score: 950
        },
        {
                posicio: 3,
                alies: "mgutierrez",
                nom: "Maria",
                congnom: "Gutierrez",
                score: 850
        }
        ];


let respuesta = {
    error: false,
    codigo: 200,
    mensaje: ''
};
////////////////////////////////////// GET //////////////////////////////////////
                    ///////Muestra Todos los Jugadores\\\\\\\
app.get('/jugadors', function (req, res){

    res.send(jugadors);
})

//Muestra solo al Jugador indicado en la URL
app.get('/jugadors/:alies', function(req,res){
    var x = 0;
    for( i = 0; i < jugadors.length; i++)
    {
        if(jugadors[i].alies == req.params.alies){
        res.send(jugadors[i]);
        }else{
            x++;
        }
    }
    if(x == jugadors.length){
        respuesta = {
            "error": true,
            "codi": 504,
            "missatge": "El jugador no exite"
        }
        res.send(respuesta);
    }
})


    ///////Muestra el Ranking en Orden\\\\\\\

app.get('/ranking', function(req,res){

    jugadors.sort((a,b) => (a.score < b.score ? 1 : -1));
    for(i = 0; i < jugadors.length; i++){
        jugadors[i].posicio = i + 1;
    }
    res.send(jugadors);

})






////////////////////////////////////// POST //////////////////////////////////////

/////////////Añades el Jugador desde 0 poniendolo todo tu desde el body\\\\\\\\\\\\\\\\\\\
app.post('/jugadors', function (req, res) {

    var nombre = req.body.nom || null;
    var apellido = req.body.cognom || null;
    var coins = req.body.score || null;
    var pos = req.body.posicio || null;
    // Si falta algun parametro dara error.
    if(nombre == null|| apellido == null || coins == null || pos == null) {
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Camps obligatoris camp nom, cognom, score y posicio'
        };
    } 
    else {
        //Si alguno de los parametros es igual a alguno ya creado dara error
        if(jugadors.nom == nombre && jugadors.cognom == apellido) {
            respuesta = {
                error: true,
                codigo: 503,
                mensaje: 'El jugador ya fue creado previamente'
            };
         } 
        else {
            //En "jugadors" pondra los parametros que se dieron en Post de draw -> Json
            jugadors[jugadors.length] = {
                posicio: jugadors.length+1,
                nom : nombre,
                cognom : apellido,
                score: coins
            };
            // Dira que no hay error, dara el codigo 200, un mensaje de jugador creado y tambien ensenara "jugadors" que esta en las lineas de arriba.
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Jugador creado',
                respuesta: jugadors
            };
        }
    }
    res.send(respuesta);
});


//////////////////////// Añade el Alias desde la URL \\\\\\\\\\\\\\\\\\\\\\\\\

app.post('/jugadors/:alias', function (req, res) {

    var nombre = req.body.nom || null;
    var apellido = req.body.cognom || null;
    var coins = req.body.score || null;
    // Si falta algun parametro dara error.
    if(nombre == null|| apellido == null || coins == null || req.params.alias == null) {
        respuesta = {
            error: true,
            codigo: 502,
            mensaje: 'Camps obligatoris camp nom, cognom, score y posicio'
        };
    } 
    else {
        //Si alguno de los parametros es igual a alguno ya creado dara error
        if(jugadors.nom == nombre && jugadors.cognom == apellido) {
            respuesta = {
                error: true,
                codigo: 503,
                mensaje: 'El jugador ya fue creado previamente'
            };
        } 
        else {
            //En "jugadors" pondra los parametros que se dieron en Post de draw -> Json
            jugadors[jugadors.length] = {
                posicio: jugadors.length+1,
                nom : nombre,
                cognom : apellido,
                score: coins,
                alies: req.params.alias
            };
        // Dira que no hay error, dara el codigo 200, un mensaje de jugador creado y tambien ensenara "jugadors" que esta en las lineas de arriba.
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Jugador creado',
                respuesta: jugadors
            };
        }
    }
    res.send(respuesta);
});





////////////////////////////////////// PUT //////////////////////////////////////

app.put('/jugadors/:alies', function(req,res){

});