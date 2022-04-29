import express from 'express';
import morgan from 'morgan';
import ws from 'ws';
import http from 'http';
import logging from './config/logging';
import socketIo from 'socket.io';
import router from './router/routes';  
import control from './router/ws-control';
const NAMESPACE = 'INDEX';
var cors = require('cors')
//fin declaraciones

// Aplicación de express
const app = express();
app.use(express.static(__dirname + '/../src/public'));
const bodyParser = require('body-parser');
// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

// Server http
const server = new http.Server(app);
// Ws configuración
const webSocket = new ws.Server({ server, path:'/api/v1/ws' });
const io = new socketIo.Server(server, {
    cors: {
        origin: '*'
    },
    allowEIO3: true
});


control(io, webSocket);

/*server listen*/ 
server.listen(3000, () => {
    logging.info(NAMESPACE, 'Server running on port 3000');
});

export {
    webSocket,
    io
}