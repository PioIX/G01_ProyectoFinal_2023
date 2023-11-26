const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} = require("firebase/auth");


/*-------------------------------------------*/

let userOnline = {};
let roomsOnline = {roomtest: [1,2]};
let roomCounter = 0;


const express = require("express");
const exphbs = require("express-handlebars");
const session = require('express-session');
const bodyParser = require('body-parser'); 
const MySQL = require('./modulos/mysql'); 
const app = express();
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.engine('handlebars', exphbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars'); 

const server = app.listen(3000, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + 3000 + '/');
});

const io = require('socket.io')(server);

const sessionMiddleware = session({
    secret: 'sararasthastka',
    resave: true,
    saveUninitialized: false,
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


/*-------------------------------------------*/


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCqRWOVH1NzerF8TRUpV9rzxTyBb1dTinc",
  authDomain: "speedcraft-5bf83.firebaseapp.com",
  projectId: "speedcraft-5bf83",
  storageBucket: "speedcraft-5bf83.appspot.com",
  messagingSenderId: "1099105630103",
  appId: "1:1099105630103:web:ab343ed31878d78e88f6d2"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

// Importar AuthService
const authService = require("./authService");


app.get("/register", (req, res) => {
  res.render("register");
});


app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/modoSolitario", (req, res) => {
  res.render("modoSolitario");
});

app.get("/modoMultijugador", (req, res) => {
  res.render("modoMultijugador");
});

app.get("/menu", (req, res) => {
  res.render("menu");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

app.get("/ranking", (req, res) => {
  res.render("ranking");
});

app.get("/guia", (req, res) => {
  res.render("guia");
});

app.get("/papu", (req, res) => {
  res.render("papu");
});

app.get("/elegirmodo", (req, res) => {
  res.render("elegirmodo");
});

app.get("/partidas", async (req, res) => {
    let rooms = await MySQL.realizarQuery(`SELECT * FROM Rooms`)
    res.render("partidas", {room: rooms});
  });
app.get("/elegirjuego", (req, res) => {
    res.render("elegirjuego");
});

app.get("/trivia", (req, res) => {
    res.render("trivia");
});

app.get("/leaderboard", (req, res) => {
    res.render("leaderboard");
});

app.get("/admin", (req, res) => {
    res.render("admin");
});

app.get("/reloj", (req, res) => {
    res.render("reloj");
});

app.get("/mobs", (req, res) => {
    res.render("mobs");
});


/* -------------------------- CHAT ----------------------------- */


function obtainKey(data, value){
    let values = Object.values(data);
    let keys = Object.keys(data)
    for (let i = 0; i<=values.length; i++){
        if (values[i] == value){
            return keys[i];
        }
    }
}

function lstRooms() {
    console.log(io.sockets.adapter.rooms)
}

function checkRoom(user, user2){
    let values = Object.values(roomsOnline)
    for (let i = 0; i < values.length; i++) {
        if (values[i].includes(user2) && values[i].includes(user)){
            return i;
        }
    }
    return null;
}


io.on('connection', (socket) =>{
    socket.on("disconnect", async () => {
        delete userOnline[obtainKey(userOnline, socket)]
    });

    socket.on("joinroom", async () =>{
        if (Object.values(roomsOnline)[Object.values(roomsOnline).length-1].length == 2){
            roomCounter++
            socket.join('room'+roomCounter)
            roomsOnline['room'+roomCounter] = [socket.id]
            io.to(socket.id).emit('nameRoom', {room: 'room'+roomCounter, index: 0})
        } else if (Object.values(roomsOnline)[Object.values(roomsOnline).length-1].length == 1) {
            socket.join(Object.keys(roomsOnline)[Object.keys(roomsOnline).length-1])
            roomsOnline[Object.keys(roomsOnline)[Object.keys(roomsOnline).length-1]].push(socket.id)
            io.to(socket.id).emit('nameRoom', {room: 'room'+roomCounter, index: 1})
            io.to(Object.keys(roomsOnline)[Object.keys(roomsOnline).length-1]).emit('start')
        }
    })

    socket.on("guess-word", async (data) =>{
        if (data.correct == 3){
            io.to(roomsOnline[data.nameRoom][data.indexUser]).emit('win-game')
            if (data.indexUser == 0){
                io.to(roomsOnline[data.nameRoom][1]).emit('lost-game')
            } else {
                io.to(roomsOnline[data.nameRoom][0]).emit('lost-game')
            }
        } else {
            io.to(roomsOnline[data.nameRoom]).emit('keep-playing')
        }
    })
})

app.get('/', async function(req, res){
    res.render('login', null);
});

app.post('/login', async function(req,res){
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Users WHERE user = "${req.body.username}" AND password = "${req.body.password}"; `);
    if (req.body.username=='admin', req.body.password=='1717'){
        res.send({status:'admin'})
    }
    else{
        if (respuesta.length > 0){
            req.session.user = req.body.username;
            res.send({status: true})
        } else {
            res.send({status: false})
        }
    }

})

app.post('/register', async function(req, res){
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Users WHERE user = "${req.body.username}";`);
    if (respuesta.length === 0){
        req.session.user = req.body.username;
        await MySQL.realizarQuery(`INSERT INTO Users (user, password, name) VALUES ("${req.body.username}", "${req.body.password}", "${req.body.name}");`);
        res.send({status: true})
    } else {
        res.send({status: false})
    }
});

io.on('connection', (socket) =>{
    socket.on('add-user', (data) => {
        socket.broadcast.emit("add-user", data);
    })
    socket.on('login-register', (data) => {
        userOnline[data] = socket;
    })

    socket.on('relog', async (data) => {
        userOnline[data] = socket;        
        let respuesta = await MySQL.realizarQuery(`SELECT * FROM Users;`);
        let users = Object.keys(userOnline);
        for (let i = 0; i<respuesta.length; i++){
            if (users.includes(respuesta[i].user)){
                respuesta[i].online = true;
            }
        }
        let online = respuesta.filter(p => p.online==true)
        let not_online = respuesta.filter(p => p.online!=true)
        let new_respuesta = online.concat(not_online)
        socket.emit("relog", {respuesta: new_respuesta});
    })

    socket.on('room', async (data)=>{
        let keys = Object.keys(roomsOnline);
        let position = checkRoom(data.user, data.user2);
        let room  = keys[position];
        if (position == null){
            let roomName = "room" + roomCounter;
            roomCounter ++;
            socket.join(roomName);
            if (userOnline[data.user2]!=undefined){
                userOnline[data.user2].join(roomName);
            }
            roomsOnline[roomName] = [data.user2, data.user];
            io.to(roomName).emit('room', roomName);
        } else {
            socket.join(room);
            io.to(room).emit('room', room);
        }
    })
    socket.on('confirmmessage', async (data)=>{
        await MySQL.realizarQuery(`INSERT INTO Messages (idUsers, idChats, message, date, seen) VALUES (${data.id}, ${data.idChat}, "${data.msg}", "${data.hour}", "false")`)
        io.in(data.room).emit('confirmmessage', {msg: data.msg, id: data.id, lastmsg: data.lastMessage, sender: data.sender, hour: data.hour, idchat: data.idChat});
    });
});



app.get('/home', async function(req, res){
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Users;`);
    let users = Object.keys(userOnline);
    for (let i = 0; i<respuesta.length; i++){
        if (users.includes(respuesta[i].user)){
            respuesta[i].online = true;
        }
        if (respuesta[i].user == req.session.user){
            respuesta.splice(i,1)
        }
    }
    let online = respuesta.filter(p => p.online==true)
    let not_online = respuesta.filter(p => p.online!=true)
    let new_respuesta = online.concat(not_online)
    res.render('home', {users:new_respuesta});
});

app.post('/showChat', async function(req, res){
    let msg = []
    let user = await MySQL.realizarQuery(`Select id From Users WHERE user = "${req.body.user}";`);
    let user2 = await MySQL.realizarQuery(`Select id From Users WHERE user = "${req.body.user2}"`);
    //Mejorar la query para obtener 
    // user 1 : 4
    // user 2: 248
    // 4 248
    // 248 4
    let chat = await MySQL.realizarQuery(`Select id_chat From Chats WHERE id_user1 = "${user[0].id}" AND  id_user2 = "${user2[0].id}" OR id_user1 = "${user2[0].id}" AND  id_user2 = "${user[0].id}"`);
    if (chat.length != 0){
        msg = await MySQL.realizarQuery(`Select * From Messages WHERE idChats = "${chat[0]["id_chat"]}" `);
    } else {
        await MySQL.realizarQuery(`INSERT INTO Chats (id_user1, id_user2) VALUES ("${user[0].id}", "${user2[0].id}");`)
    }
    await MySQL.realizarQuery(`UPDATE Messages SET seen = "true" WHERE seen = "false" AND idUsers = ${user2[0].id};`)
    res.send({msg:msg, user:user[0].id, chat:chat[0]["id_chat"], name: req.body.user2});
});




app.post('/point', async function(req, res){
    let msgs = [];
    let id;
    let countMsg = {};
    let list = await MySQL.realizarQuery(`Select * From Users`);
    for (let i = 0; i < list.length; i++) {
        if (list[i].user == req.body.data){
            id = list[i].id;
        }
    }
    let chat = await MySQL.realizarQuery(`Select id_chat, id_user2, id_user1 From Chats WHERE id_user1 = "${id}" OR id_user2 = "${id}"`); 
    for (let i = 0; i < chat.length; i++) {
        if (chat[i]["id_user2"] == id){
            delete chat[i]["id_user2"];
        } else {
            delete chat[i]["id_user1"];
        };
    }
    for (let i = 0; i < chat.length; i++) {
        msgs.push(await MySQL.realizarQuery(`Select * From Messages WHERE seen = "false" AND idChats = ${chat[i]["id_chat"]} AND idUsers != ${id}`));
    }
    for (let i = 0; i < chat.length; i++) {
        for (let e = 0; e < list.length; e++){
            if (chat[i].id_user2 == list[e].id || chat[i].id_user1 == list[e].id){
                chat[i].id_user2 = list[e].user;
            }
        }
    }
    for (let i = 0; i < chat.length; i++) {
        if (msgs[i].length == 0){
            countMsg[chat[i].id_user2] = 0; 
        } else {
            countMsg[chat[i].id_user2] = msgs[i].length; 
        }
    }
    res.send(countMsg)
});


app.put('/checkMsg', async function(req, res){
    await MySQL.realizarQuery(`UPDATE Messages SET seen = "true" WHERE seen = "false" AND idUsers = ${req.body.id} AND idChats = ${req.body.idChat};`)
});


/* JUEGO */

app.post('/modoSolitario',async function(req,res){
    let palabras = await MySQL.realizarQuery("SELECT nombre_item FROM Items;");
    res.send(palabras)
});

app.put('/modoSolitario',async function(req,res){
    let imagenes = await MySQL.realizarQuery("SELECT imagen FROM Items;");
    res.send(imagenes)
});


/* PUNTAJE */

app.post('/ranking', async function(req,res){
    console.log(req.session.user)
    let actualPoints = await MySQL.realizarQuery(`SELECT puntaje FROM Users WHERE user = "${req.session.user}";`)
    console.log('Tenés: ', actualPoints[0].puntaje)
    console.log('Tenés: ', actualPoints)
    actualPoints[0].puntaje+=10
    await MySQL.realizarQuery(`UPDATE Users SET puntaje = ${actualPoints[0].puntaje} WHERE user = "${req.session.user}"`)
    res.send({puntaje : actualPoints[0].puntaje})
})

app.get('/ranking', async function(req,res){
    console.log("Soy un pedido GET /ranking", req.body);
    let tablaPuntaje = await MySQL.realizarQuery("Select * From Users ORDER BY puntaje DESC;")
    tablaPuntaje = tablaPuntaje.splice(0, 5)
    console.log(tablaPuntaje)
    res.render('ranking', {pibardos: tablaPuntaje})
});

io.on('connection', (socket) =>{
    socket.on('join-room', async (data)=>{
        socket.join(data)
        let longitud = await MySQL.realizarQuery(` SELECT idPlayer2 FROM Rooms WHERE idPlayer1 != "NULL" `)
        console.log(longitud)
        if(rooms[rooms.length-1].room.length == 2){
            io.to(data).emit('start')
            fetchSala()
            changeScreen()
        }
    })
    socket.on('disconect', () => {
        console.log("desconectado")
    })
    
})

app.put('/partidas', async function(req, res){
    console.log(rooms)
    await MySQL.realizarQuery(`UPDATE Rooms SET idPlayer1 = ${req.user.id} AND idPlayer2 = ${req.user.id}`)
})

app.get("/espera", async(req, res) =>{
    let rooms = await MySQL.realizarQuery(`SELECT * FROM Rooms`)
    res.render('espera', {room: rooms})
});

app.get("/modoMultijugador", (req,res) =>{
    res.render('modoMultijugador', null)
})

/*

let rooms = [{room1: ["Pep"]}]
    
}

// MULTIPLAYER

let room = [id_player1, id_player2]
io.on('connection', (socket) =>{
    socket.on('room', (data)=>{
        socket.join(data)
        if(rooms[rooms.length-1].room.length == 2){
            io.to(data).emit('start')
        }
        io.to(socket.id).emit('confirm-room')
    })
    
    socket.on('add-user', (data) => {
        socket.broadcast.emit("add-user", data);
    })
    socket.on('login-register', (data) => {
        userOnline[data] = socket;
    })
    // Find an available player number
  let playerIndex = -1;
  for (var i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
    }
  }
  
  // Tell the connecting client what player number they are
  socket.emit('player-number', playerIndex);
  
  // Ignore player 3
  if (playerIndex == -1) return;
  
  connections[playerIndex] = socket;
  
  // Tell everyone else what player number just connected
  socket.broadcast.emit('player-connect', playerIndex);

  socket.on('actuate', function (data) {
    const { grid, metadata } = data; // Get grid and metadata properties from client
    
    const move = {
      playerIndex,
      grid,
      metadata,
    };
    // Emit the move to all other clients
    socket.broadcast.emit('move', move);
    });
    socket.on('disconnect', function() {
        console.log(`Player ${playerIndex} Disconnected`);
        connections[playerIndex] = null;
      });

    socket.on('join-room', function(data) {
        data.nombreSala
        socket.join("nombre-sala");
    });
});
    
*/

/* MOBS */

app.post('/mobs',async function(req,res){
    let mobPalabras = await MySQL.realizarQuery("SELECT nombre_mob FROM Mobs;");
    res.send(mobPalabras)
});

app.put('/mobs',async function(req,res){
    let mobImagenes = await MySQL.realizarQuery("SELECT imagen FROM Mobs;");
    res.send(mobImagenes)
}); 

/* PUNTAJE */

/* TRIVIA */

app.post('/trivia', async function(req,res){
    let preguntas = await MySQL.realizarQuery("SELECT pregunta FROM Trivia;")
    res.send(preguntas)
});

app.put('/trivia', async function(req,res){
    let respuestas = await MySQL.realizarQuery("SELECT respuesta FROM Trivia;")
    res.send(respuestas)
});

/* LEADERBOARD */

app.post('/leaderboard', async function(req,res){
    let top5 = await MySQL.realizarQuery("SELECT * From Users ORDER BY puntaje DESC LIMIT 5;")
    res.send(top5)
});

/* ADMIN */

app.put('/admin', async function(req,res){
    let respuestas = await MySQL.realizarQuery("SELECT respuesta FROM Trivia;")
    res.send(respuestas)
});

