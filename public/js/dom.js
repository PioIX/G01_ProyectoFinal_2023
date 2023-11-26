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


function changeScreen(){
  location.href="/modoMultijugador"
}