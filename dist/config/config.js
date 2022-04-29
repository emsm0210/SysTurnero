"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVIROMENT = exports.CONNEC_DB = exports.PASS_DB = exports.USER_DB = void 0;
const dotenv = require('dotenv').config();
const NAMESPACE = 'CONFIG';
var USER_DB, PASS_DB, CONNEC_DB;
exports.USER_DB = USER_DB;
exports.PASS_DB = PASS_DB;
exports.CONNEC_DB = CONNEC_DB;
if (process.env.NODE_ENV == 'production') {
    exports.USER_DB = USER_DB = process.env.USER_PROD;
    exports.PASS_DB = PASS_DB = process.env.PASS_PRD;
    exports.CONNEC_DB = CONNEC_DB = process.env.CONECCSTRING_PROD;
}
else {
    exports.USER_DB = USER_DB = process.env.USER_QAS;
    exports.PASS_DB = PASS_DB = process.env.PASS_QAS;
    exports.CONNEC_DB = CONNEC_DB = process.env.CONECCSTRING_QAS;
}
const ENVIROMENT = process.env.NODE_ENV;
exports.ENVIROMENT = ENVIROMENT;
//# sourceMappingURL=config.js.map