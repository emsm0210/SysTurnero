import loggin from '../config/logging';
import oracledb from 'oracledb';

let connection: any;
const NAMESPACE = 'CONNECT'

oracledb.initOracleClient({configDir: '/opt/oracle/instantclient_21_6'});

async function connect() {
    try {
        connection =  await oracledb.getConnection({
            user: "anamnesis",
            password: "anamnesis2021gg",
            connectString: "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=192.158.10.12)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ANAM)))"
        });
        loggin.info(NAMESPACE, 'Conexión establecida')
    } catch (err) {
        loggin.error(NAMESPACE, 'Error al conectar: '+err)
    }
    return connection;
}

export default connect;