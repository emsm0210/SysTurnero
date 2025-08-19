import { Request, Response, Router } from 'express';
import { io } from '..';
import { getAtendidos, getAtendidosTurnero } from '../controller/atendidosController';
import { getTurno } from '../controller/crearTurno.controller';
import { getImage, getVideo, getImageTurnero } from '../controller/mediaController';

const router = Router();
var path = require('path');

router.post('/turno', (req: Request, res: Response) => {
  io.emit('parameter', { 'nuevoTurno': req.body.nuevoTurno, 'caja': req.body.caja, 'atendidos': req.body.atendidos, 'turnero': 'interlab' });
  res.status(200).json({ message: 'actualizado' });
});

router.post('/turnopiso1', (req: Request, res: Response) => {
  io.emit('turnero1', { 'consultorio': req.body.consultorio, 'medico':req.body.medico.replace('NH','Ñ'), 'paciente': req.body.paciente.replace('NH','Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero1' });
  res.status(200).json({ message: 'actualizado' });
});

router.get("/turnero1", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turnero1.html'));
});

router.post('/turnopiso2', (req: Request, res: Response) => {
  io.emit('turnero2', { 'consultorio': req.body.consultorio, 'medico':req.body.medico.replace('NH','Ñ'), 'paciente': req.body.paciente.replace('NH','Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero2' });
  res.status(200).json({ message: 'actualizado' });
});

router.get("/turnero2", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turnero2.html'));
});


router.get("/turneroUrgAd", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turneroUrgAd.html'));
});

router.post('/turnopiso8', (req: Request, res: Response) => {
  io.emit('turnero8', { 'consultorio': req.body.consultorio.toString().replace('80',''), 'medico':req.body.medico.replace('NH','Ñ'), 'paciente': req.body.paciente.replace('NH','Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero8' });
  res.status(200).json({ message: 'actualizado' });
});


router.get("/turneroUrgPed", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turneroUrgPed.html'));
});

router.post('/turnopiso9', (req: Request, res: Response) => {
  io.emit('turnero9', { 'consultorio': req.body.consultorio.toString().replace('90',''), 'medico':req.body.medico.replace('NH','Ñ'), 'paciente': req.body.paciente.replace('NH','Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero8' });
  res.status(200).json({ message: 'actualizado' });
});

router.post('/callback', (req: Request, res: Response) => {
  io.emit('parameter', { 'nuevoTurno': req.body.turno, 'caja': req.body.caja, 'atendidos':'void'});
  res.status(200).json({ message: 'ok' });
});

router.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get("/nuevo", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/index1.html'));
});

router.get("/crearTurno", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/views/crearTurno.html'));
});

router.route("/crearTurno/:tipo").get(getTurno);

router.route("/images").get(getImage);

router.route("/images1").get(getImageTurnero);

router.route("/video").get(getVideo);

router.route("/atendidos").post(getAtendidos);

router.route("/atendidosTurnero/:suc/:piso").post(getAtendidosTurnero);

export = router; 