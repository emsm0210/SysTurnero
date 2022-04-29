import loggin from '../config/logging';
import oracledb from 'oracledb';
const dotenv = require('dotenv').config();

let connection: any;
const NAMESPACE = 'CONNECT'

//oracledb.initOracleClient({configDir: '/opt/oracle/instantclient_21_6'});
oracledb.initOracleClient({libDir: 'C:\\orant\\instantclient_21_3'});

async function connect() {
    try {
        connection =  await oracledb.getConnection({
            user: process.env.USER,
            password: process.env.PASS,
            connectString: process.env.CONECCSTRING
        });
        loggin.info(NAMESPACE, 'Conexión establecida')
    } catch (err) {
        loggin.error(NAMESPACE, 'Error al conectar: '+err)
    }
    return connection;
}

export default connect;