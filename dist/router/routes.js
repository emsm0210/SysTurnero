"use strict";
const express_1 = require("express");
const __1 = require("..");
const atendidosController_1 = require("../controller/atendidosController");
const crearTurno_controller_1 = require("../controller/crearTurno.controller");
const mediaController_1 = require("../controller/mediaController");
const router = (0, express_1.Router)();
var path = require('path');
router.post('/turno', (req, res) => {
    __1.io.emit('parameter', { 'nuevoTurno': req.body.nuevoTurno, 'caja': req.body.caja, 'atendidos': req.body.atendidos, 'turnero': 'interlab' });
    res.status(200).json({ message: 'actualizado' });
});
router.post('/turnopiso1', (req, res) => {
    __1.io.emit('parameter', { 'consultorio': req.body.consultorio, 'medico': req.body.medico, 'paciente': req.body.paciente, 'atendidos': req.body.atendidos, 'turnero': 'turnero1' });
    res.status(200).json({ message: 'actualizado' });
});
router.post('/callback', (req, res) => {
    __1.io.emit('parameter', { 'nuevoTurno': req.body.turno, 'caja': req.body.caja, 'atendidos': 'void' });
    res.status(200).json({ message: 'ok' });
});
router.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, '../public/index.html'));
});
router.get("/nuevo", function (request, response) {
    response.sendFile(path.join(__dirname, '../public/index1.html'));
});
router.get("/turnero1", function (request, response) {
    response.sendFile(path.join(__dirname, '../public/turnero1.html'));
});
router.get("/crearTurno", function (request, response) {
    response.sendFile(path.join(__dirname, '../public/views/crearTurno.html'));
});
router.route("/crearTurno/:tipo").get(crearTurno_controller_1.getTurno);
router.route("/images").get(mediaController_1.getImage);
router.route("/images1").get(mediaController_1.getImageTurnero);
router.route("/video").get(mediaController_1.getVideo);
router.route("/atendidos").post(atendidosController_1.getAtendidos);
router.route("/atendidosTurnero/:suc/:piso").post(atendidosController_1.getAtendidosTurnero);
module.exports = router;
//# sourceMappingURL=routes.js.map