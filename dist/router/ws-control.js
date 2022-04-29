"use strict";
const control = (ws, websocket) => {
    ws.of('/connect').on('connection', (socket) => {
        console.log('id1: ' + socket.id);
    });
    ws.on('connection', (socket) => {
        console.log('id2: ' + socket.id);
    });
    websocket.on('connection', (socket, req) => {
        socket.on('message', (results) => {
            const data = JSON.parse(results.toString());
            console.log(data);
            // socket.emit('message', { message: 'recivido', name: data.age });
            // TODO:Se puede enviar hacia el cliente que estaba usando de esta forma. Solo que no tiene evento .
            socket.send('{"data":"conectado"}');
        });
    });
};
module.exports = control;
//# sourceMappingURL=ws-control.js.map