// Função para dimensionamento proporcional de toda a área de jogo
// Essa função é uma IIFE auto-contida — não depende de nenhuma variável ou função definida
// em outro lugar (ou arquivo).
// Ela usa apenas APIs nativas do DOM (getElementById, window.addEventListener).
(function escalaDinamicaPagina() {
  const MAX_VISUAL_WIDTH = 1000; // Largura máxima do conteúdo visual para evitar distorção em telas muito largas
  const MOBILE_BREAKPOINT = 414; // Largura máxima para considerar um dispositivo como móvel (ajuste conforme necessário)
  const STAGE_SELECTOR = '#stage'; // Seletor do elemento que envolve o palco do jogo
  const TARGET_ID = 'container'; // ID do elemento que contém o conteúdo a ser escalado
  let frameDeEscala = null; //

  function limpaTransformacao(elemento) {
    elemento.style.transform = '';
    elemento.style.transformOrigin = '';
  }

  function aplicaEscala(elemento, larguraDisponivel, alturaDisponivel) {
    limpaTransformacao(elemento);

    const larguraBase = elemento.offsetWidth;
    const alturaBase = elemento.offsetHeight;

    if (!larguraBase || !alturaBase) {
      return;
    }

    const larguraLimite = Math.min(larguraDisponivel, MAX_VISUAL_WIDTH);
    const escala = Math.min(larguraLimite / larguraBase, alturaDisponivel / alturaBase);

    if (!Number.isFinite(escala) || escala >= 1) {
      return;
    }

    const larguraEscalada = larguraBase * escala;
    const deslocamentoX = Math.max(0, (larguraDisponivel - larguraEscalada) / 2);

    // Origem no topo esquerdo + deslocamento horizontal para manter o centro visual na tela.
    elemento.style.transformOrigin = 'top left';
    elemento.style.transform = `translate(${deslocamentoX}px, 0) scale(${escala})`;
  }

  function scaleStage() {
    const stageWrapper = document.querySelector(STAGE_SELECTOR);
    const container = document.getElementById(TARGET_ID);

    if (!container) {
      return;
    }

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      if (stageWrapper) {
        stageWrapper.style.height = '';
      }
      limpaTransformacao(container);
      return;
    }

    const topoStage = stageWrapper?.getBoundingClientRect().top || 0;
    const alturaDisponivel = Math.max(0, window.innerHeight - topoStage);

    if (stageWrapper) {
      stageWrapper.style.height = `${alturaDisponivel}px`;
    }

    const larguraDisponivel = stageWrapper?.clientWidth || window.innerWidth;

    const estilo = window.getComputedStyle(container);

    if (estilo.display === 'none') {
      limpaTransformacao(container);
      return;
    }

    aplicaEscala(container, larguraDisponivel, alturaDisponivel);
  }

  function agendaEscala(origem) {
    if (frameDeEscala !== null) {
      cancelAnimationFrame(frameDeEscala);
    }

    frameDeEscala = window.requestAnimationFrame(() => {
      frameDeEscala = null;
      scaleStage();
    });
  }

  window.addEventListener('resize', () => agendaEscala('resize'));
  window.addEventListener('DOMContentLoaded', () => agendaEscala('DOMContentLoaded'));
  window.addEventListener('load', () => agendaEscala('load'));

  const observadorDeTela = new MutationObserver((mutacoes) => {
    agendaEscala('mutation');
  });

  const container = document.getElementById(TARGET_ID);

  if (container) {
    observadorDeTela.observe(container, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
})();