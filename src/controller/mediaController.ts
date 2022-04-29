import { Request, Response } from 'express';
import logging from '../config/logging';
import fs from 'fs';

const NAMESPACE = 'VIDEOCONTROLLER';

export async function getVideo(req: Request, res: Response): Promise<Response | void> {
    const IMAGEDIR = process.cwd() + '/src/public/video';
    var obj: { nombre: string; }[] = [];
    fs.readdir(IMAGEDIR, { withFileTypes: true }, (error, files) => {
        if (error) {
            logging.error(NAMESPACE, 'Error al leer directorio: ' + error.message);
            return res.status(500);
        }
        files.forEach(file => {
            if (file.name.toString().indexOf('video') !== -1) {
                obj.push({ 'nombre': file.name });
            }
        })
        return res.status(200).json(JSON.stringify(obj));
    });
};

export async function getImage(req: Request, res: Response): Promise<Response | void> {
    const IMAGEDIR = process.cwd() + '/src/public/images/zocalo';
    var obj: { nombre: string; }[] = [];
    fs.readdir(IMAGEDIR, { withFileTypes: true }, (error, files) => {
        if (error) {
            logging.error(NAMESPACE, 'Error al leer directorio: ' + error.message);
            return res.status(500);
        }
        files.forEach(file => {
            if (file.name.toString().indexOf('foto') !== -1) {
                obj.push({ 'nombre': file.name });
            }
        })
        return res.status(200).json(JSON.stringify(obj));
    });
};

export async function getImageTurnero(req: Request, res: Response): Promise<Response | void> {
    const IMAGEDIR = process.cwd() + '/src/public/images/zocaloTurn1';
    var obj: { nombre: string; }[] = [];
    fs.readdir(IMAGEDIR, { withFileTypes: true }, (error, files) => {
        if (error) {
            logging.error(NAMESPACE, 'Error al leer directorio: ' + error.message);
            return res.status(500);
        }
        files.forEach(file => {
            if (file.name.toString().indexOf('foto') !== -1) {
                obj.push({ 'nombre': file.name });
            }
        })
        return res.status(200).json(JSON.stringify(obj));
    });
};
