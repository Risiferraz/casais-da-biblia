(function () {
	var elementoCronometro = document.querySelector('#cronometro');
	var segundos = 0;
	var intervaloId = null;
	var emExecucao = false;

	function formatarTempo(totalSegundos) {
		var minutos = Math.floor(totalSegundos / 60);
		var restoSegundos = totalSegundos % 60;
		var mm = String(minutos).padStart(2, '0');
		var ss = String(restoSegundos).padStart(2, '0');
		return mm + ':' + ss;
	}

	function renderizar() {
		if (elementoCronometro) {
			elementoCronometro.textContent = formatarTempo(segundos);
		}
	}

	function iniciarNoPrimeiroClique() {
		if (emExecucao) {
			return;
		}

		emExecucao = true;
		intervaloId = setInterval(function () {
			segundos += 1;
			renderizar();
		}, 1000);
	}

	function parar() {
		if (intervaloId !== null) {
			clearInterval(intervaloId);
			intervaloId = null;
		}
		emExecucao = false;
	}

	function resetar() {
		parar();
		segundos = 0;
		renderizar();
	}

	window.cronometroJogo = {
		iniciarNoPrimeiroClique: iniciarNoPrimeiroClique,
		parar: parar,
		resetar: resetar
	};

	renderizar();
}());
