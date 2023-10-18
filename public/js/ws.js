const IP = "ws://localhost:3000";
const socket = io(IP);

socket.on("connect", () => {
    console.log("Me conecté a WS");
});

function funcionPrueba() {
    socket.emit("incoming-message", { mensaje: "PRUEBA" });
}


const io = require('socket.io')(server);

const sessionMiddleware = session({
    secret: 'sararasthastka',
    resave: true,
    saveUnintialized: false,
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
    //Esta línea es para compatibilizar con lo que venimos escribiendo
    const req = socket.request;

    //Esto serìa el equivalente a un app.post, app.get...
    socket.on('incoming-message', data => {
        console.log("INCOMING MESSAGE:", data);
    });
});

socket.on("server-message", data => {
    console.log("Me llego del servidor", data);
});

function funcionPrueba() {
    socket.emit("incoming-message", { mensaje: "PRUEBA" });
}