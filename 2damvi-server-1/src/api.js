const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var router = express.Router();
const fs = require('fs'); 
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
let code100 = { code: 100, error: false, message: '2-DAMVI Server Up' };
let code200 = { code: 200, error: false, message: 'Player Exists' };
let code201 = { code: 201, error: false, message: 'Player Correctly Created' };
let code202 = { code: 202, error: false, message: 'Player Correctly Updated' };
let code203 = { code: 203, error: false, message: 'Player Correctly Deleted' };
let codeError502 = { code: 502, error: true, message: 'The field: name, surname, score are mandatories (the score value has to be >0)' };
let codeError503 = { code: 503, error: true, message: 'Error: Player Exists' };
let codeError504 = { code: 504, error: true, message: 'Error: Player not found' };
//Mensajes de compras
let codeBuy401 = { code: 401, error: false, message: 'Purchase made' };
let codeErrorBuy402 = { code: 402, error: true, message: 'Error: Please specify the alias or the number of billetes to buy'};
let codeErrorBuy403 = { code: 403, error: true, message: "Error: You don't have enough points"};

var CatalogoHabilidades = [
    {nombre: "Bola de fuego", id: 1},
    {nombre: "Flash", id: 2 }
];

var players = [
    { position: "1", alias: "jperez", name: "Jose", surname: "Perez", score: 1000, created: "2020-11-03T15:20:21.377Z", coins: 0, billetes: 0, habilidad1: 0, habilidad2: 0},
    { position: "2", alias: "jsanz", name: "Juan", surname: "Sanz", score: 950, created: "2020-11-03T15:20:21.377Z", coins: 0, billetes: 0, habilidad1: 0, habilidad2: 0 },
    { position: "3", alias: "mgutierrez", name: "Maria", surname: "Gutierrez", score: 850, created: "2020-11-03T15:20:21.377Z", coins: 0, billetes: 0, habilidad1: 0, habilidad2: 0 }
];
let response = {
    error: false,
    code: 200,
    message: ''
};
function savejson(){
    const str = JSON.stringify(players);
    fs.writeFile('./src/player.json', str,'utf8', (err) => { 
        if (err) throw err; 
        console.log('The file has been saved!'); 
    });
}
function getjson(){
    fs.readFile('./src/player.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        players = JSON.parse(jsonString);
    })
}


getjson();
function UpdateRanking() {
    //Order the ranking
    players.sort((a, b) => (a.score <= b.score) ? 1 : -1);
    //Position Update
    for (var x = 0; x < players.length; x++) {
        players[x].position = x + 1;
    }
    savejson();
    getjson();
};

router.get('/', function (req, res) {
    //code funciona ok
    res.send(code100);
});
router.get('/ranking', function (req, res) {
    UpdateRanking();
    let ranking = { namebreplayers: players.length, players: players };
    res.send(ranking);
});
router.get('/players/:alias', function (req, res) {
    //Player Search
    var index = players.findIndex(j => j.alias === req.params.alias);

    if (index >= 0) {
        //Player exists
        response = code200;
        response.jugador = players[index];
    } else {
        //Player doesn't exists
        response = codeError504;
    }
    res.send(response);
});
router.post('/players/:alias', jsonParser   ,function (req, res) {
    var paramAlias = req.params.alias || '';
    var paramName = req.body.name || '';
    var paramSurname = req.body.surname || '';
    if (paramAlias === '' || paramName === '' || paramSurname === '') {
        response = codeError502;
    } else {
        //Player Search
        var index = players.findIndex(j => j.alias === paramAlias)

        if (index != -1) {
            //Player allready exists
            response = codeError503;
        } else {
            //Add Player
            players.push({ 
                position: '', 
                alias: paramAlias, 
                name: paramName, 
                surname: paramSurname, 
                score: 0,
                created: new Date(),
                coins: 10,
                billetes: 5,
                habilidad1: 0,
                habilidad2: 0
            });
            //Sort the ranking
            UpdateRanking();
            //Search Player Again
            index = players.findIndex(j => j.alias === paramAlias);
            //Response return
            response = code201;
            response.player = players[index];
        }
    }
    res.send(response);

});
router.put('/players/:alias',jsonParser, function (req, res) {
    var paramAlias = req.params.alias || '';
    var paramName = req.body.name || '';
    var paramSurname = req.body.surname || '';
    var paramScore = req.body.score || '';

    if (paramAlias === '' || paramName === '' || paramSurname === '' || parseInt(paramScore) <= 0 || paramScore === '') {
        response = codeError502; //Paràmetres incomplerts
    } else {
        response = updatePlayer(paramAlias, paramName, paramSurname, paramScore);
    }
    res.send(response);
});

//Borrar jugador by https://www.codegrepper.com/code-examples/c/delete+array+item+by+id+using+app.delete
router.delete('/players/:alias', function(req,res){
    var paramAlias = req.params.alias || '';
    if (paramAlias === '') {
        response = codeError502; //Paràmetres incomplerts
    } 
    else{
        getjson();
        //Player Search
        var index = players.findIndex(j => j.alias === paramAlias);
        var playerIndex = players.indexOf("Jugador");
        if (index != -1) {
            console.log("The player "+ paramAlias+" has ben deleted");
            response = code203;
            players.splice(index, 1);
            //Sort the ranking
            UpdateRanking();
        }
        else {
            response = codeError504;
        }
    }
    res.send(response);
});

//Comprar monedas con billetes
router.get('/buycoins/:alias', function(req,res){
    var paramAlias = req.params.alias || '';
    var parambilletes = req.body.billetes || '';
    if (paramAlias === '' || parambilletes === '') {
        response = codeErrorBuy402;
    }
    else{
        var index = players.findIndex(j => j.alias === paramAlias)
        //Supongamos xk no tengo ni idea, que con 1 billetes se pilla 5 monedas. pos eso
        if(players[index].billetes < 1){
            response = codeErrorBuy403;
        }
        else{
            var precio = 1;
            var ganancia = 5;
            players[index].billetes -= precio;
            players[index].coins += ganancia;
            response = codeBuy401;
            response.jugador = players[index];
            savejson();
            getjson();
        }
    }
    res.send(response);
});




////////////////FUNCIONES/////////////////////

/////COMPROBANTES/////
    //Busca si el jugador que pide existe o no.
function searcher(data) {
    getjson();
    //El data.alias es el alias que envia el cliente (lo se por que hice un console 7.7)
    var index = players.findIndex(j => j.alias === data)
    var ok = false;
    //Si lo encuentra es false sino true
    if (index != -1) {
        ok = true;
        //console.log("El jugador "+ data +" existe")
    }else{
        ok = false;
        //console.log("El jugador "+ data +" no existe")
    }
    return ok;
}
    //Comprueba que todos los campos son correctos
function comprobadorDeDatos(paramAlias, paramName, paramSurname, paramScore){
    getjson();
    var hey = false;
    if (paramAlias === '' || paramName === '' || paramSurname === '' || parseInt(paramScore) <= 0 || paramScore === '' || isNaN(paramScore) || paramScore === null){
        hey = false;
    }else{
        hey = true;
    }
    return hey;
}


/////ACCIONES/////
    //OBTENER
        //SOLO 1 JUGADOR
    function enviarJugador(data){
        getjson();
        if(data < 0 || data > players.length){
            data = false;
            return data;
        }else{
        return players[data];
        }
    }
        //TODOS LOS JUGADORES
    function enviarJugadores(){
        getjson();
        return players;
    }
    //EDITAR
        //Actualizar cualquier cosa del jugador
function updatePlayer(paramAlias, paramName, paramSurname, paramScore){
    getjson();
    if (paramAlias === '' || paramName === '' || paramSurname === '' || parseInt(paramScore) <= 0 || paramScore === ''){
        response = codeError502
    }else{
    //Player Search
    var index = players.findIndex(j => j.alias === paramAlias)

    if (index != -1) {
        //Update Player
        players[index] = { 
            position: '', 
            alias: paramAlias, 
            name: paramName, 
            surname: paramSurname, 
            score: paramScore,
            created:  players[index].created,
            updated: new Date(),
            coins: 10,
            billetes: 5,
            habilidad1: 0,
            habilidad2: 0
        };
        //Sort the ranking
        UpdateRanking();
        //Search Player Again
        index = players.findIndex(j => j.alias === paramAlias);
        //Response return
        response = code202;
        response.jugador = players[index];
    } else {
        response = codeError504;
    }
}
    return response;
}
    //COMPRAR MONEDAS
function buyCoins(paramAlias){
    var index = players.findIndex(j => j.alias === paramAlias)
        //Supongamos xk no tengo ni idea, que con 1 billetes se pilla 5 monedas. pos eso
        if(players[index].billetes < 1){
            response = codeErrorBuy403;
        }
        else{
            var precio = 1;
            var ganancia = 5;
            players[index].billetes -= precio;
            players[index].coins += ganancia;
            response.jugador = players[index];
            savejson();
            getjson();
            console.log(players[index].coins)
        }
        return response;
}
 



/*module.exports = {
    //app,
    searcher,
    router
}*/
module.exports = router;
///Comprobantes
module.exports.searcher = searcher;
module.exports.comprobadorDeDatos = comprobadorDeDatos;
//Acciones
    //Obtener
        //Solo 1
module.exports.enviarJugador = enviarJugador;
        //Todos
module.exports.enviarJugadores = enviarJugadores;
    //Actualizar
        //Cualquier cosa del jugador
module.exports.updatePlayer = updatePlayer;
        //Comprar Monedas
module.exports.buyCoins = buyCoins;
    //Eliminar