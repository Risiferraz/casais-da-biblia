(function () {
	var txtScore = document.querySelector('#placar');
	var score = 0;

	var matches = 0;
	//array que armazenará os objetos com src e id de 1 a 8
	var images = [];

	//array que armazena as cartas viradas
	var flippedCards = [];

	//---->referência ao elemento modal
	var modalGameOver = document.querySelector("#modalGameOver");

	var imgMatchSign = document.querySelector("#imgMatchSign");

	//---->referência à caixa de diálogo nativa
	var caixaDialogo = document.querySelector('#caixa-dialogo');
	var botaoSim = document.querySelector('#botao-sim');
	var botaoNao = document.querySelector('#botao-nao');
	var bloqueioConfirmacao = false;

	function definirCliqueCardsHabilitado(habilitado) {
		var cards = document.querySelectorAll('.card');
		for (var i = 0; i < cards.length; i++) {
			cards[i].style.pointerEvents = habilitado ? 'auto' : 'none';
		}
	}

	//estrutura de atribiução das imagens aos card
	//cria um objeto img com um src e um id
	for (var i = 0; i < 18; i++) {	//cria uma estrutura de repetição dizendo que enquanto ela for menor que 16 ela vai ser acrescentada de 1 em 1
		var img = {
			src: "img/" + i + ".jpg",
			id: i % 9
		};
		images.push(img); //insere o objeto criado no array
	}

	startGame();	//chama a função de inicialização do jogo

	function startGame() {
		if (window.cronometroJogo) {
			window.cronometroJogo.resetar();
		}

		score = 0;
		txtScore.innerHTML = score;

		matches = 0;
		flippedCards = [];	//-->zera o array de cartas viradas

		images = randomSort(images);//embaralhamento do array de imagens

		//lista de elementos div com as classes front
		var frontFaces = document.getElementsByClassName("front");
		var backFaces = document.getElementsByClassName("back");

		for (var i = 0; i < 18; i++) {
			frontFaces[i].classList.remove("flipped", "match");
			backFaces[i].classList.remove("flipped", "match")
			var card = document.querySelector("#card" + i);

			card.addEventListener("click", flipCard, false);

			//adiciona as imagens e IDs às cartas
			frontFaces[i].style.backgroundImage = "url('" + images[i].src + "')";
			frontFaces[i].style.backgroundSize = "100% 100%";
			frontFaces[i].style.backgroundRepeat = "no-repeat";
			frontFaces[i].style.backgroundPosition = "center";
			frontFaces[i].setAttribute("id", images[i].id);
		}

		//===> volta com o modal para o fundo
		modalGameOver.style.display = "none";
		modalGameOver.style.pointerEvents = "none";
		modalGameOver.style.zIndex = -2;
		modalGameOver.removeEventListener("click", startGame, false);

		bloqueioConfirmacao = false;
		caixaDialogo.style.display = 'none';
		definirCliqueCardsHabilitado(true);
	}

	function randomSort(oldArray) {	//função que embaralha as cartas recebendo um array por parâmetro
		var newArray = [];	//cria um array vazio

		//executa o bloco de comandos enquanto o novo array não atingir o mesmo número de elementos do array passado por parâmetro
		while (newArray.length !== oldArray.length) {
			var i = Math.floor(Math.random() * oldArray.length);	//cria uma variável i recebendo um número aleatório entre 0 e o número de elementos do array -1

			if (newArray.indexOf(oldArray[i]) < 0) {	//verifica se o elemento indicado pelo índice i já existe no novo array
				newArray.push(oldArray[i]);	//caso o elemento não exista, ele é inserido
			}
		}
		return newArray;	//retorna o array novo, que agora possui todos os elementos do original porém organizados aleatoriamente

	}

	function flipCard() {
		if (bloqueioConfirmacao) {
			return;
		}

		if (flippedCards.length < 2) {	//Verifica se o número de cartas viradas é menor que 2. Isso impede que mais de duas cartas sejam viradas ao mesmo tempo.
			if (window.cronometroJogo) {
				window.cronometroJogo.iniciarNoPrimeiroClique();
			}

			var faces = this.getElementsByClassName("face");	//Obtém as faces da carta clicada usando a classe "face". O this refere-se ao elemento de carta que foi clicado.

			if (faces[0].classList.length > 2) {	//Verifica se a primeira face da carta já possui mais de duas classes. Se tiver, a função retorna e a carta não é virada novamente. Isso impede que a mesma carta seja virada duas vezes.
				return;
			}

			faces[0].classList.toggle("flipped");	//Adiciona a classe "flipped" à primeira face da carta, virando-a. Se a classe já estiver presente, ela será removida.
			faces[1].classList.toggle("flipped");	//Adiciona a classe "flipped" à segunda face da carta, virando-a. Se a classe já estiver presente, ela será removida.

			flippedCards.push(this);	//Adiciona a carta clicada ao array flippedCards, que mantém o controle das cartas viradas.

			if (flippedCards.length === 2) { // Exibe a caixa de diálogo nativa para confirmação
				bloqueioConfirmacao = true;
				definirCliqueCardsHabilitado(false);
				if (window.matchMedia('(max-width: 414px)').matches) {
					setTimeout(function () {
						caixaDialogo.style.display = 'grid';
					}, 1000);
				} else {
					caixaDialogo.style.display = 'flex';
				}

				botaoSim.onclick = function () {
					ValidarJogada(true);
				};

				botaoNao.onclick = function () {
					ValidarJogada(false);
				};
			}
		}
	}
	var clicouEmSim = true;
	function ValidarJogada(clicouEmSim) {	//Se clicou em duas cartas "CERTAS" e clicou em sim ganha 5 pontos (linha 143)
		if (flippedCards.length < 2) return; // Proteção contra erro
		
		var card1Front = flippedCards[0].querySelector(".front");
		var card2Front = flippedCards[1].querySelector(".front");
		
		if (card1Front.id === card2Front.id) {
			if (clicouEmSim) {
				flippedCards[0].querySelector(".back").classList.toggle("match");
				flippedCards[0].querySelector(".front").classList.toggle("match");
				flippedCards[1].querySelector(".back").classList.toggle("match");
				flippedCards[1].querySelector(".front").classList.toggle("match");

				matchCardSign();
				matches++;
				score += 5; // Ganha 5 pontos
				flippedCards = [];
				if (matches === 9) {
					gameOver();
				}
			} else {
				score -= 2; // Perde 2 pontos
			}
		} else {
			if (clicouEmSim) {
				score -= 2; // Perde 2 pontos
			} else {
				score -= 1; // Perde 1 ponto
			}
		}
		caixaDialogo.style.display = 'none'; // Fecha a caixa de diálogo após validar a jogada.
		bloqueioConfirmacao = false;
		definirCliqueCardsHabilitado(true);
		txtScore.innerHTML = score;
		ReiniciarJogada();
	}

	function ReiniciarJogada() {	//é responsável por "desvirar" as cartas que foram viradas, caso a jogada precise ser reiniciada.
		if (flippedCards.length < 2) return; // Proteção contra erro
		
		flippedCards[0].querySelector(".back").classList.toggle("flipped");
		flippedCards[0].querySelector(".front").classList.toggle("flipped");
		flippedCards[1].querySelector(".back").classList.toggle("flipped");
		flippedCards[1].querySelector(".front").classList.toggle("flipped");
		flippedCards = [];	//Essa linha limpa o array flippedCards, esvaziando-o para que as cartas viradas possam ser registradas novamente na próxima jogada.
	}

	//====> função que trás o modal para frente
	function gameOver() {
		if (window.cronometroJogo) {
			window.cronometroJogo.parar();
		}

		score = pontuacaoFinal(score, txtScore);

		modalGameOver.style.display = "flex";
		modalGameOver.style.pointerEvents = "auto";
		modalGameOver.style.zIndex = 99;
		modalGameOver.addEventListener("click", startGame, false);
	}

	function matchCardSign() { // Função para mostrar o sinal de "match" quando um par é encontrado
		imgMatchSign.style.zIndex = 2;
		imgMatchSign.style.opacity = 1;
		setTimeout(function () {
			imgMatchSign.style.zIndex = -1;
			imgMatchSign.style.opacity = 0;
		}, 1500);
	}
}());
