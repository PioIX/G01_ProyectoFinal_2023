const socket = io()
async function fetchPalabras() {    
  try {
    const response = await fetch("/modoSolitario", {
      method: 'POST', // or 'PUT', 
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    const result = await response.json();
  
    return result
   
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchImagenes() {    
  try {
    const response = await fetch("/modoSolitario", {
      method: 'PUT', 
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    const result = await response.json();
  
    return result
   
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchPuntaje() {    
  try {
    const response = await fetch("/ranking", {
      method: 'POST', // or 'PUT', 
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    const result = await response.json();
  
    return result
   
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchMultiplayer() {    
  try {
    const response = await fetch("/modoMultijugador", {
      method: 'POST', // or 'PUT', 
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    const result = await response.json();
  
    return result
   
  } catch (error) {
    console.error("Error:", error);
  }
}

function joinRoom(data){
  console.log(data)
  socket.emit('join-room', data)
}


async function fetchSala() {    
  try {
    const response = await fetch("/espera", {
      method: 'POST', // or 'PUT', 
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    const result = await response.json();
  
    return result
   
  } catch (error) {
    console.error("Error:", error);
  }
}

function joinRoom(data){
  console.log(data)
  socket.emit('join-room', data)
}





async function fetchPartidas() {    
  try {
    const response = await fetch("/partidas", {
      method: 'POST', // or 'PUT', 
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    const result = await response.json();
  
    return result
   
  } catch (error) {
    console.error("Error:", error);
  }
}

function room(data){
  socket.emit('join-room', data)
}


const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
 console.log('Connected to server');

 ws.send('Hello, server!');
});

ws.on('message', (message) => {
 console.log(`Received: ${message}`);
});

ws.on('close', () => {
 console.log('Disconnected from server');
});


/*socket.on('room', (data)=>{
  socket.join(data)
  if(rooms[rooms.length-1].room.length == 2){
      io.to(data).emit('start')
      fetchSala()
  }
  io.to(socket.id).emit('confirm-room')
})

*/

function changeScreen(){
  location.href="/modoMultijugador"
}