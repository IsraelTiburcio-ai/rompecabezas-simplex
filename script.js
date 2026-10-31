(() => {
  'use strict';
  const optilabResults = window.OptiLabResults?.create('rompecabezas-simplex');

  const RETOS = window.SIMPLEX_CHALLENGES || [];
  const TEMAS = window.SIMPLEX_TOPICS || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const mezclar = (items) => {
    const copia = [...items];
    for (let i = copia.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  };
  const normalizar = (value) => String(value).normalize('NFKC').replace(/[−–—﹣－]/g, '-').replace(/\s+/g, '').toLowerCase();
  const formatoTiempo = (milliseconds) => {
    const total = Math.floor(Math.max(0, milliseconds) / 1000);
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  };
  const clasificar = (text) => {
    if (/^(max|min)|[zZ]\s*=/.test(text)) return 'objective';
    if (/[≤≥=<>⇔]/.test(text)) return 'relation';
    if (/^[+−-]/.test(text)) return 'operator';
    if (/^\d/.test(text)) return 'number';
    return 'variable';
  };

  const el = {
    home: $('#screen-home'), game: $('#screen-game'), result: $('#screen-result'),
    start: $('#start-game'), exit: $('#exit-game'), next: $('#next-button'),
    check: $('#check-button'), clear: $('#clear-button'), hint: $('#hint-button'),
    board: $('#equation-board'), pieces: $('#pieces-grid'), feedback: $('#feedback'),
    note: $('#rule-note'), hintNote: $('#hint-note'), interaction: $('#interaction-hint'),
    title: $('#round-title'), prompt: $('#prompt-text'), topic: $('#topic-chip'), source: $('#source-tag'),
    roundCount: $('#round-count'), timer: $('#timer'), hits: $('#hits'), score: $('#score'),
    progress: $('#progress-track'), trayCount: $('#tray-count'), soundStatus: $('#sound-status'),
    mute: $('#mute-toggle'), ref: $('#reference-dialog'), openRef: $('#open-reference'), closeRef: $('#close-reference'),
    resultTitle: $('#result-title'), resultLead: $('#result-lead'), resultGrid: $('#results-grid'), resultList: $('#result-list'),
    replay: $('#replay-game'), homeAgain: $('#home-again')
  };

  const estado = {
    roundTotal: 7, retos: [], indice: 0, ronda: null, resultados: [],
    seleccionado: null, huecoSeleccionado: null, puntos: 0,
    clockStarted: 0, clockElapsed: 0, clockRunning: false,
    roundStarted: 0, roundElapsed: 0, roundRunning: false, tick: 0, lastSessionIds: new Set(),
    mute: false, audio: null, verifyTimeout: 0
  };

  try { estado.mute = localStorage.getItem('rompecabezas-simplex-muted') === 'true'; } catch (_) { estado.mute = false; }

  function totalElapsed() {
    return estado.clockElapsed + (estado.clockRunning ? performance.now() - estado.clockStarted : 0);
  }

  function iniciarReloj() {
    estado.clockElapsed = 0;
    estado.clockStarted = performance.now();
    estado.clockRunning = true;
  }

  function pausarReloj() {
    if (!estado.clockRunning) return;
    estado.clockElapsed += performance.now() - estado.clockStarted;
    estado.clockRunning = false;
  }

  function sonar(frequency = 520, duration = .075, shape = 'sine', delay = 0, volume = .035, endFrequency = null) {
    if (estado.mute) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      estado.audio ||= new AudioContextClass();
      if (estado.audio.state === 'suspended') estado.audio.resume();
      const start = estado.audio.currentTime + delay;
      const oscillator = estado.audio.createOscillator();
      const gain = estado.audio.createGain();
      oscillator.type = shape;
      oscillator.frequency.setValueAtTime(frequency, start);
      if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(estado.audio.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + .02);
    } catch (_) { /* El juego sigue funcionando si el navegador no ofrece audio. */ }
  }

  function efecto(nombre) {
    if (nombre === 'place') sonar(520, .06, 'sine', 0, .025, 650);
    if (nombre === 'remove') sonar(380, .055, 'sine', 0, .018, 300);
    if (nombre === 'error') { sonar(190, .13, 'triangle', 0, .03, 130); }
    if (nombre === 'success') { sonar(520, .13, 'sine', 0, .035, 740); sonar(740, .16, 'sine', .12, .03, 940); }
    if (nombre === 'victory') {
      [523, 659, 784, 1047].forEach((note, index) => sonar(note, .22, 'sine', index * .12, .035, note * 1.04));
    }
  }

  function guardarSilencio() {
    el.mute.setAttribute('aria-pressed', String(estado.mute));
    el.mute.setAttribute('aria-label', estado.mute ? 'Activar sonidos' : 'Silenciar sonidos');
    el.soundStatus.textContent = estado.mute ? 'Silenciado' : 'Activado';
    try { localStorage.setItem('rompecabezas-simplex-muted', String(estado.mute)); } catch (_) { /* Preferencia opcional. */ }
  }

  function setFeedback(message = '', type = '') {
    el.feedback.textContent = message;
    el.feedback.className = `feedback${type ? ` ${type}` : ''}`;
  }

  function setPantalla(name) {
    el.home.classList.toggle('is-hidden', name !== 'home');
    el.game.classList.toggle('is-hidden', name !== 'game');
    el.result.classList.toggle('is-hidden', name !== 'result');
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  function escogerRetos(count) {
    const idsPrevios = estado.lastSessionIds;
    const disponibles = RETOS.filter((reto) => !idsPrevios.has(reto.id));
    const base = disponibles.length >= count ? disponibles : RETOS;
    const temas = [...new Set(base.map((reto) => reto.topic))];
    const elegidos = [];
    mezclar(temas).forEach((topic) => {
      if (elegidos.length < count) {
        const candidates = mezclar(base.filter((reto) => reto.topic === topic && !elegidos.includes(reto)));
        if (candidates[0]) elegidos.push(candidates[0]);
      }
    });
    const resto = mezclar(base.filter((reto) => !elegidos.includes(reto)));
    while (elegidos.length < count) elegidos.push(resto.shift() || mezclar(RETOS.filter((reto) => !elegidos.includes(reto)))[0]);
    const ordered = mezclar(elegidos);
    for (let i = 1; i < ordered.length; i += 1) {
      if (ordered[i].topic === ordered[i - 1].topic) {
        const swapIndex = ordered.findIndex((reto, index) => index > i && reto.topic !== ordered[i - 1].topic);
        if (swapIndex >= 0) [ordered[i], ordered[swapIndex]] = [ordered[swapIndex], ordered[i]];
      }
    }
    estado.lastSessionIds = new Set(ordered.map((reto) => reto.id));
    return ordered;
  }

  function prepararPiezas(challenge) {
    const options = [...challenge.answer, ...challenge.distractors];
    return mezclar(options.map((text, index) => ({ id: `${challenge.id}-piece-${index}`, text, type: clasificar(text) })));
  }

  function numeroHuecos(challenge) {
    return challenge.parts.filter((part) => typeof part === 'object' && part.slot).length;
  }

  function renderBoard() {
    const current = estado.ronda;
    if (!current) return;
    const focusedSlot = document.activeElement?.matches?.('.equation-slot') ? Number(document.activeElement.dataset.slot) : null;
    el.board.replaceChildren();
    let slotIndex = 0;
    current.challenge.parts.forEach((part) => {
      if (typeof part === 'string') {
        el.board.append(document.createTextNode(part));
        return;
      }
      const index = slotIndex++;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'equation-slot';
      button.dataset.slot = String(index);
      button.setAttribute('aria-label', `Hueco ${index + 1}: vacío`);
      button.setAttribute('aria-describedby', 'interaction-hint');
      button.setAttribute('aria-pressed', String(estado.huecoSeleccionado === index));
      const piece = current.pieces.find((item) => item.id === current.placements[index]);
      if (piece) {
        button.textContent = piece.text;
        button.classList.add('filled', `piece-${piece.type}`);
        button.setAttribute('aria-label', `Hueco ${index + 1}: ${piece.text}`);
      }
      if (estado.huecoSeleccionado === index) button.classList.add('target');
      if (current.marks[index]) button.classList.add(current.marks[index]);
      el.board.append(button);
    });
    if (focusedSlot !== null) $(`.equation-slot[data-slot="${focusedSlot}"]`, el.board)?.focus({ preventScroll: true });
  }

  function renderPieces() {
    const current = estado.ronda;
    if (!current) return;
    const focusedPiece = document.activeElement?.matches?.('.piece-button') ? document.activeElement.dataset.piece : null;
    el.pieces.replaceChildren();
    current.pieces.forEach((piece) => {
      const position = current.placements.indexOf(piece.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `piece-button piece-${piece.type}${position >= 0 ? ' used' : ''}`;
      button.textContent = piece.text;
      button.dataset.piece = piece.id;
      button.setAttribute('aria-pressed', String(estado.seleccionado === piece.id));
      button.setAttribute('aria-label', position >= 0 ? `Ficha ${piece.text}, colocada en el hueco ${position + 1}; toca para devolver` : `Ficha ${piece.text}, disponible`);
      button.disabled = current.solved;
      if (estado.seleccionado === piece.id) button.classList.add('selected');
      el.pieces.append(button);
    });
    if (focusedPiece) $(`.piece-button[data-piece="${focusedPiece}"]`, el.pieces)?.focus({ preventScroll: true });
    const used = current.placements.filter(Boolean).length;
    el.trayCount.textContent = `${used} / ${current.placements.length}`;
    el.check.disabled = used !== current.placements.length || current.solved;
  }

  function renderProgress() {
    el.progress.replaceChildren();
    estado.retos.forEach((_, index) => {
      const segment = document.createElement('span');
      segment.className = 'progress-segment';
      if (estado.resultados[index]) segment.classList.add('done');
      else if (index === estado.indice) segment.classList.add('active');
      el.progress.append(segment);
    });
    el.progress.setAttribute('aria-valuemax', String(estado.retos.length));
    el.progress.setAttribute('aria-valuenow', String(estado.resultados.filter(Boolean).length));
  }

  function actualizarMarcador() {
    el.roundCount.textContent = `${Math.min(estado.indice + 1, estado.retos.length)} / ${estado.retos.length}`;
    el.hits.textContent = String(estado.resultados.filter(Boolean).length);
    el.score.textContent = String(estado.puntos);
    el.timer.textContent = formatoTiempo(totalElapsed());
    renderProgress();
  }

  function cargarRonda(index) {
    window.clearTimeout(estado.verifyTimeout);
    estado.indice = index;
    const challenge = estado.retos[index];
    estado.ronda = {
      challenge,
      pieces: prepararPiezas(challenge),
      placements: Array(numeroHuecos(challenge)).fill(null),
      marks: Array(numeroHuecos(challenge)).fill(''),
      errors: 0,
      attempts: 0,
      hintUsed: false,
      solved: false
    };
    estado.seleccionado = null;
    estado.huecoSeleccionado = null;
    estado.roundElapsed = 0;
    estado.roundStarted = performance.now();
    estado.roundRunning = true;
    el.topic.textContent = challenge.label;
    el.source.textContent = `GYM 3 · P. ${challenge.page}`;
    el.title.textContent = challenge.instruction;
    el.prompt.textContent = challenge.prompt;
    el.note.textContent = '';
    el.note.classList.add('is-hidden');
    el.hintNote.textContent = '';
    el.hintNote.classList.add('is-hidden');
    el.hint.disabled = false;
    el.clear.disabled = false;
    el.check.classList.remove('is-hidden');
    el.next.classList.add('is-hidden');
    el.interaction.textContent = 'Selecciona una ficha y luego toca una ranura. También puedes arrastrar.';
    setFeedback('');
    renderBoard();
    renderPieces();
    actualizarMarcador();
    el.title.focus({ preventScroll: true });
  }

  function mostrarSeleccion() {
    if (estado.seleccionado) {
      const piece = estado.ronda.pieces.find((item) => item.id === estado.seleccionado);
      setFeedback(`Ficha seleccionada: ${piece?.text || ''}. Elige una ranura.`, 'info');
    } else if (estado.huecoSeleccionado !== null) {
      setFeedback(`Hueco ${estado.huecoSeleccionado + 1} seleccionado. Elige una ficha.`, 'info');
    } else {
      setFeedback('');
    }
    renderBoard();
    renderPieces();
  }

  function colocarPieza(pieceId, slotIndex) {
    const current = estado.ronda;
    if (!current || current.solved || slotIndex < 0 || slotIndex >= current.placements.length) return;
    const occupied = current.placements[slotIndex];
    current.placements[slotIndex] = pieceId;
    current.marks[slotIndex] = '';
    estado.seleccionado = null;
    estado.huecoSeleccionado = null;
    efecto('place');
    setFeedback(occupied && occupied !== pieceId ? 'Ficha reemplazada. La anterior volvió a la bandeja.' : 'Ficha colocada.', 'info');
    renderBoard();
    renderPieces();
  }

  function elegirPieza(pieceId) {
    const current = estado.ronda;
    if (!current || current.solved) return;
    const placedAt = current.placements.indexOf(pieceId);
    if (placedAt >= 0) {
      current.placements[placedAt] = null;
      current.marks[placedAt] = '';
      estado.seleccionado = null;
      estado.huecoSeleccionado = null;
      efecto('remove');
      setFeedback('Ficha devuelta a la bandeja.', 'info');
      renderBoard();
      renderPieces();
      return;
    }
    if (estado.huecoSeleccionado !== null) {
      colocarPieza(pieceId, estado.huecoSeleccionado);
      return;
    }
    estado.seleccionado = estado.seleccionado === pieceId ? null : pieceId;
    estado.huecoSeleccionado = null;
    mostrarSeleccion();
  }

  function elegirHueco(slotIndex) {
    const current = estado.ronda;
    if (!current || current.solved) return;
    if (estado.seleccionado) {
      colocarPieza(estado.seleccionado, slotIndex);
      return;
    }
    if (current.placements[slotIndex]) {
      current.placements[slotIndex] = null;
      current.marks[slotIndex] = '';
      estado.huecoSeleccionado = null;
      efecto('remove');
      setFeedback('Ficha devuelta a la bandeja.', 'info');
      renderBoard();
      renderPieces();
      return;
    }
    estado.huecoSeleccionado = estado.huecoSeleccionado === slotIndex ? null : slotIndex;
    mostrarSeleccion();
  }

  function respuestaMasCercana(current) {
    const chosen = current.placements.map((pieceId) => current.pieces.find((piece) => piece.id === pieceId)?.text ?? '');
    const answers = [current.challenge.answer, ...(current.challenge.alternatives || [])];
    let best = answers[0];
    let bestMarks = [];
    let bestCount = -1;
    answers.forEach((answer) => {
      const marks = answer.map((expected, index) => normalizar(chosen[index]) === normalizar(expected));
      const count = marks.filter(Boolean).length;
      if (count > bestCount) { best = answer; bestMarks = marks; bestCount = count; }
    });
    return { correct: bestCount === current.placements.length, answer: best, marks: bestMarks };
  }

  function comprobar() {
    const current = estado.ronda;
    if (!current || current.solved || current.placements.some((piece) => !piece)) return;
    current.attempts += 1;
    const result = respuestaMasCercana(current);
    if (result.correct) {
      resolverRonda(current);
      return;
    }
    current.errors += 1;
    current.marks = result.marks.map((correct) => correct ? 'correct' : 'incorrect');
    renderBoard();
    $$('.equation-slot.incorrect', el.board).forEach((slot) => {
      slot.classList.remove('shake');
      void slot.offsetWidth;
      slot.classList.add('shake');
    });
    efecto('error');
    const wrongCount = result.marks.filter((correct) => !correct).length;
    setFeedback(`${wrongCount} ${wrongCount === 1 ? 'pieza necesita' : 'piezas necesitan'} revisión. Cambia las resaltadas y vuelve a comprobar.`, 'error');
  }

  function resolverRonda(current) {
    current.solved = true;
    const roundMilliseconds = estado.roundElapsed + (estado.roundRunning ? performance.now() - estado.roundStarted : 0);
    const seconds = roundMilliseconds / 1000;
    estado.roundRunning = false;
    const bonus = Math.max(0, Math.min(40, Math.round((30 - seconds) * 2)));
    const points = Math.max(25, 100 - current.errors * 15) + bonus;
    estado.puntos += points;
    const summary = {
      challenge: current.challenge,
      errors: current.errors,
      attempts: current.attempts,
      seconds,
      points,
      bonus
    };
    estado.resultados[estado.indice] = summary;
    current.marks = current.placements.map(() => 'correct');
    renderBoard();
    renderPieces();
    efecto('success');
    setFeedback(`${current.challenge.feedback} +${points} puntos${bonus ? ` (incluye ${bonus} de rapidez)` : ''}.`, 'success');
    el.note.textContent = `Regla: ${current.challenge.rule}`;
    el.note.classList.remove('is-hidden');
    el.hint.disabled = true;
    el.clear.disabled = true;
    el.check.classList.add('is-hidden');
    el.next.classList.remove('is-hidden');
    el.next.innerHTML = estado.indice === estado.retos.length - 1 ? 'Ver resultados <span aria-hidden="true">→</span>' : 'Siguiente ronda <span aria-hidden="true">→</span>';
    actualizarMarcador();
    el.next.focus({ preventScroll: true });
  }

  function limpiar() {
    const current = estado.ronda;
    if (!current || current.solved) return;
    current.placements.fill(null);
    current.marks.fill('');
    estado.seleccionado = null;
    estado.huecoSeleccionado = null;
    setFeedback('Armado limpio. Las fichas están listas para volver a colocarse.', 'info');
    renderBoard();
    renderPieces();
  }

  function mostrarPista() {
    const current = estado.ronda;
    if (!current || current.solved) return;
    current.hintUsed = true;
    el.hintNote.textContent = `Pista: ${current.challenge.hint}`;
    el.hintNote.classList.remove('is-hidden');
    setFeedback('Pista disponible debajo del tablero.', 'info');
  }

  function siguiente() {
    if (estado.indice < estado.retos.length - 1) cargarRonda(estado.indice + 1);
    else finalizarPartida();
  }

  function leerMejor(count) {
    try { return Number(localStorage.getItem(`rompecabezas-simplex-best-${count}`)) || 0; } catch (_) { return 0; }
  }

  function finalizarPartida() {
    pausarReloj();
    window.clearInterval(estado.tick);
    const elapsed = totalElapsed();
    const firstTry = estado.resultados.filter((item) => item?.errors === 0).length;
    const errors = estado.resultados.reduce((sum, item) => sum + (item?.errors || 0), 0);
    optilabResults?.complete({reason:'completed',correct:firstTry,total:estado.roundTotal,attempts:estado.resultados.reduce((sum,item)=>sum+item.attempts,0),errors,durationMs:Math.round(elapsed),score:estado.puntos});
    const speedBonus = estado.resultados.reduce((sum, item) => sum + (item?.bonus || 0), 0);
    const best = Math.max(leerMejor(estado.roundTotal), estado.puntos);
    try { localStorage.setItem(`rompecabezas-simplex-best-${estado.roundTotal}`, String(best)); } catch (_) { /* Récord local opcional. */ }
    el.resultLead.textContent = firstTry === estado.roundTotal ? '¡Todas correctas al primer intento! Excelente dominio de las equivalencias.' : 'Buen trabajo reconstruyendo las transformaciones del método Simplex.';
    const stats = [
      [String(estado.resultados.length), 'Rondas completadas'],
      [formatoTiempo(elapsed), 'Tiempo total'],
      [`${firstTry} / ${estado.roundTotal}`, 'Aciertos al primer intento'],
      [String(errors), 'Intentos incorrectos'],
      [String(estado.puntos), 'Puntos totales'],
      [`+${speedBonus}`, 'Bonus por rapidez'],
      [String(best), 'Mejor puntaje en esta modalidad'],
      [`${estado.roundTotal} rondas`, 'Modo de partida']
    ];
    el.resultGrid.replaceChildren();
    stats.forEach(([value, label]) => {
      const card = document.createElement('div');
      card.className = 'result-stat';
      const strong = document.createElement('strong');
      strong.textContent = value;
      const caption = document.createElement('span');
      caption.textContent = label;
      card.append(strong, caption);
      el.resultGrid.append(card);
    });
    el.resultList.replaceChildren();
    estado.resultados.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${item.challenge.label} · ${item.errors ? `${item.errors} ${item.errors === 1 ? 'error' : 'errores'}` : 'al primer intento'} · ${item.points} pts`;
      el.resultList.append(li);
    });
    setPantalla('result');
    efecto('victory');
    el.resultTitle.focus({ preventScroll: true });
  }

  function comenzarPartida() {
    optilabResults?.start();
    estado.roundTotal = Number($('input[name="round-count"]:checked')?.value || 7);
    estado.retos = escogerRetos(estado.roundTotal);
    estado.indice = 0;
    estado.resultados = [];
    estado.puntos = 0;
    iniciarReloj();
    setPantalla('game');
    cargarRonda(0);
    window.clearInterval(estado.tick);
    estado.tick = window.setInterval(actualizarMarcador, 250);
  }

  function salirPartida() {
    const salir = window.confirm('¿Salir de la partida? Se perderá el progreso de esta sesión.');
    if (!salir) return;
    optilabResults?.cancel();
    pausarReloj();
    window.clearInterval(estado.tick);
    window.clearTimeout(estado.verifyTimeout);
    estado.ronda = null;
    setPantalla('home');
    el.start.focus({ preventScroll: true });
  }

  function abrirReferencia() {
    if (typeof el.ref.showModal === 'function') el.ref.showModal();
    else el.ref.setAttribute('open', '');
  }

  function cerrarReferencia() {
    if (typeof el.ref.close === 'function') el.ref.close();
    else el.ref.removeAttribute('open');
    el.openRef.focus({ preventScroll: true });
  }

  let ignoreClickUntil = 0;
  let drag = null;

  function buscarHuecoEn(x, y) {
    const target = document.elementFromPoint(x, y)?.closest('.equation-slot');
    return target && el.board.contains(target) ? Number(target.dataset.slot) : -1;
  }

  function iniciarArrastre(event) {
    const button = event.target.closest('.piece-button');
    if (!button || button.disabled || button.classList.contains('used') || event.button > 0) return;
    drag = { id: button.dataset.piece, button, pointerId: event.pointerId, x: event.clientX, y: event.clientY, active: false, ghost: null };
  }

  function moverArrastre(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!drag.active && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 9) {
      drag.active = true;
      drag.button.classList.add('drag-origin');
      drag.ghost = drag.button.cloneNode(true);
      drag.ghost.removeAttribute('id');
      drag.ghost.removeAttribute('data-piece');
      drag.ghost.removeAttribute('aria-label');
      drag.ghost.setAttribute('aria-hidden', 'true');
      drag.ghost.disabled = true;
      drag.ghost.classList.remove('used', 'drag-origin', 'selected');
      drag.ghost.classList.add('drag-ghost');
      document.body.append(drag.ghost);
    }
    if (!drag.active) return;
    event.preventDefault();
    drag.ghost.style.left = `${event.clientX}px`;
    drag.ghost.style.top = `${event.clientY}px`;
    $$('.equation-slot.target', el.board).forEach((slot) => slot.classList.remove('target'));
    const index = buscarHuecoEn(event.clientX, event.clientY);
    if (index >= 0) $(`.equation-slot[data-slot="${index}"]`, el.board)?.classList.add('target');
  }

  function finalizarArrastre(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const activeDrag = drag;
    drag = null;
    activeDrag.button.classList.remove('drag-origin');
    activeDrag.ghost?.remove();
    $$('.equation-slot.target', el.board).forEach((slot) => slot.classList.remove('target'));
    if (activeDrag.active) {
      ignoreClickUntil = Date.now() + 450;
      const index = buscarHuecoEn(event.clientX, event.clientY);
      if (index >= 0) colocarPieza(activeDrag.id, index);
      else setFeedback('Suelta la ficha sobre una ranura para colocarla.', 'info');
    }
  }

  function cancelarArrastre(event) {
    if (!drag || (event.pointerId !== undefined && event.pointerId !== drag.pointerId)) return;
    drag.button.classList.remove('drag-origin');
    drag.ghost?.remove();
    drag = null;
    $$('.equation-slot.target', el.board).forEach((slot) => slot.classList.remove('target'));
  }

  function init() {
    $('#bank-count').textContent = String(RETOS.length);
    guardarSilencio();
    el.start.addEventListener('click', comenzarPartida);
    el.exit.addEventListener('click', salirPartida);
    el.next.addEventListener('click', siguiente);
    el.check.addEventListener('click', comprobar);
    el.clear.addEventListener('click', limpiar);
    el.hint.addEventListener('click', mostrarPista);
    el.replay.addEventListener('click', comenzarPartida);
    el.homeAgain.addEventListener('click', () => { setPantalla('home'); el.start.focus({ preventScroll: true }); });
    el.openRef.addEventListener('click', abrirReferencia);
    el.closeRef.addEventListener('click', cerrarReferencia);
    el.ref.addEventListener('click', (event) => { if (event.target === el.ref) cerrarReferencia(); });
    el.mute.addEventListener('click', () => {
      estado.mute = !estado.mute;
      guardarSilencio();
      if (!estado.mute) sonar(640, .08, 'sine', 0, .025, 760);
    });
    el.pieces.addEventListener('click', (event) => {
      if (Date.now() < ignoreClickUntil) return;
      const piece = event.target.closest('.piece-button');
      if (piece && el.pieces.contains(piece)) elegirPieza(piece.dataset.piece);
    });
    el.board.addEventListener('click', (event) => {
      if (Date.now() < ignoreClickUntil) return;
      const slot = event.target.closest('.equation-slot');
      if (slot && el.board.contains(slot)) elegirHueco(Number(slot.dataset.slot));
    });
    el.pieces.addEventListener('pointerdown', iniciarArrastre);
    window.addEventListener('pointermove', moverArrastre, { passive: false });
    window.addEventListener('pointerup', finalizarArrastre);
    window.addEventListener('pointercancel', cancelarArrastre);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pausarReloj();
        if (estado.roundRunning && !estado.ronda?.solved) {
          estado.roundElapsed += performance.now() - estado.roundStarted;
          estado.roundRunning = false;
        }
      }
      else if (!el.game.classList.contains('is-hidden') && !estado.ronda?.solved) {
        estado.clockStarted = performance.now();
        estado.clockRunning = true;
        estado.roundStarted = performance.now();
        estado.roundRunning = true;
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !el.ref.open && estado.ronda && (estado.seleccionado || estado.huecoSeleccionado !== null)) {
        estado.seleccionado = null;
        estado.huecoSeleccionado = null;
        mostrarSeleccion();
      }
      if (event.key.toLowerCase() === 'm' && !event.repeat && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        estado.mute = !estado.mute;
        guardarSilencio();
        if (!estado.mute) sonar(640, .08, 'sine', 0, .025, 760);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
