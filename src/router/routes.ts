import { Request, Response, Router } from 'express';
import express from 'express';
import { VideosState, VIDEOS_DIR } from '../config/videosWatcher';
import { io } from '..';
import { getAtendidos, getAtendidosCdiEco, getAtendidosTurnero } from '../controller/atendidosController';
import { getTurno } from '../controller/crearTurno.controller';
import { getImage, getVideo, getImageTurnero } from '../controller/mediaController';

const router = Router();
var path = require('path');

const videosState = new VideosState();

router.use("/videos", express.static(VIDEOS_DIR, {
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const map: Record<string, string> = {
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".webm": "video/webm",
      ".ogv": "video/ogg",
      ".ogg": "video/ogg",
      ".m4v": "video/mp4",
      ".mkv": "video/x-matroska"
    };
    if (map[ext]) res.setHeader("Content-Type", map[ext]);
    res.setHeader("Cache-Control", "no-store"); // o usa ?v=mtime si cachéas
  }
}));

router.get('/api/videos', (_req: Request, res: Response) => {
  res.json(videosState.getList()); // {version, videos:[{name,src,mtimeMs}]}
});

// ⬇️ ENDPOINT SSE: notifica cambios en la carpeta sin reiniciar Node
router.get('/api/videos/stream', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  (res as any).flushHeaders?.();
  videosState.subscribe(res);
});

router.post('/turno', (req: Request, res: Response) => {
  io.emit('parameter', { 'nuevoTurno': req.body.nuevoTurno, 'caja': req.body.caja, 'atendidos': req.body.atendidos, 'turnero': 'interlab' });
  res.status(200).json({ message: 'actualizado' });
});

router.post('/turnopiso1', (req: Request, res: Response) => {
  io.emit('turnero1', { 'consultorio': req.body.consultorio, 'medico': req.body.medico.replace('NH', 'Ñ'), 'paciente': req.body.paciente.replace('NH', 'Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero1' });
  res.status(200).json({ message: 'actualizado' });
});

router.get("/turnero1", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turnero1.html'));
});

router.post('/turnocdipiso1', (req: Request, res: Response) => {
  io.emit('turnero1', { 'consultorio': req.body.consultorio, 'medico': req.body.medico.replace('NH', 'Ñ'), 'paciente': req.body.paciente.replace('NH', 'Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero1' });
  res.status(200).json({ message: 'actualizado' });
});

router.get("/turnerocdieco", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turnerocdieco.html'));
});

router.post('/turnopiso2', (req: Request, res: Response) => {
  io.emit('turnero2', { 'consultorio': req.body.consultorio, 'medico': req.body.medico.replace('NH', 'Ñ'), 'paciente': req.body.paciente.replace('NH', 'Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero2' });
  res.status(200).json({ message: 'actualizado' });
});

router.get("/turnero2", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turnero2.html'));
});


router.get("/turneroUrgAd", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turneroUrgAd.html'));
});

router.post('/turnopiso8', (req: Request, res: Response) => {
  io.emit('turnero8', { 'consultorio': req.body.consultorio.toString().replace('80', ''), 'medico': req.body.medico.replace('NH', 'Ñ'), 'paciente': req.body.paciente.replace('NH', 'Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero8' });
  res.status(200).json({ message: 'actualizado' });
});


router.get("/turneroUrgPed", function (request, response) {
  response.sendFile(path.join(__dirname, '../public/turneroUrgPed.html'));
});

router.post('/turnopiso9', (req: Request, res: Response) => {
  io.emit('turnero9', { 'consultorio': req.body.consultorio.toString().replace('90', ''), 'medico': req.body.medico.replace('NH', 'Ñ'), 'paciente': req.body.paciente.replace('NH', 'Ñ'), 'atendidos': req.body.atendidos, 'turnero': 'turnero8' });
  res.status(200).json({ message: 'actualizado' });
});

router.post('/callback', (req: Request, res: Response) => {
  io.emit('parameter', { 'nuevoTurno': req.body.turno, 'caja': req.body.caja, 'atendidos': 'void' });
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

router.route("/atendidosTurneroCdi/:suc/:piso").post(getAtendidosCdiEco);

export = router; 