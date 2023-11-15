let top5 = []

async function showLeaders() {
    top5 = await fetchLeaderboard()
    console.log('hola')
    console.log(top5)


    /*imagenes = await fetchImagenes()
    let relatedImage = imagenes[randomNumber].imagen
    var img = document.createElement('img'); 
    img.classList.add('relatedImage')
    img.src = `${relatedImage}`; 
    document.body.appendChild(img); */
    
}