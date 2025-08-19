import { Request, Response } from 'express'
import oraclebd from 'oracledb';
import logging from '../config/logging';
import connect from '../db/connect';

const NAMESPACE = 'CREARTURNO.CONTROLLER';
let sql, conn : any, result;

export async function getTurno(req: Request, res: Response): Promise<Response | void> {
    try {
        sql = `DECLARE
                 retorno varchar2(5);
               BEGIN 
                   :retorno := GENERA_TURNO_ATENCION('${req.params.tipo}'); 
               END;`;

        conn = await connect();
        result = await conn.execute(sql, {retorno: {dir: oraclebd.BIND_OUT, type: oraclebd.STRING}});

        logging.info(NAMESPACE, 'Resultado: '+result.outBinds.retorno);

        return res.status(200).json({'turno':result.outBinds.retorno});
    }
    catch (err) {
        logging.error(NAMESPACE, ''+err);
        return res.status(500).send('Error: '+err);
    } finally {
        if (conn != null) await conn.close();
    }
}