

io.on("connection", socket => {
    socket.join("some room");
    //esto es de multiplayer
    let resultElement = document.querySelector('.result')
    let mainContainer = document.querySelector('.main-game-container')
    let rowId = 1;



        let palabras = []
        let imagenes = []



    async function getRandomInt() {
        palabras = await fetchPalabras()
        console.log(palabras)
        let randomNumber = Math.floor(Math.random() * palabras.length)
        cargarPalabras(randomNumber);


        imagenes = await fetchImagenes()
        let relatedImage = imagenes[randomNumber].imagen
        var img = document.createElement('img'); 
        img.classList.add('relatedImage')
        img.src = `${relatedImage}`; 
        document.body.appendChild(img); 
            
    }





            
    let word;
    let wordArray = []
    let actualRow;

    function inicio() {
        getRandomInt()
    }



    function cargarPalabras(random) {
        word = palabras[random].nombre_item
        console.log(word)
        wordArray = word.toUpperCase().split('');
        console.log(wordArray)

        actualRow = document.querySelector('.row')

        drawSquares(actualRow);
        listenInput(actualRow);

        addfocus(actualRow);
        
    }

    function listenInput(actualRow){
        let squares= actualRow.querySelectorAll('.square');
        squares = [...squares];

        let userInput = []

        squares.forEach(element =>{
            element.addEventListener('input', event=>{
                if(event.inputType !== 'deleteContentBackward'){
                    userInput.push(event.target.value.toUpperCase())
                    
                    if(event.target.nextElementSibling){
                        event.target.nextElementSibling.focus();
                    }else{


                        let squaresFilled = document.querySelectorAll('.square')
                        squaresFilled = [...squaresFilled]
                        let lastFiveSquaresFilled = squaresFilled.slice(-(word.length));
                        let finalUserInput = []
                        lastFiveSquaresFilled.forEach(element => {
                            finalUserInput.push(element.value.toUpperCase())
                        });

                    


                        let existIndexArray = existLetter(wordArray, finalUserInput)
                        console.log(existIndexArray)
                        existIndexArray.forEach(element =>{

                            squares[element].classList.add('grey');
                        })
                        let rightIndex = compareArrays(wordArray, finalUserInput)
                        console.log(rightIndex)
                        rightIndex.forEach(element => {
                            squares[element].classList.add('grey')
                        })
                        if(rightIndex.length == wordArray.length){
                            addPoints()
                            rightIndex.forEach(element => {
                                squares[element].classList.add('green')
                            });
                            showResult(`Correcto, era un/a "${word.toUpperCase()}"`)
                            return;
                        }
                
                        let actualRow = createRow()
                        
                        if(!actualRow){
                            return
                        }

                        drawSquares(actualRow)
                        listenInput(actualRow)
                        addfocus(actualRow)


                        


                
                    }
                }else{
                    userInput.pop()
                }
                console.log(userInput)
                
            })
        })
    }




    // FUNCIONES

    function compareArrays(array1, array2){
        let equalsIndex= []
        array1.forEach((element, index)=>{
            if(element == array2[index]){
                console.log(`En la posicion ${index} si son iguales`);
                equalsIndex.push(index);
            }else{
                console.log(`En la posicion ${index} NO son iguales`);
            }
        });
        return equalsIndex;
    }

    function existLetter(array1, array2){
        let existIndexArray = [];
        array2.forEach((element, index)=>{
            if(array1.includes(element)){
                existIndexArray.push(index);
            }
        });
        return existIndexArray;
    }


    function createRow(){
        rowId++
        if (rowId <= 3) {
            let newRow = document.createElement('div');
            newRow.classList.add('row');
            newRow.setAttribute('id', rowId)
            mainContainer.appendChild(newRow)
            return newRow;
        }else{
            showResult(`Mal allá, re perdiste amigo, si fueras piola hubieras sabido que la respuesta era "${word.toUpperCase()}"`)
            //Esto es de multiplayer
            io.on("connection", socket => {
                socket.on("disconnecting", () => {
                  console.log(socket.rooms); // the Set contains at least the socket ID
                });
              
                socket.on("disconnect", () => {
                  // socket.rooms.size === 0
                });
              });
        }
        
    }

    function drawSquares(actualRow){
        wordArray.forEach((item, index) => {
            if(index === 0){
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`
            }else{
                actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`
            }
            
        })
    }

    function addfocus(actualRow){
        let focusElement = actualRow.querySelector('.focus')
        focusElement.focus()
    }

    function showResult(textMsg){
        resultElement.innerHTML = `
                        <p>${textMsg}</p> 
                        <button id="game-button" class="button">Reiniciar</button>`

        let resetBtn = document.querySelector('.button')
        resetBtn.addEventListener('click', ()=>{
            location.reload();
        });
    }

    async function addPoints(){
        puntos = await fetchPuntaje()
        
        console.log(puntos)
    }

});