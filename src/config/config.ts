const dotenv = require('dotenv').config();
import logging from './logging';
const NAMESPACE = 'CONFIG';
var USER_DB: any, PASS_DB: any, CONNEC_DB: any;

if (process.env.NODE_ENV == 'production') {
    USER_DB = process.env.USER_PROD;
    PASS_DB = process.env.PASS_PRD;
    CONNEC_DB = process.env.CONECCSTRING_PROD;
} else {
    USER_DB = process.env.USER_QAS;
    PASS_DB = process.env.PASS_QAS;
    CONNEC_DB = process.env.CONECCSTRING_QAS;
}
const ENVIROMENT = process.env.NODE_ENV;

export { USER_DB, PASS_DB, CONNEC_DB, ENVIROMENT };





