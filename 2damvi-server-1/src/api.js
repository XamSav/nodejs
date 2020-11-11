const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mongoose = require('mongoose'),
Schema = mongoose.Schema;


let code100 = { code: 100, error: false, message: '2-DAMVI Server Up' };
let code200 = { code: 200, error: false, message: 'Player Exists' };
let code201 = { code: 201, error: false, message: 'Player Correctly Created' };
let code202 = { code: 202, error: false, message: 'Player Correctly Updated' };
let codeError502 = { code: 502, error: true, message: 'The field: name, surname, score are mandatories (the score value has to be >0)' };
let codeError503 = { code: 503, error: true, message: 'Error: Player Exists' };
let codeError504 = { code: 504, error: true, message: 'Error: Player not found' };

var players = [
    { position: "1", alias: "jperez", name: "Jose", surname: "Perez", score: 1000, created: "2020-11-03T15:20:21.377Z"},
    { position: "2", alias: "jsanz", name: "Juan", surname: "Sanz", score: 950, created: "2020-11-03T15:20:21.377Z" },
    { position: "3", alias: "mgutierrez", name: "Maria", surname: "Gutierrez", score: 850, created: "2020-11-03T15:20:21.377Z" }
];
let response = {
    error: false,
    code: 200,
    message: ''
};


function UpdateRanking() {
    //Order the ranking
    players.sort((a, b) => (a.score <= b.score) ? 1 : -1);

    //Position Update
    for (var x = 0; x < players.length; x++) {
        players[x].position = x + 1;
    }
};

app.get('/', function (req, res) {
    //code funciona ok
    res.send(code100);
});

app.get('/ranking', function (req, res) {
    let ranking = { namebreplayers: players.length, players: players };
    res.send(ranking);
});
app.get('/players', function (req, res){
    res.send(players);
});
app.get('/players/:alias', function (req, res) {
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

app.post('/players/:alias', function (req, res) {
    var paramAlias = req.params.alias || '';
    var paramName = req.body.name || '';
    var paramSurname = req.body.surname || '';
    var paramScore = req.body.score || '';

    if (paramAlias === '' || paramName === '' || paramSurname === '' || parseInt(paramScore) <= 0 || paramScore === '') {
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
                score: paramScore ,
                created: new Date()
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

app.put('/players/:alias', function (req, res) {
    var paramalias = req.params.alias || '';
    var paramname = req.body.name || '';
    var paramsurname = req.body.surname || '';
    var paramScore = req.body.score || '';

    if (paramalias === '' || paramname === '' || paramsurname === '' || parseInt(paramScore) <= 0 || paramScore === '') {
        response = codeError502; //Paràmetres incomplerts
    } else {
        //Player Search
        var index = players.findIndex(j => j.alias === paramalias)

        if (index != -1) {
            //Update Player
            players[index] = { 
                position: '', 
                alias: paramalias, 
                name: paramname, 
                surname: paramsurname, 
                score: paramScore,
                created:  players[index].created,
                updated: new Date()
            };
            //Sort the ranking
            UpdateRanking();
            //Search Player Again
            index = players.findIndex(j => j.alias === paramalias);
            //Response return
            response = code202;
            response.jugador = players[index];
            
        } else {
            response = codeError504;
        }
    }
    res.send(response);
});



var postPlayer = function (req, res, next) {
    var player = new Player(req.body);
  
    player.save(function (err) {
      if (err) {
        next(err);
      } else {
        res.json(player);
      }
    });
  };
  
  var putPlayer = function (req, res, next) {
    Player.findByAliasAndUpdate(req.body.alias, req.body, {new: true}, function (err, player) {
      if (err) {
        next(err);
      } else {
        res.json(player);
      }
    });
  };
  
  var deletePlayer = function (req, res, next) {
    req.player.remove(function (err) {
      if (err) {
        next(err);
      } else {
        res.json(req.player);
      }
    });
  };
  
  var getAllPlayers = function (req, res, next) {
    Player.find(function (err, players) {
      if (err) {
        next(err);
      } else {
        res.json(players);
      }
    });
  };
  
  var getOnePlayer = function (req, res) {
    res.json(req.player);
  };
  
  var getByAliasPlayer = function (req, res, next, Alias) {
    Player.findOne({_Alias: Alias}, function (err, player) {
      if (err) {
        next(err);
      } else {
        req.player = player;
        next();
      }
    });
  };
  
  var PlayerSchema = new Schema({
    position: {type: Number},
    alias: {type: String, required: true},
    name: {type: String},
    surname: {type: String},
    score: {type: Number},
    created: {type: String}
  });
  
  mongoose.model('Player', PlayerSchema);
  var Player = require('mongoose').model('Player');

  router.route('/players')
.post(postPlayer)
.get(getAllPlayers);

router.route('/players/:alias')
.get(getOnePlayer)
.put(putPlayer)
.delete(deletePlayer);

router.param('alias', getByAliasPlayer);

module.exports = app;
