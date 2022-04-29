"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const config_1 = require("../config/config");
const oracledb_1 = __importDefault(require("oracledb"));
let connection;
const NAMESPACE = 'CONNECT';
//oracledb.initOracleClient({configDir: '/opt/oracle/instantclient_21_6'});
oracledb_1.default.initOracleClient({ libDir: 'C:\\orant\\instantclient_21_3' });
async function connect() {
    try {
        connection = await oracledb_1.default.getConnection({
            user: config_1.USER_DB,
            password: config_1.PASS_DB,
            connectString: config_1.CONNEC_DB
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