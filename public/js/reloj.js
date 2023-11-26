function relojAnalogico(divReloj)
{  
  function crearReloj(divReloj) {


  var relojEsfera = document.createElement('div');
  relojEsfera.id = 'relojEsfera';
  relojEsfera.class= 'reloj relojEsfera';
  divReloj.appendChild(relojEsfera);
  relojEsfera.style.position = 'relative';
  relojEsfera.style.top = '1%';
  relojEsfera.style.width = '83%';
  relojEsfera.style.height = '83%';
  relojEsfera.style.border = '10px solid white';
  relojEsfera.style.borderRadius = '50%';
  relojEsfera.style.left = (divReloj.offsetWidth/2) -  (relojEsfera.offsetWidth/2) +'px';
  

  var segundos = document.createElement('div');
  segundos.id = 'relojSegundos';
  segundos.class = 'reloj manecillas segundos';
  relojEsfera.appendChild(segundos);
  segundos.style.border = '3px solid white';
  segundos.style.position = 'absolute';
  segundos.style.left = '50%';
  segundos.style.bottom = '50%';
  segundos.style.height = '45%';
  segundos.style.width = '0';
  segundos.style.transformOrigin = '50% 100%';
  segundos.style.transition = 'transform 1s ease';


  var minutos = document.createElement('div');
  minutos.id = 'relojMinutos';
  minutos.class = 'reloj manecillas minutos';
  relojEsfera.appendChild(minutos);
  minutos.style.border = '3px solid white';
  minutos.style.position = 'absolute';
  minutos.style.left = '50%';
  minutos.style.bottom = '50%';
  minutos.style.height = '35%';
  minutos.style.width = '0';
  minutos.style.transformOrigin = '50% 100%';
  minutos.style.transition = 'transform 1s ease';
    

  var horas = document.createElement('div');
  horas.id = 'relojHoras';
  horas.class = 'reloj manecillas horas';
  relojEsfera.appendChild(horas);
  horas.style.border = '3px solid red';
  horas.style.position = 'absolute';
  horas.style.left = '50%';
  horas.style.bottom = '50%';
  horas.style.height = '25%';
  horas.style.width = '0';
  horas.style.transformOrigin = '50% 100%';
  horas.style.transition = 'transform 1s ease';
    

  var horad = document.createElement('div');
  horad.id = 'horad';
  horad.class= 'reloj horad';
  divReloj.appendChild(horad);
  horad.style.position = 'relative';
  horad.style.height = '13%';
  horad.style.top = '2%';
  horad.style.textAlign = 'center';
  horad.style.color = 'white';
  horad.style.fontSize = '500%';
  
  }  
  
  function crearHoraReferencia() {
    var tiempoI = new Date();
    var tiempoS = tiempoI.getSeconds();
    var tiempoM = tiempoI.getMinutes() * 60 + tiempoS;
    var tiempoH = tiempoI.getHours() % 12 * 3600 + tiempoM;
    
    var horaRef = {horaRef : tiempoI, segundosRef : tiempoS, minutosRef : tiempoM, horasRef: tiempoH };
    return horaRef;
    
  }
  
  function calcularHora() {
    var tiempo = new Date();
    return tiempo;
  }
  
  function calcularRotacionManecillas(horaRef, horaActual) {    
    var diferencia = Math.round(Math.abs(horaActual.getTime()-horaRef.horaRef.getTime()) / 1000);
    var rotarSegundos = ((horaRef.segundosRef + diferencia) / 60 * 360);
    var rotarMinutos = ((horaRef.minutosRef + diferencia) / 3600 * 360);
    var rotarHoras = ((horaRef.horasRef + diferencia) / 43200 * 360);  
    
    rotarManecillas(rotarSegundos, rotarMinutos, rotarHoras)
  }
  
  function rotarManecillas(rotSeg, rotMin, rotHor)
  {
      document.getElementById('relojSegundos').style.transform='rotate('+ rotSeg +'deg)';
      document.getElementById('relojMinutos').style.transform='rotate('+ rotMin +'deg)';
      document.getElementById('relojHoras').style.transform='rotate('+ rotHor +'deg)';
  }
  
  function mostrarHora(tiempo) {
    var segundos = tiempo.getSeconds();
    var minutos = tiempo.getMinutes();
    var horas = tiempo.getHours();
    var hora = document.getElementById('horad');
    if ( segundos < 10 )
    {
      segundos = '0'+segundos;
    }
    
    if ( minutos < 10 )
    {
      minutos = '0'+minutos;
    }
    
    if ( horas < 10 )
    {
      horas = '0'+horas;
    }
    
    hora.innerHTML =   horas + ' : ' + minutos + ' : ' + segundos;
  }
  
  function actualizarReloj (horaRef, horaActual)
  {
    mostrarHora(horaActual);
    calcularRotacionManecillas(horaRef, horaActual)
  }
  
  crearReloj(divReloj);
  var horaRef = crearHoraReferencia();
  actualizarReloj(horaRef,calcularHora())
  setInterval(function() {actualizarReloj(horaRef,calcularHora())},1);
}

relojAnalogico(document.getElementById('relojAnalogico'));