/*Esto serìa el equivalente a un app.post, app.get...
    socket.on('incoming-message', data => {
        console.log("INCOMING MESSAGE:", data);
        io.emit("server-message", { mensaje: "MENSAJE DEL SERVIDOR" });
    });
    */