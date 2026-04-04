function pontuacaoFinal(score, txtScore) {
	var elementoCronometro = document.querySelector('#cronometro');
	var tempoTexto = elementoCronometro ? elementoCronometro.textContent.replace(':', '') : '0000';
	var tempoNumeral = parseInt(tempoTexto, 10);
	var diferenca = 1000 - tempoNumeral;
	var produto = score * 100;
	var soma = produto + diferenca;
	var quociente = soma / 100;

	console.log(
		'Pontuação Final: ((' + score + ' × 100) + (1000 - ' + tempoNumeral + ')) ÷ 100' +
		' = ((' + produto + ') + (' + diferenca + ')) ÷ 100' +
		' = ' + soma + ' ÷ 100' +
		' = ' + quociente
	);

	txtScore.innerHTML = quociente;

	var corOriginal = txtScore.style.color;
	var cores = ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0', '#06d6a0', '#ffd166', '#ef233c'];
	var indiceCor = 0;
	var intervalo = setInterval(function () {
		txtScore.style.color = cores[indiceCor % cores.length];
		indiceCor++;
	}, 150);

	setTimeout(function () {
		clearInterval(intervalo);
		txtScore.style.color = corOriginal;
	}, 3000);

	return quociente;
}
