"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.webSocket = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const logging_1 = __importDefault(require("./config/logging"));
const socket_io_1 = __importDefault(require("socket.io"));
const routes_1 = __importDefault(require("./router/routes"));
const ws_control_1 = __importDefault(require("./router/ws-control"));
const NAMESPACE = 'INDEX';
var cors = require('cors');
//fin declaraciones
// Aplicación de express
const app = (0, express_1.default)();
app.use(express_1.default.static(__dirname + '/../src/public'));
const bodyParser = require('body-parser');
// Middlewares
app.use((0, morgan_1.default)('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes_1.default);
// Server http
const server = new http_1.default.Server(app);
// Ws configuración
const webSocket = new ws_1.default.Server({ server, path: '/api/v1/ws' });
exports.webSocket = webSocket;
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: '*'
    },
    allowEIO3: true
});
exports.io = io;
(0, ws_control_1.default)(io, webSocket);
/*server listen*/
server.listen(3000, () => {
    logging_1.default.info(NAMESPACE, 'Server running on port 3000');
});
//# sourceMappingURL=index.js.map