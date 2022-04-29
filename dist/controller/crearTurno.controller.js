"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTurno = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const logging_1 = __importDefault(require("../config/logging"));
const connect_1 = __importDefault(require("../db/connect"));
const NAMESPACE = 'CREARTURNO.CONTROLLER';
let sql, conn, result;
async function getTurno(req, res) {
    try {
        sql = `DECLARE
                 retorno varchar2(5);
               BEGIN 
                   :retorno := GENERA_TURNO_ATENCION('${req.params.tipo}'); 
               END;`;
        conn = await (0, connect_1.default)();
        result = await conn.execute(sql, { retorno: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.STRING } });
        logging_1.default.info(NAMESPACE, 'Resultado: ' + result.outBinds.retorno);
        return res.status(200).json({ 'turno': result.outBinds.retorno });
    }
    catch (err) {
        logging_1.default.error(NAMESPACE, '' + err);
        return res.status(500).send('Error: ' + err);
    }
    finally {
        if (conn != null)
            await conn.close();
    }
}
exports.getTurno = getTurno;
//# sourceMappingURL=crearTurno.controller.js.map