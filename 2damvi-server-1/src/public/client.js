const socket = io();

let alias = document.getElementById('alias');
let name = document.getElementById('name');
let surname = document.getElementById('surname');
let score = document.getElementById('score');

var btn = document.getElementById('send');

//Enviar datos al servidor


btn.addEventListener('click', function(){
    socket.emit('player:create',{
        alias: alias.value,
        name: name.value,
        surname: surname.value,
        score: score.value
    });
});

//Se puede enviar al servidor un dato a secas.
alias.addEventListener('keypress', function(){
    socket.emit('player:onlyadata',surname.value);
});

socket.on('server:playercreated', (data) =>
    console.log(data)
);
socket.on('server:response', function(data){
    //Para acceder a un dato seria "data.alias"
});
