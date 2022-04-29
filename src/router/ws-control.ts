import { DefaultEventsMap } from "socket.io/dist/typed-events";
import socketIo from 'socket.io';
import ws from 'ws';

const control = (ws: socketIo.Server<DefaultEventsMap>, websocket:ws.Server) => {
    
    ws.of('/connect').on('connection', (socket: { id: any; }) => {
        console.log('id1: '+socket.id);
    });
    ws.on('connection', (socket) => { //aca entra
        console.log('id2: '+socket.id);
    });

    websocket.on('connection', (socket, req) => {
        socket.on('message', (results: any) => {
            const data = JSON.parse(results.toString());
            console.log(data);
            // socket.emit('message', { message: 'recivido', name: data.age });
            // TODO:Se puede enviar hacia el cliente que estaba usando de esta forma. Solo que no tiene evento .
            socket.send('{"data":"conectado"}');
        });
    });

};

export = control;