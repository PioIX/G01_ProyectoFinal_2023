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
let roomsOnline = {};
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
})

app.get('/', async function(req, res){
    let chat = await MySQL.realizarQuery(`Select id From Chats WHERE id = 10`);
    res.render('login', null);
});

app.post('/login', async function(req,res){
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Users WHERE user = "${req.body.username}" AND password = "${req.body.password}"; `);
    if (respuesta.length > 0){
        req.session.user = req.body.username;
        res.send({status: true})
    } else {
        res.send({status: false})
    }
})

app.get('/register', function(req, res){
    res.render('register', null);
});

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
        socket.broadcast.emit("relog", {respuesta: new_respuesta});
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
        await MySQL.realizarQuery(`INSERT INTO MensajesChats (idUsers, idChats, Mensajes, fecha, visto) VALUES (${data.id}, ${data.idChat}, "${data.msg}", "${data.hour}", "false")`)
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
    let chat = await MySQL.realizarQuery(`Select id From Chats WHERE id_user1 = "${user[0].id}" AND  id_user2 = "${user2[0].id}" OR id_user1 = "${user2[0].id}" AND  id_user2 = "${user[0].id}"`);
    if (chat.length != 0){
        msg = await MySQL.realizarQuery(`Select * From MensajesChats WHERE idChats = "${chat[0]["id_chaty"]}" `);
    } else {
        await MySQL.realizarQuery(`INSERT INTO Chats (id_user1, id_user2) VALUES ("${user[0].id}", "${user2[0].id}");`)
    }
    await MySQL.realizarQuery(`UPDATE MensajesChats SET visto = "true" WHERE visto = "false" AND idUsers = ${user2[0].id};`)
    res.send({msg:msg, user:user[0].id, chat:chat[0]["id_chaty"], name: req.body.user2});
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
    let chat = await MySQL.realizarQuery(`Select id_chaty, id_user2, id_user1 From Chats WHERE id_user1 = "${id}" OR id_user2 = "${id}"`); 
    for (let i = 0; i < chat.length; i++) {
        if (chat[i]["id_user2"] == id){
            delete chat[i]["id_user2"];
        } else {
            delete chat[i]["id_user1"];
        };
    }
    for (let i = 0; i < chat.length; i++) {
        msgs.push(await MySQL.realizarQuery(`Select * From MensajesChats WHERE visto = "false" AND idChats = ${chat[i]["id_chaty"]} AND idUsers != ${id}`));
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
    await MySQL.realizarQuery(`UPDATE MensajesChats SET visto = "true" WHERE visto = "false" AND idUsers = ${req.body.id} AND idChats = ${req.body.idChat};`)
})

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

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    await authService.registerUser(auth, { email, password });
    res.render("register", {
      message: "Registro exitoso. Puedes iniciar sesion ahora.",
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.render("register", {
      message: "Error en el registro: " + error.message,
    });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await authService.loginUser(auth, {
      email,
      password,
    });
    // Aquí puedes redirigir al usuario a la página que desees después del inicio de sesión exitoso
    res.redirect("/home");
  } catch (error) {
    console.error("Error en el inicio de sesion:", error);
    res.render("login", {
      message: "Error en el inicio de sesion: " + error.message,
    });
  }
});

app.get("/home", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del dashboard
  res.render("home");
});

app.get("/modoSolitario", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del dashboard
  res.render("modoSolitario");
});

app.get("/modoMultijugador", (req, res) => {
  // Agrega aquí la lógica para mostrar la página del dashboard
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

/*
io.on("connection", (socket) => {
  //Esta línea es para compatibilizar con lo que venimos escribiendo
  const req = socket.request;

  //Función Listener
  //Esto serìa el equivalente a un app.post, app.get...
  socket.on('incoming-message', data => {
      console.log("INCOMING MESSAGE:", data); 
      io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" });
      socket.on("server-message", data => {
        console.log("Me llego del servidor", data);
    });      
  });
});

setInterval(() => io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" }), 2000); */

/************************************** */