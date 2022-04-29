// La función init se ejecuta cuando termina de cargarse la página
let jarvis;
let voice;
let disabledPlay;
let posicionActual = 0;
let intervalo;
const TIEMPO_INTERVALO = 8000;
let totalVideos = 0;
let posicionVideoActual = 0;
var cantidadRepetida = 0;
const MUSIC = new Audio('../sounds/store-door-chime.wav');

function init() {
    video();
    images();
    // Interface de la API
    voice = new SpeechSynthesisUtterance();
    // Objeto de la API
    jarvis = window.speechSynthesis;
    disabledPlay = true;
    voice.addEventListener("end", function() {
        cantidadRepetida = cantidadRepetida + 1;
        if (cantidadRepetida > 1) {
            cantidadRepetida = 0;
            document.getElementById("myModal").style.display = "none";
        }
    });
    // Conexión con el servidor de websocket
    wsConnect();
}

//llama al lector de imagenes
function video() {
    $.get('http://192.158.10.34:3000/video')
        .done(function(data) {
            var jsonVideo = JSON.parse(data);
            crearVideos(jsonVideo);
        }).fail(function(error) {
            console.log("error al buscar videos");
        });
}

function crearVideos(data) {
    console.log('videos: ' + JSON.stringify(data));
    if (data != null && data.length > 0) {
        var videoHTML = '';
        for (i = 0; i < data.length; i++) {
            if (videoHTML == '') {
                videoHTML += '<video id="video' + [i] + '" muted onended="playNewVideo()">'
                videoHTML += '<source src="../video/' + data[i].nombre + '" type="video/mp4">';
                videoHTML += '</video>';
            } else {
                videoHTML += '<video id="video' + [i] + '" style="display:none;" muted onended="playNewVideo()">'
                videoHTML += '<source src="../video/' + data[i].nombre + '" type="video/mp4">';
                videoHTML += '</video>';
            }
            totalVideos = totalVideos + 1;
        };
        document.getElementById("mostrarVideos").innerHTML = videoHTML;
        document.getElementById("video0").play();

    };
}

function playNewVideo() {
    document.getElementById("video" + posicionVideoActual + "").style.display = "none";
    posicionVideoActual = posicionVideoActual + 1;
    if (posicionVideoActual == totalVideos) {
        posicionVideoActual = 0;
    };
    var VIDEO = document.getElementById("video" + posicionVideoActual + "");
    VIDEO.style.display = "block";
    VIDEO.play();
}

//llama al lector de imagenes
function images() {
    $.get('http://192.158.10.34:3000/images')
        .done(function(data) {
            var jsonImages = JSON.parse(data);
            timerImage(jsonImages);
        }).fail(function(error) {
            console.log("error al buscar imagenes");
        });
}

function timerImage(data) {
    intervalo = window.setInterval(function() {
        var a = document.getElementById("imagen");
        a.src = '../images/zocalo/' + data[posicionActual].nombre;
        if (posicionActual >= data.length - 1) {
            posicionActual = 0;
        } else {
            posicionActual++;
        }

    }, TIEMPO_INTERVALO);
}

function getTurnosAtendidos() {
    $.post('http://192.158.10.34:3000/atendidos')
        .done(function(data) {
            var json = JSON.parse(data);
            var tabla = '';
            if (json.length >= 5) {
                for (let x in json) {
                    tabla += '<tr>';
                    tabla += '<td class="bold font-azul">' + json[x].nroTurnoAtendido + '</td>';
                    tabla += '<td class="bold font-azul" colspan="2">' + json[x].cajaAtendido + '</td>';
                    tabla += '</tr>';
                }
            } else if (json.length < 5 && json.length > 0) {
                for (let x = 0; x < 5; x++) {
                    if (x < json.length) {
                        tabla += '<tr>';
                        tabla += '<td class="bold font-azul">' + json[x].nroTurnoAtendido + '</td>';
                        tabla += '<td class="bold font-azul" colspan="2">' + json[x].cajaAtendido + '</td>';
                        tabla += '</tr>';
                    } else {
                        tabla += '<tr>';
                        tabla += '<td class="bold font-azul">--</td>';
                        tabla += '<td class="bold font-azul" colspan="2">--</td>';
                        tabla += '</tr>';

                    }
                }
            } else {
                tabla += '<tr>';
                tabla += '<td class="bold font-azul" colspan="3">Sin turnos atendidos</td>';
                tabla += '</tr>';
            }
            document.getElementById('bodyTurnosAtendidos').innerHTML = tabla;
        }).fail(function(error) {
            alert('Error al recuperar atendidos');
        });
}

// Invoca esta función para conectar con el servidor de WebSocket
function wsConnect() {
    const websocket = io("http://192.158.10.34:3000");

    websocket.on('parameter', (evt) => {
        onMessage(evt);
    });

    websocket.on('error', (evt) => {
        onError(evt);
    });

    websocket.on('close', (evt) => {
        onClose(evt);
    });

    websocket.on('connect', (evt) => {
        onOpen(evt);
        getTurnosAtendidos();
    });
}

// Se ejecuta cuando se establece la conexión Websocket con el servidor
function onOpen(evt) {
    voices();
    console.log('Conexión activa');
}

// Se ejecuta cuando la conexión con el servidor se cierra
function onClose(evt) {
    // Deshabilitamos el boton
    console.log('Conexión inactiva');

    // Intenta reconectarse cada 2 segundos
    setTimeout(function() {
        wsConnect()
    }, 2000);
}

// Se invoca cuando se recibe un mensaje del servidor
function onMessage(evt) {
    // Agregamos al textarea el mensaje recibido
    if (evt.turnero == 'interlab') {
        document.getElementById('verTurno').innerHTML = evt.nuevoTurno;
        document.getElementById('verCaja').innerHTML = evt.caja;
        if (evt.atendidos != 'void') {
            var tabla = '';
            if (evt.atendidos.length >= 5) {
                for (let x in evt.atendidos) {
                    tabla += '<tr>';
                    tabla += '<td class="bold font-azul">' + evt.atendidos[x].nroTurnoAtendido + '</td>';
                    tabla += '<td class="bold font-azul" colspan="2">' + evt.atendidos[x].cajaAtendido + '</td>';
                    tabla += '</tr>';
                }
            } else if (evt.atendidos.length < 5 && evt.atendidos.length > 0) {
                for (let x = 0; x < 5; x++) {
                    if (x < evt.atendidos.length) {
                        tabla += '<tr>';
                        tabla += '<td class="bold font-azul">' + evt.atendidos[x].nroTurnoAtendido + '</td>';
                        tabla += '<td class="bold font-azul" colspan="2">' + evt.atendidos[x].cajaAtendido + '</td>';
                        tabla += '</tr>';
                    } else {
                        tabla += '<tr>';
                        tabla += '<td class="bold font-azul">--</td>';
                        tabla += '<td class="bold font-azul" colspan="2">--</td>';
                        tabla += '</tr>';

                    }
                }
            } else {
                tabla += '<tr>';
                tabla += '<td class="bold font-azul" colspan="3">Sin turnos atendidos</td>';
                tabla += '</tr>';
            }
            document.getElementById('bodyTurnosAtendidos').innerHTML = tabla;
        }
        document.getElementById("mostrarTurno").innerHTML = evt.nuevoTurno + '<br>' + evt.caja.replace(' ', '  ');
        mostrarModal();
        var textoToSpeech = 'Ticket.! ' + evt.nuevoTurno + '.  ' + evt.caja.replace(' ', '  ');
        var playSound = MUSIC.play();
        MUSIC.onended = function() {
                playVoice('!!! ' + textoToSpeech);
                playVoice(textoToSpeech);
            }
            /* if (playSound !== undefined) {
                playSound.then(function() {

                    //playVoice(textoToSpeech);
                });
            } */
    }
}

// Se invoca cuando se presenta un error en el WebSocket
function onError(evt) {
    console.log("ERROR: " + evt.data);
}

//===================inicio voces=========================//

function voices() {
    // Comprobamos si tenemos soporte en nuestro navegador
    if (!'speechSynthesis' in window) {
        showNotify({
            msn: 'Your browser not support tha Web Speech API',
            show: true,
            type: 'success'
        });
        return false;
    }

    // Obtenemos todas las voces soportadas
    const getVoices = function() {
        const voices = jarvis.getVoices();
        voices.forEach(item => {
            const { name, lang } = item;
            console.log(`${name}`);
            //console.log(`${lang}`); */
        });
        //this.selectedOptions?.[0]?.dataset.language.split('-')[0] || 'es';
    };
    getVoices();

}

function playVoice(text) {
    // Reproduce la voz
    let voces = window.speechSynthesis.getVoices();
    console.log(voces[6]);
    voice.voice = voces[6];
    voice.volume = 1;
    voice.text = text;
    voice.rate = 0.6;
    jarvis.speak(voice);
};

const showNotify = ({ msn = '', duration = 3000, show = false, type = '' }) => {
    if (show) {
        const notification = document.querySelector('.notification');
        const bgNotification = ['info', 'warning', 'success'].includes(type) ? type : 'info';
        notification.innerHTML = msn;
        notification.classList.add('show', bgNotification);
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
};

//===================fin voces=========================//

//===================Modal=============================//
function mostrarModal() {
    document.getElementById("myModal").style.display = "block";
    /* body.style.position = "static"; */
    /* body.style.height = "100%"; */
    /* body.style.overflow = "hidden"; */
}

function cerrarModal() {
    document.getElementById("myModal").style.display = "none";
    /* body.style.position = "inherit";
    body.style.height = "100";
    body.style.overflow = "visible"; */
}

// Se invoca la función init cuando la página termina de cargarse
window.addEventListener("load", init, false);