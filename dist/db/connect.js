"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const oracledb_1 = __importDefault(require("oracledb"));
let connection;
const NAMESPACE = 'CONNECT';
oracledb_1.default.initOracleClient({ configDir: '/opt/oracle/instantclient_21_6' });
async function connect() {
    try {
        connection = await oracledb_1.default.getConnection({
            user: "anamnesis",
            password: "anamguide1",
            connectString: "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=192.158.10.251)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ANAM)))"
        });
        logging_1.default.info(NAMESPACE, 'Conexión establecida');
    }
    catch (err) {
        logging_1.default.error(NAMESPACE, 'Error al conectar: ' + err);
    }
    return connection;
}
exports.default = connect;
//# sourceMappingURL=connect.js.map