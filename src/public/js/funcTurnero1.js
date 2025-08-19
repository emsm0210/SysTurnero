let jarvis;
let voice;
let intervalo;
let avisoEnCola = [];
var posicionArray = 0;
var posicionActual = 0;
const TIEMPO_INTERVALO = 8000;
const TIEMPO_COLA = 3000;
const MUSIC = new Audio('../sounds/store-door-chime.wav');
//const URL = 'http://192.158.10.116:3000';
//const URL = 'http://192.158.10.34:3000';
const URL = 'http://127.0.0.1';
var mydata;

function init() {
    images();
    // Interface de la API
    voice = new SpeechSynthesisUtterance();
    // Objeto de la API
    jarvis = window.speechSynthesis;
    disabledPlay = true;
    voice.addEventListener("end", function() {
        cerrarModal();
        //document.getElementById("myModal").style.display = "none";
    });
    // Conexión con el servidor de websocket
    wsConnect();
    getTurnosAtendidos();
    mydata = JSON.parse(data);
}

//llama al lector de imagenes
function images() {
    $.get(URL + '/images1')
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
        a.src = '../images/zocaloTurn1/' + data[posicionActual].nombre;
        if (posicionActual >= data.length - 1) {
            posicionActual = 0;
        } else {
            posicionActual++;
        }

    }, TIEMPO_INTERVALO);
}

function getTurnosAtendidos() {
    $.post(URL + '/atendidosTurnero/1/1')
        .done(function(data) {
            var json = JSON.parse(data);
            var tabla = '';
            if (json.length >= 4) {
                for (let x in json) {
                    tabla += '<tr id="fila_' + x + '">';
                    tabla += '<td style="width: 10%;" class="red">' + json[x].consultorio + '</td>';
                    tabla += '<td style="width: 90%;"><span class="light-blue">MÉDICO: ' + json[x].medico + '</span><br><span class="blue">' + json[x].paciente + '</span></td>';
                    tabla += '</tr>';
                }
            } else if (json.length < 4 && json.length > 0) {
                for (let x = 0; x < 4; x++) {
                    if (x < json.length) {
                        tabla += '<tr id="fila_' + x + '">';
                        tabla += '<td style="width: 10%;" class="red">' + json[x].consultorio + '</td>';
                        tabla += '<td style="width: 90%;"><span class="light-blue">MÉDICO: ' + json[x].medico + '</span><br><span class="blue">' + json[x].paciente + '</span></td>';
                        tabla += '</tr>';
                    } else {
                        tabla += '<tr id="fila_' + x + '">';
                        tabla += '<td style="width: 10%;" class="red"></td>';
                        tabla += '<td style="width: 90%;"><span class="light-blue"></span><br><span class="blue"></span></td>';
                        tabla += '</tr>';

                    }
                }
            } else {
                for (let x = 0; x < 4; x++) {
                    tabla += '<tr id="fila_' + x + '">';
                    tabla += '<td style="width: 10%;" class="red"></td>';
                    tabla += '<td style="width: 90%;"><span class="light-blue"></span><br><span class="blue"></span></td>';
                    tabla += '</tr>';
                }
            }
            document.getElementById('turnos').innerHTML = tabla;
            controlCadena('turnos');
        }).fail(function(error) {
            alert('Error al recuperar atendidos');
        });
}

//funcion que controla el nombre del paciente y el médico
function controlCadena(tBody) {
    $('#' + tBody + ' tr').find("td span:eq(1)").each(function() {
        if ($(this).outerHeight() > 97) {
            var cadena = $(this).html();
            var arrayCadena = cadena.split(' ');
            var nuevoNombre = '';
            for (let i in arrayCadena) {
                if (i == 1) {
                    nuevoNombre = nuevoNombre + ' ' + arrayCadena[i].trim().substr(0, 1) + '.';
                } else {
                    nuevoNombre = nuevoNombre + ' ' + arrayCadena[i].trim();
                }
            }
            $(this).html(nuevoNombre.trim());
            if ($(this).outerHeight() > 97) {
                var cadena2 = $(this).html();
                var arrayCadena2 = cadena2.split(' ');
                var nuevoNombre2 = '';
                for (let i in arrayCadena2) {
                    if (i == 3) {
                        nuevoNombre2 = nuevoNombre2 + ' ' + arrayCadena2[i].trim().substr(0, 1) + '.';
                    } else {
                        nuevoNombre2 = nuevoNombre2 + ' ' + arrayCadena2[i].trim();
                    }
                }
                $(this).html(nuevoNombre2.trim());
            }
        }
    });
}

//===========================socket==========================//
// Invoca esta función para conectar con el servidor de WebSocket
function wsConnect() {
    const websocket = io(URL);

    websocket.on('turnero1', (evt) => {
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
    console.log(evt.turnero);
    if (evt.turnero = 'turnero1') {
        var pacienteVerif = [];
        var nuevoPac = '';
        var correccion = '';
        pacienteVerif = evt.paciente.split(' ');
        for (var i = 0; i < pacienteVerif.length; i++) {
            for (let j in mydata) {
                if (mydata[j].incor.toLowerCase() == pacienteVerif[i].replace('NH', 'Ñ').toLowerCase()) {
                    correccion = mydata[j].corr.toUpperCase();
                }
            }
            if (correccion != '') {
                nuevoPac = nuevoPac + ' ' + correccion;
                correccion = '';
            } else {
                nuevoPac = nuevoPac + ' ' + pacienteVerif[i];
            }
        }
        evt.paciente = nuevoPac;
        var element = document.getElementById('myModal');
        if (element.style.display == 'block' || avisoEnCola.length > 0) {
            avisoEnCola.push(evt);
        } else {
            mostrarTurno(evt);
        }
    }
}

async function mostrarTurno(evt) {
    if (evt.turnero = 'turnero1') {
        var tabla = '';
        if (evt.atendidos.length >= 4) {
            for (let x in evt.atendidos) {
                tabla += '<tr id="fila_' + x + '">';
                tabla += '<td style="width: 10%;" class="red">' + evt.atendidos[x].consultorio + '</td>';
                tabla += '<td style="width: 90%;"><span class="light-blue">MÉDICO: ' + evt.atendidos[x].medico.replace('NH', 'Ñ') + '</span><br><span class="blue">' + evt.atendidos[x].paciente.replace('NH', 'Ñ') + '</span></td>';
                tabla += '</tr>';
            }
        } else if (evt.atendidos.length < 4 && evt.atendidos.length > 0) {
            for (let x = 0; x < 4; x++) {
                if (x < evt.atendidos.length) {
                    tabla += '<tr id="fila_' + x + '">';
                    tabla += '<td style="width: 10%;" class="red">' + evt.atendidos[x].consultorio + '</td>';
                    tabla += '<td style="width: 90%;"><span class="light-blue">MÉDICO: ' + evt.atendidos[x].medico.replace('NH', 'Ñ') + '</span><br><span class="blue">' + evt.atendidos[x].paciente.replace('NH', 'Ñ') + '</span></td>';
                    tabla += '</tr>';
                } else {
                    tabla += '<tr id="fila_' + x + '">';
                    tabla += '<td style="width: 10%;" class="red"></td>';
                    tabla += '<td style="width: 90%;"><span class="light-blue"></span><br><span class="blue"></span></td>';
                    tabla += '</tr>';

                }
            }
        } else {
            for (let x = 0; x < 4; x++) {
                tabla += '<tr id="fila_' + x + '">';
                tabla += '<td style="width: 10%;" class="red"></td>';
                tabla += '<td style="width: 90%;"><span class="light-blue"></span><br><span class="blue"></span></td>';
                tabla += '</tr>';
            }
        }
        document.getElementById('turnos').innerHTML = tabla;
        controlCadena('turnos');
        document.getElementById("mostrarTurno").innerHTML = 'Consultorio ' + evt.consultorio + '<br><br>' + 'Paciente: ' + evt.paciente.replace('NH', 'Ñ');
        mostrarModal();
        var textoToSpeech = 'Consultorio número.! ' + evt.consultorio + '.!!!  Paciente.!' + evt.paciente.replace(' ', '  ').replace('NH', 'Ñ');
        var playSound = MUSIC.play();
        MUSIC.onended = function() {
                playVoice('!!! ' + textoToSpeech);
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
//===================fin socket=========================//

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
            console.log(`${name} - lang: ${lang}`);
            //console.log(`${lang}`); */
        });
        //this.selectedOptions?.[0]?.dataset.language.split('-')[0] || 'es';
    };
    getVoices();

}

function playVoice(text) {
    var vozPosicion = 0;
    // Reproduce la voz
    let voces = window.speechSynthesis.getVoices();
    for (let i in voces) {
        console.log(voces[i].name);
        if (voces[i].name == 'Microsoft Sabina - Spanish (Mexico)') vozPosicion = i;
    }
    voice.voice = voces[vozPosicion];
    console.log(voces[vozPosicion]);
    console.log(vozPosicion);
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
}

function cerrarModal() {
    document.getElementById("myModal").style.display = "none";
    setTimeout(() => {
        if (avisoEnCola.length > 0) {
            console.log('entra aca numero: ' + posicionArray + ' y muestra: ' + avisoEnCola[posicionArray]);
            mostrarTurno(avisoEnCola[posicionArray]);
            if (posicionArray == avisoEnCola.length - 1) {
                avisoEnCola = [];
                posicionArray = 0;
            } else {
                posicionArray = posicionArray + 1;
            }
        }
    }, TIEMPO_COLA);
}

// Se invoca la función init cuando la página termina de cargarse
window.addEventListener("load", init, false);