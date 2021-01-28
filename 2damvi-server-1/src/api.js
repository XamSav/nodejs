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
//Mensajes de compras
let codeBuy401 = { code: 401, error: false, message: 'Purchase made' };
let codeErrorBuy402 = { code: 402, error: true, message: 'Error: Please specify the alias or the number of billetes to buy'};
let codeErrorBuy403 = { code: 403, error: true, message: "Error: You don't have enough points"};

var players = [
    { position: "1", alias: "jperez", password:"a9993e364706816aba3e25717850c26c9cd0d89d", name: "Jose", surname: "Perez", score: 1000, created: "2020-11-03T15:20:21.377Z", coins: 10, billetes: 0, habilidad1: 0, habilidad2: 1},
    { position: "2", alias: "jsanz", password:"40bd001563085fc35165329ea1ff5c5ecbdbbeef", name: "Juan", surname: "Sanz", score: 950, created: "2020-11-03T15:20:21.377Z", coins: 0, billetes: 0, habilidad1: 1, habilidad2: 0 },
    { position: "3", alias: "mgutierrez", password:"40bd001563085fc35165329ea1ff5c5ecbdbbeef", name: "Maria", surname: "Gutierrez", score: 850, created: "2020-11-03T15:20:21.377Z", coins: 0, billetes: 0, habilidad1: 0, habilidad2: 0 }
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
        }else{
            players = JSON.parse(jsonString);
        }
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

//Get
router.get('/', function (req, res) {
    //code funciona ok
    res.send(code100);
});
//Muestra todos los usuarios.
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
router.get('/login/:alias/:password', function(req,res){
    var paramAlias = req.params.alias || '';
    var paramPassword = req.params.password || '';
    var ok = login(paramAlias, paramPassword);
    if(ok !== false){
        res.send(ok);
    }else if(ok === "ErrorUsuario"){
        res.send("ErrorUsuario");
    }else if(ok === "ErrorContra"){
        res.send("ErrorContra");
    }
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
//Post
router.post('/players/:alias', jsonParser   ,function (req, res) {
    var paramAlias = req.params.alias || '';
    var paramName = req.body.name || '';
    var paramSurname = req.body.surname || '';
    var paramPassword = req.body.password || '';
    var ok = comprobadorDeDatos(paramAlias, paramName, paramSurname, paramPassword);
    if (ok === false) {
        response = "ErrorFalta";
    } else {
        //Player Search
        var index = searcher(paramAlias);

        if (index.thebool === true) {
            //Player allready exists
            response = "ErrorExiste";
            console.log("Existe");
        } else {
            console.log("No Existe");
            //Add Player
            players.push({ 
                position: '', 
                alias: paramAlias, 
                name: paramName, 
                surname: paramSurname,
                password: paramPassword, 
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
            index = searcher(paramAlias);
            //Response return
            response = code201;
            response.player = players[index.theindex];
        }
    }
    res.send(response);

});
//Put
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

//Delete
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
            response = "El jugador "+ paramAlias+ " ha sido eliminado";
            players.splice(index, 1);
            //Sort the ranking
            UpdateRanking();
        }
        else {
            console.log("Error Inexistente");
            response = "ErrorInexistente";
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
        ok = {thebool: true, theindex: index};
    }else{
        ok = {thebool: false, theindex: index};
    }
    return ok;
}
    //Comprueba si la contraseña esta bien (Usar para Api Rest)
function login(paramAlias, paramPassword){
    ok = searcher(paramAlias);
    if(ok.thebool === true){
        if(paramPassword === players[ok.theindex].password){
            return players[ok.theindex];
        }else{
            //Contraseña incorrecta
            return "ErrorContra";
        }
    }
    else{
        //Jugador no existe
        return "ErrorUsuario";
    }
}
    //Comprueba que todos los campos son correctos
function comprobadorDeDatos(paramAlias, paramName, paramSurname, paramPassword/*paramScore*/){
    getjson();
    var hey = false;
    if (paramAlias === '' || paramName === '' || paramSurname === '' || paramPassword === ''){/*parseInt(paramScore) <= 0 || paramScore === '' || isNaN(paramScore) || paramScore === null*/
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
    //Top 10 Jugadores
function topJugadores(i){
    getjson();
    response = players[i];
    return response;
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
        if(players[index].billetes < 1){
            response = codeErrorBuy403;
        }
        else{
            var precio = 1;
            var ganancia = 5;
            players[index].billetes -= precio;
            players[index].coins += ganancia;
            let jugadorjson = {
                alias: players[index].alias,
                coins: players[index].coins,
                billete: players[index].billetes,
            }
            response = jugadorjson;
            savejson();
            getjson();
            //console.log(players[index].coins)
        }
        return response;
}
/// NUEVAS MONEDAS
function newCoins(data){
    if(data.alias === '' || data.coins === ''){
        return false;
    }
    else{
        var ok = searcher(data.alias);
        if(ok.thebool){
            players[ok.theindex].coins += data.coins;
            response = players[ok.theindex].coins;
            savejson();
            getjson();
        }else{
            response = false;
        }
        return response;
    }
}
function newBillete(data){
    if(data.alias === '' || data.billetes === ''){
        return false;
    }
    else{
        var ok = searcher(data.alias);
        if(ok){
            if(players[ok.index].alias < 1){
                response = codeError504;
            }
            else{
                players[ok.index].billetes += data.billetes;
                response = players[ok.index].billetes;
                savejson();
                getjson();
            }
        }else{
            response = false;
        }
        return response;
    }
}
/// COMPRAR HABILIDAD
function updatePower(data){

    if(data.habilidad1 && !data.habilidad2){
        getjson();
        var ok = searcher(data.alias);
        if(players[ok.theindex].habilidad1 < 2 && players[ok.theindex].coins >= 5){
            players[ok.theindex].habilidad1++;
            response = players[ok.theindex].habilidad1
            savejson();
            getjson();
        }else{
            response = {
                message: "Error",
                error: true
            };
        }
    }else if(data.habilidad2 && !data.habilidad1){
        getjson();
        var ok = searcher(data.alias);
        if(players[ok.theindex].habilidad1 < 2 && players[ok.theindex].coins >= 5){
            players[ok.theindex].habilidad2 + 1;
            response = { 
                player: players[ok.theindex].habilidad2,
                error: false
            };
            savejson();
            getjson();
        }else{
            response = {
                message: "Error",
                error: true
            };
        }
    }
    return response;
}
function updateScore(data){
    getjson();
    var ok = searcher(data);
    if(ok.thebool){
        players[ok.theindex].score += 5;
        savejson();
        response = players[ok.theindex];
        UpdateRanking();
    }
    else{
        response = "error";
    }
    //savejson();
    return response;
}
module.exports = router;
///Comprobantes
module.exports.searcher = searcher;
module.exports.comprobadorDeDatos = comprobadorDeDatos;
//module.exports.comprobarcontra = comprobarcontra;
//Acciones
    //Obtener
        //Solo 1
module.exports.enviarJugador = enviarJugador;
        //Todos
module.exports.enviarJugadores = enviarJugadores;
        //Top 10
module.exports.topJugadores = topJugadores;
    //Actualizar
        //Todo del jugador
module.exports.updatePlayer = updatePlayer;
        //Comprar Monedas
module.exports.buyCoins = buyCoins;
        //El Jugador consiguio Coins
module.exports.newCoins = newCoins;
        //El Jugador consiguio Billetes
module.exports.newBillete = newBillete;
        //Aumentar habilidad
module.exports.updatePower = updatePower;
module.exports.updateScore = updateScore;