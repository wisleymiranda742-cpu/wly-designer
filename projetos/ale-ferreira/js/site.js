(function () {
  /* ===== CONFIGURAÇÃO =====
     WHATS vazio = mostra o WhatsApp de demonstração (para apresentar a proposta).
     Com número (ex.: '5591999990000') = os botões abrem o WhatsApp de verdade. */
  var WHATS = '';
  var NOME = 'Alê Ferreira';
  var SUB = 'Estética e Beleza';

  function waURL(msg) { return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg); }
  function hora() { var d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ----- janela de WhatsApp de demonstração ----- */
  var wa = document.createElement('div');
  wa.className = 'wa'; wa.hidden = true;
  wa.innerHTML =
    '<div class="wa-phone" role="dialog" aria-modal="true" aria-label="Conversa no WhatsApp com ' + esc(NOME) + '">' +
      '<div class="wa-head"><button type="button" data-wa-close aria-label="Fechar conversa"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<img src="img/logo-badge.png" alt=""><div><b>' + esc(NOME) + ' · ' + esc(SUB) + '</b><small data-wa-status>online</small></div></div>' +
      '<div class="wa-chat" data-wa-chat></div>' +
      '<form class="wa-bar" data-wa-form><label class="sr" for="wa-msg" style="position:absolute;left:-9999px">Mensagem</label><textarea id="wa-msg" rows="1"></textarea>' +
      '<button type="submit" aria-label="Enviar mensagem"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.4-7.5c.8-.4.8-1.5 0-1.9L3.4 3.6c-.7-.3-1.4.3-1.3 1l1.1 6.1 9.3 1.3-9.3 1.3-1.1 6.1c-.1.7.6 1.3 1.3 1z"/></svg></button></form>' +
      (WHATS ? '' : '<div class="wa-real" style="color:#8696A0;font-weight:500">Demonstração: no site no ar, isso abre o WhatsApp do salão.</div>') +
    '</div>';
  document.body.appendChild(wa);
  var chat = wa.querySelector('[data-wa-chat]'), box = wa.querySelector('#wa-msg'), status = wa.querySelector('[data-wa-status]'), lastFocus = null;

  function openWA(msg) {
    if (WHATS) { var a = document.createElement('a'); a.href = waURL(msg); a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); return; }
    lastFocus = document.activeElement;
    chat.innerHTML = '<span class="wa-day">Hoje</span><span class="wa-note">🔒 Prévia de como a cliente fala com o salão. A mensagem já vem pronta, é só tocar em enviar.</span>';
    box.value = msg; wa.hidden = false; document.body.style.overflow = 'hidden';
    setTimeout(function () { box.focus(); }, 50);
  }
  function closeWA() { wa.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  function bubble(txt, who) {
    var b = document.createElement('div'); b.className = 'bub ' + who;
    b.innerHTML = esc(txt) + '<time>' + hora() + (who === 'out' ? ' <span class="tk">✓✓</span>' : '') + '</time>';
    chat.appendChild(b); chat.scrollTop = chat.scrollHeight; return b;
  }
  wa.querySelector('[data-wa-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = box.value.trim(); if (!t) return;
    var b = bubble(t, 'out'); box.value = '';
    setTimeout(function () { b.querySelector('.tk').classList.add('read'); status.textContent = 'digitando…'; var ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>'; chat.appendChild(ty); chat.scrollTop = chat.scrollHeight;
      setTimeout(function () { ty.remove(); status.textContent = 'online';
        bubble('Oi! 💛 Que bom te ver por aqui. Recebemos o seu pedido e já vamos te mandar os horários livres. Algum período fica melhor pra você?', 'in');
      }, 1600);
    }, 700);
  });
  box.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); wa.querySelector('[data-wa-form]').requestSubmit(); } });
  wa.addEventListener('click', function (e) { if (e.target === wa || e.target.closest('[data-wa-close]')) closeWA(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !wa.hidden) closeWA(); });

  /* todo botão de agendar abre o WhatsApp */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-agendar]'); if (!a) return;
    e.preventDefault();
    var s = a.getAttribute('data-agendar');
    openWA('Olá, ' + NOME + '! Vim pelo site e quero agendar' + (s ? ' ' + s : ' um horário') + '. Quais horários vocês têm disponíveis?');
  });

  /* formulário da página de contato */
  var f = document.getElementById('form');
  if (f) {
    var err = document.getElementById('err');
    var d = document.getElementById('f-dia'); var now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); d.min = now.toISOString().slice(0, 10);
    f.addEventListener('input', function () { err.textContent = ''; });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = f.nome.value.trim();
      if (!nome) { err.textContent = 'Digite seu nome para a gente saber quem é.'; f.nome.focus(); return; }
      var dia = f.dia.value ? f.dia.value.split('-').reverse().join('/') : 'a combinar';
      openWA('Olá, ' + NOME + '! Sou ' + nome + ' e quero agendar:\nServiço: ' + f.servico.value + '\nDia: ' + dia + '\nPeríodo: ' + f.periodo.value);
    });
    var q = (location.hash || '').slice(1);
    if (q) { var opt = Array.prototype.find.call(f.servico.options, function (o) { return o.value.toLowerCase().indexOf(decodeURIComponent(q).toLowerCase()) === 0; }); if (opt) f.servico.value = opt.value; }
  }

  /* antes e depois (vários na mesma página) */
  document.querySelectorAll('.compare').forEach(function (cmp) {
    var rg = cmp.querySelector('input[type=range]'); if (!rg) return;
    function set(v) { cmp.style.setProperty('--pos', v + '%'); }
    rg.addEventListener('input', function () { set(rg.value); });
    function fromX(x) { var r = cmp.getBoundingClientRect(); var v = Math.max(0, Math.min(100, (x - r.left) / r.width * 100)); rg.value = v; set(v); }
    cmp.addEventListener('touchstart', function (e) { fromX(e.touches[0].clientX); }, { passive: true });
    cmp.addEventListener('touchmove', function (e) { fromX(e.touches[0].clientX); }, { passive: true });
  });

  /* galeria: filtro e ampliar foto */
  var fb = document.querySelectorAll('.filters button'), figs = document.querySelectorAll('.gal figure');
  fb.forEach(function (b) { b.addEventListener('click', function () {
    var k = b.getAttribute('data-f'); fb.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    figs.forEach(function (g) { g.hidden = k !== 'todos' && g.getAttribute('data-cat') !== k; });
  }); });
  var lb = document.getElementById('lb');
  if (lb) {
    var lbi = lb.querySelector('img');
    figs.forEach(function (g) { var im = g.querySelector('img'); if (!im) return; g.tabIndex = 0;
      function open() { lbi.src = im.src; lbi.alt = im.alt; lb.hidden = false; lb.querySelector('button').focus(); }
      g.addEventListener('click', open); g.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('button')) lb.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });
  }

  var y = document.getElementById('ano'); if (y) y.textContent = new Date().getFullYear();
})();
