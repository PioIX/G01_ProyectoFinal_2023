let nameRoom;
let indexUser;
let correct; 

function joinRoom(){
    document.getElementById('converti').style.display = 'none'
    document.getElementById('serda').style.display = 'block'
    socket.emit("joinroom")
}

function guessWord(){
    socket.emit("guessWord")
}

socket.on('win-game', () =>{
    console.log('a')
})
socket.on('lost-game', () =>{
    console.log('a')
})
socket.on('keep-playing', () =>{
    console.log('a')
})


socket.on('nameRoom', (data) =>{
    nameRoom = data.room;
    indexUser = data.index;
})

socket.on('start', () =>{
    document.getElementById('serda').style.display = 'none'
    document.getElementById('moya').style.display = 'block'
    inicio();
})