function click() {
	$.get('http://192.158.10.34:3000/crearTurno/laboratorio', function (data, status) {
		console.log(status);
		if (status == 'success') {
			console.log(data.turno);
			const RUTA_API = "http://192.158.10.34:8000";
			let impresora = new Impresora(RUTA_API);
			impresora.setFontSize(5, 5);
			impresora.setEmphasize(0);
			impresora.setAlign("center");
			impresora.write(""+data.turno.replace(' ','')+"");
			impresora.cut();
			impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial
			impresora.imprimirEnImpresora('turno');
			impresora.end()
				.then(valor => {
					console.log("Al imprimir: " + valor);
				});
		} else {
			console.log("error");
		}
	});

}

(function ($) {

	var $window = $(window),
		$body = $('body');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Mobile?
	if (browser.mobile)
		$body.addClass('is-mobile');
	else {

		breakpoints.on('>medium', function () {
			$body.removeClass('is-mobile');
		});

		breakpoints.on('<=medium', function () {
			$body.addClass('is-mobile');
		});

	}

	// Scrolly.
	$('.scrolly')
		.scrolly({
			speed: 1500
		});

})(jQuery);