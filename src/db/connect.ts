import loggin from '../config/logging';
import { USER_DB, PASS_DB, CONNEC_DB } from '../config/config';
import oracledb from 'oracledb';

let connection: any;
const NAMESPACE = 'CONNECT'

oracledb.initOracleClient({configDir: '/opt/oracle/instantclient_21_6'});
//oracledb.initOracleClient({libDir: 'C:\\orant\\instantclient_21_3'});

async function connect() {
    try {
        connection =  await oracledb.getConnection({
            user: USER_DB,
            password: PASS_DB,
            connectString: CONNEC_DB
        });
        loggin.info(NAMESPACE, 'Conexión establecida')
    } catch (err) {
        loggin.error(NAMESPACE, 'Error al conectar: '+err)
    }
    return connection;
}

export default connect;