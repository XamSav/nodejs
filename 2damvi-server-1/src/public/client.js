const socket = io();

let alias = document.getElementById('alias');
let name = document.getElementById('name');
let surname = document.getElementById('surname');
let score = document.getElementById('score');


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
message.addEventListener('keypress', function(){
    socket.emit('player:onlyadata',surname.value);
});


socket.on('server:response', function(data){
    //Para acceder a un dato seria "data.alias"
});