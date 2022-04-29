"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageTurnero = exports.getImage = exports.getVideo = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const fs_1 = __importDefault(require("fs"));
const NAMESPACE = 'VIDEOCONTROLLER';
async function getVideo(req, res) {
    const IMAGEDIR = process.cwd() + '/src/public/video';
    var obj = [];
    fs_1.default.readdir(IMAGEDIR, { withFileTypes: true }, (error, files) => {
        if (error) {
            logging_1.default.error(NAMESPACE, 'Error al leer directorio: ' + error.message);
            return res.status(500);
        }
        files.forEach(file => {
            if (file.name.toString().indexOf('video') !== -1) {
                obj.push({ 'nombre': file.name });
            }
        });
        return res.status(200).json(JSON.stringify(obj));
    });
}
exports.getVideo = getVideo;
;
async function getImage(req, res) {
    const IMAGEDIR = process.cwd() + '/src/public/images/zocalo';
    var obj = [];
    fs_1.default.readdir(IMAGEDIR, { withFileTypes: true }, (error, files) => {
        if (error) {
            logging_1.default.error(NAMESPACE, 'Error al leer directorio: ' + error.message);
            return res.status(500);
        }
        files.forEach(file => {
            if (file.name.toString().indexOf('foto') !== -1) {
                obj.push({ 'nombre': file.name });
            }
        });
        return res.status(200).json(JSON.stringify(obj));
    });
}
exports.getImage = getImage;
;
async function getImageTurnero(req, res) {
    const IMAGEDIR = process.cwd() + '/src/public/images/zocaloTurn1';
    var obj = [];
    fs_1.default.readdir(IMAGEDIR, { withFileTypes: true }, (error, files) => {
        if (error) {
            logging_1.default.error(NAMESPACE, 'Error al leer directorio: ' + error.message);
            return res.status(500);
        }
        files.forEach(file => {
            if (file.name.toString().indexOf('foto') !== -1) {
                obj.push({ 'nombre': file.name });
            }
        });
        return res.status(200).json(JSON.stringify(obj));
    });
}
exports.getImageTurnero = getImageTurnero;
;
//# sourceMappingURL=mediaController.js.map