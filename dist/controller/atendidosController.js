"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAtendidosTurnero = exports.getAtendidos = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const connect_1 = __importDefault(require("../db/connect"));
const NAMESPACE = 'ATENDIDOSCONTROLLER';
let sql, conn, result;
async function getAtendidos(req, res) {
    try {
        sql = `SELECT NRO_TURNO, DESC_BOX, ROWNUM NRO
                 FROM (SELECT A.NRO_TURNO, B.DESC_BOX
                         FROM ATENCION A, BOX B
                        WHERE A.ID_BOX = B.ID_BOX
                        ORDER BY A.FECHA_ATENCION DESC)
                WHERE ROWNUM <= 5
                ORDER BY NRO DESC`;
        /* `SELECT NRO_TURNO, DESC_BOX
             FROM ATENCION,
                  BOX
            WHERE BOX.ID_BOX = ATENCION.ID_BOX
              AND ROWNUM < 6
            ORDER BY FECHA_ATENCION DESC`; */
        conn = await (0, connect_1.default)();
        result = await conn.execute(sql);
        logging_1.default.info(NAMESPACE, 'Resultado: ' + result.rows);
        let json;
        if (result.rows.length > 0) {
            json = '[';
            for (let i = 0; i < result.rows.length; i++) {
                json += '{"nroTurnoAtendido":"' + result.rows[i][0] + '","cajaAtendido":"' + result.rows[i][1] + '"},';
            }
            json = json.slice(0, json.length - 1) + ']';
        }
        else {
            json = '{"mensaje":"Sin turnos"}';
        }
        return res.status(200).json(json);
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
exports.getAtendidos = getAtendidos;
async function getAtendidosTurnero(req, res) {
    try {
        sql = `SELECT CONS_NRO_ID_CONSULTORIO NRO_CONS,
                        PAC_ID_PACIENTE ID_PAC,
                        PACIENTE,
                        DET_MEDICO_ID_DET_MEDICO ID_MED,
                        MEDICO,
                        FECHA
                FROM (SELECT T.*,
                                PS.NOMBRES || ' ' || PS.APELLIDOS MEDICO,
                                PAC.NOMBRES || ' ' || PAC.APELLIDOS PACIENTE
                        FROM TURNERO            T,
                                PERSONAL_SANATORIO PS,
                                DET_PERSONAL       DP,
                                DET_MEDICO         DM,
                                PAC                PAC
                        WHERE T.DET_MEDICO_ID_DET_MEDICO = DM.ID_DET_MEDICO
                            AND PS.ID_PERSONAL(+) = DP.PER_SAN_ID_PERSONAL
                            AND DP.ID_PERSONAL = DM.D_PER_ID_PERSONAL
                            AND T.PAC_ID_PACIENTE = PAC.ID_PACIENTE
                            AND TRUNC(T.FECHA) = TRUNC(SYSDATE)
                            AND SUBSTR(T.CONS_NRO_ID_CONSULTORIO, 1, 1) = ${req.params.piso}
                            AND T.LLAMADO = 'SI'
                            AND T.SUC_ID_SUCURSAL = ${req.params.suc}
                        ORDER BY T.FECHA DESC)
                WHERE ROWNUM < 5`;
        conn = await (0, connect_1.default)();
        result = await conn.execute(sql);
        logging_1.default.info(NAMESPACE, 'Resultado: ' + result.rows);
        let json;
        if (result.rows.length > 0) {
            json = '[';
            for (let i = 0; i < result.rows.length; i++) {
                json += '{"consultorio":"' + result.rows[i][0] + '","paciente":"' + result.rows[i][2] + '","medico":"' + result.rows[i][4] + '"},';
            }
            json = json.slice(0, json.length - 1) + ']';
        }
        else {
            json = '{"mensaje":"Sin turnos"}';
        }
        return res.status(200).json(json);
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
exports.getAtendidosTurnero = getAtendidosTurnero;
//# sourceMappingURL=atendidosController.js.map