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

async function fetchPuntaje() {    
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