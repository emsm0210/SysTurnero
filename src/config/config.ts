const dotenv = require('dotenv').config();
import logging from './logging';
const NAMESPACE = 'CONFIG';
var USER_DB: any, PASS_DB: any, CONNEC_DB: any, USER_DBCDI: any, PASS_DBCDI: any, CONNEC_DCDIB: any;

if (process.env.NODE_ENV == 'production') {
    USER_DB = process.env.USER_PROD;
    PASS_DB = process.env.PASS_PRD;
    CONNEC_DB = process.env.CONECCSTRING_PROD;
    USER_DBCDI = process.env.USER_PRODCDI;
    PASS_DBCDI = process.env.PASS_PRDCDI;
    CONNEC_DCDIB = process.env.CONECCSTRING_PRODCDI;
} else {
    USER_DB = process.env.USER_QAS;
    PASS_DB = process.env.PASS_QAS;
    CONNEC_DB = process.env.CONECCSTRING_QAS;
    USER_DBCDI = process.env.USER_PRODCDIDESA;
    PASS_DBCDI = process.env.PASS_PRDCDIDESA;
    CONNEC_DCDIB = process.env.CONECCSTRING_PRODCDIDESA;
}
const ENVIROMENT = process.env.NODE_ENV;

export { USER_DB, PASS_DB, CONNEC_DB, ENVIROMENT, USER_DBCDI, PASS_DBCDI, CONNEC_DCDIB };





