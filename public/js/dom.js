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

async function fetchPreguntas() {    
  try {
    const response = await fetch("/trivia", {
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

async function fetchRespuestas() {    
  try {
    const response = await fetch("/trivia", {
      method: 'PUT', // or 'PUT', 
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

async function fetchLeaderboard() {    
  try {
    const response = await fetch("/leaderboard", {
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