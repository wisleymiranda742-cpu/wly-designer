(function () {
  var D = window.CABANA;
  var page = document.body.getAttribute('data-page') || 'home';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- utilidades ---------- */
  function brl(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  var ICON = {
    pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    burger: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a8 6 0 0 1 16 0z"/><path d="M3 15h18"/><path d="M4 18.5h16a0 0 0 0 1 0 0c0 1-1 2-2 2H6c-1 0-2-1-2-2z"/><path d="M3 15c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/></svg>',
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    glass: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l-1.5 17a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z"/><path d="M6.5 9h11"/></svg>',
    cake: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21h16v-8H4z"/><path d="M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 3 1 4 0"/><path d="M12 9v4M12 5.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5z"/></svg>',
    bag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    arrowL: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    arrowR: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    camera: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/></svg>',
    wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/><path d="M9 9.5c.5 2 2 3.5 4 4.5l1.3-1.2 2 1-.5 1.7c-3.5 0-7-3.5-7-7l1.7-.5 1 2z"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  function pic(src, label, cls) {
    return src ? '<img src="' + esc(src) + '" alt="' + esc(label) + '" loading="lazy" decoding="async"' + (cls ? ' class="' + cls + '"' : '') + '>'
      : '<div class="ph" role="img" aria-label="Foto de ' + esc(label) + '">' + ICON.camera + '<span>Foto: ' + esc(label) + '</span></div>';
  }

  /* índice de todos os itens que podem ir para o pedido */
  var ITEMS = {};
  D.lanches.forEach(function (c) { c.itens.forEach(function (i) { ITEMS[i.id] = i; }); });
  D.bebidas.forEach(function (c) { c.itens.forEach(function (i) { ITEMS[i.id] = i; }); });
  D.sobremesas.forEach(function (i) { ITEMS[i.id] = i; });
  D.adicionais.forEach(function (i) { ITEMS[i.id] = i; });

  /* ---------- topo, navegação do celular e rodapé ---------- */
  var links = [
    { href: 'index.html', key: 'home', txt: 'Início', icon: ICON.home },
    { href: 'cardapio.html', key: 'lanches', txt: 'Cardápio', icon: ICON.burger },
    { href: 'bebidas.html', key: 'bebidas', txt: 'Bebidas', icon: ICON.glass },
    { href: 'sobremesas.html', key: 'sobremesas', txt: 'Sobremesas', icon: ICON.cake }
  ];
  function cur(k) { return k === page ? ' aria-current="page"' : ''; }
  var header = el('<header class="topbar"><div class="wrap">' +
    '<a class="brand" href="index.html" aria-label="' + esc(D.nome) + ', início"><span class="brand-mark">' + ICON.burger + '</span><span class="brand-name"><b>' + esc(D.nome) + '</b><span>' + esc(D.subtitulo) + '</span></span></a>' +
    '<nav class="topnav" aria-label="Principal">' + links.map(function (l) { return '<a href="' + l.href + '"' + cur(l.key) + '>' + l.txt + '</a>'; }).join('') +
    '<a href="index.html#onde">Onde fica</a></nav>' +
    '<button type="button" class="cartBtn" data-open-cart aria-label="Abrir pedido">' + ICON.bag + '<span>Pedido</span><span class="cartCount" data-count>0</span></button>' +
    '</div><nav class="secnav" aria-label="Seções"><div class="wrap"><ul>' +
    links.map(function (l) { return '<li><a href="' + l.href + '"' + cur(l.key) + '>' + l.icon + '<span>' + l.txt + '</span></a></li>'; }).join('') +
    '<li><a href="index.html#onde">' + ICON.pin + '<span>Onde fica</span></a></li></ul></div></nav></header>');
  document.body.insertBefore(header, document.body.firstChild);
  (function () { var ul = header.querySelector('.secnav ul'), ac = ul && ul.querySelector('[aria-current]'); if (ac) ul.scrollLeft = ac.parentNode.offsetLeft - 18; })();



  var footer = el('<footer class="footer"><div class="wrap"><div class="footer-grid">' +
    '<div><h4>' + esc(D.nome) + ' ' + esc(D.subtitulo) + '</h4><p style="margin:0">Burgers artesanais, drinks e um lugar para ficar em ' + esc(D.bairro) + '.</p></div>' +
    '<div><h4>Cardápio</h4><div class="links">' + links.slice(1).map(function (l) { return '<a href="' + l.href + '">' + l.txt + '</a>'; }).join('') + '</div></div>' +
    '<div><h4>Visite</h4><div class="links"><span>' + esc(D.endereco) + '</span><span>' + esc(D.bairro) + '</span>' + D.horarios.map(function (h) { return '<span>' + esc(h) + '</span>'; }).join('') + '</div></div>' +
    '<div><h4>Siga</h4><div class="links"><a href="' + D.instagram + '" target="_blank" rel="noopener">Instagram</a><a href="' + waLink('Olá! Vim pelo site.') + '" target="_blank" rel="noopener">WhatsApp</a></div></div>' +
    '</div><div class="legal">Site demonstrativo criado pela Elite Studios · marca, preços, fotos e avaliações fictícios.</div></div></footer>');
  document.body.appendChild(footer);

  function waLink(msg) { return 'https://wa.me/' + (D.whatsapp || '') + '?text=' + encodeURIComponent(msg); }

  /* ---------- pedido (carrinho) ---------- */
  var KEY = 'cabana_pedido';
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function total() { var t = 0; for (var k in cart) if (ITEMS[k]) t += ITEMS[k].preco * cart[k]; return t; }
  function refreshCount() { document.querySelectorAll('[data-count]').forEach(function (c) { c.textContent = count(); }); }
  var toastEl = el('<div class="toast" role="status" aria-live="polite"></div>');
  document.body.appendChild(toastEl);
  var toastT;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1800); }
  function add(id, q) {
    if (!ITEMS[id]) return;
    cart[id] = (cart[id] || 0) + (q || 1);
    if (cart[id] <= 0) delete cart[id];
    save(); refreshCount(); renderCart();
    if ((q || 1) > 0) toast(ITEMS[id].nome + ' no pedido');
  }

  var sheet = el('<div class="sheet" hidden><button type="button" class="sheet-bg" aria-label="Fechar pedido" data-close-cart></button>' +
    '<div class="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">' +
    '<div class="sheet-head"><h2 id="sheetTitle">Seu pedido</h2><button type="button" class="roundBtn" data-close-cart aria-label="Fechar">' + ICON.close + '</button></div>' +
    '<ul class="citems" data-citems></ul>' +
    '<div class="ctotal"><span>Total</span><b data-total>R$ 0,00</b></div>' +
    '<form data-order novalidate>' +
    '<div class="field"><label for="o-nome">Seu nome</label><input id="o-nome" name="nome" autocomplete="name" placeholder="Maria Souza"></div>' +
    '<div class="field"><span style="font-size:13px;font-weight:700">Como quer receber?</span><div class="seg">' +
    '<label><input type="radio" name="tipo" value="Entrega" checked> Entrega</label><label><input type="radio" name="tipo" value="Retirada"> Retirada</label></div></div>' +
    '<div class="field" data-addr><label for="o-end">Endereço de entrega</label><input id="o-end" name="endereco" autocomplete="street-address" placeholder="Rua, número e bairro"></div>' +
    '<div class="field"><label for="o-obs">Observações</label><textarea id="o-obs" name="obs" placeholder="Sem cebola, ponto da carne, troco para R$ 100"></textarea></div>' +
    '<p class="err" data-err role="alert"></p>' +
    '<button type="submit" class="btn btn-ember" style="width:100%">' + ICON.wa + 'Enviar pedido pelo WhatsApp</button>' +
    '</form></div></div>');
  document.body.appendChild(sheet);
  var lastFocus = null;
  function openCart() { lastFocus = document.activeElement; renderCart(); sheet.hidden = false; document.body.style.overflow = 'hidden'; sheet.querySelector('.sheet-head .roundBtn').focus(); }
  function closeCart() { sheet.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open-cart],[data-close-cart],[data-add],[data-inc],[data-dec]');
    if (!t) return;
    if (t.hasAttribute('data-open-cart')) openCart();
    else if (t.hasAttribute('data-close-cart')) closeCart();
    else if (t.hasAttribute('data-add')) { var qn = t.closest('[data-qtywrap]'); var q = qn ? Number(qn.querySelector('output').value) || 1 : 1; add(t.getAttribute('data-add'), q); if (qn) qn.querySelector('output').value = 1; }
    else if (t.hasAttribute('data-inc')) { var o = t.parentNode.querySelector('output'); if (t.hasAttribute('data-cart')) add(t.getAttribute('data-inc'), 1); else o.value = Math.min(20, Number(o.value) + 1); }
    else if (t.hasAttribute('data-dec')) { var o2 = t.parentNode.querySelector('output'); if (t.hasAttribute('data-cart')) add(t.getAttribute('data-dec'), -1); else o2.value = Math.max(1, Number(o2.value) - 1); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeCart(); });
  function renderCart() {
    var ul = sheet.querySelector('[data-citems]');
    var ids = Object.keys(cart).filter(function (k) { return ITEMS[k]; });
    ul.innerHTML = ids.length ? ids.map(function (k) {
      var it = ITEMS[k];
      return '<li class="citem"><div><b>' + esc(it.nome) + '</b><span>' + brl(it.preco) + ' cada · ' + brl(it.preco * cart[k]) + '</span></div>' +
        '<div class="qty"><button type="button" data-dec="' + k + '" data-cart aria-label="Tirar um ' + esc(it.nome) + '">−</button><output>' + cart[k] + '</output><button type="button" data-inc="' + k + '" data-cart aria-label="Mais um ' + esc(it.nome) + '">+</button></div></li>';
    }).join('') : '<li class="cempty">Seu pedido está vazio. Escolha algo no cardápio.</li>';
    sheet.querySelector('[data-total]').textContent = brl(total());
  }
  var form = sheet.querySelector('[data-order]');
  form.addEventListener('change', function () { sheet.querySelector('[data-addr]').hidden = form.tipo.value !== 'Entrega'; });
  form.addEventListener('input', function () { sheet.querySelector('[data-err]').textContent = ''; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = sheet.querySelector('[data-err]');
    if (!count()) { err.textContent = 'Adicione pelo menos um item ao pedido.'; return; }
    if (!form.nome.value.trim()) { err.textContent = 'Digite seu nome.'; form.nome.focus(); return; }
    if (form.tipo.value === 'Entrega' && !form.endereco.value.trim()) { err.textContent = 'Digite o endereço de entrega.'; form.endereco.focus(); return; }
    var lines = ['Olá, ' + D.nome + '! Quero fazer um pedido:', ''];
    Object.keys(cart).forEach(function (k) { if (ITEMS[k]) lines.push(cart[k] + 'x ' + ITEMS[k].nome + ' – ' + brl(ITEMS[k].preco * cart[k])); });
    lines.push('', 'Total: ' + brl(total()), 'Nome: ' + form.nome.value.trim(), form.tipo.value + (form.tipo.value === 'Entrega' ? ': ' + form.endereco.value.trim() : ''));
    if (form.obs.value.trim()) lines.push('Obs.: ' + form.obs.value.trim());
    var a = document.createElement('a'); a.href = waLink(lines.join('\n')); a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  });
  refreshCount();

  /* ---------- ingredientes desenhados (trocar por fotos recortadas depois) ---------- */
  var ING = {
"tomato": "<svg viewBox=\"0 0 100 100\"><defs><radialGradient id=\"tmS\" cx=\"45%\" cy=\"40%\"><stop offset=\"0\" stop-color=\"#F0513A\"/><stop offset=\".8\" stop-color=\"#C8231B\"/><stop offset=\"1\" stop-color=\"#8E120E\"/></radialGradient><radialGradient id=\"tmF\" cx=\"50%\" cy=\"45%\"><stop offset=\"0\" stop-color=\"#FF8A6A\"/><stop offset=\".7\" stop-color=\"#EE4B35\"/><stop offset=\"1\" stop-color=\"#D3301F\"/></radialGradient><radialGradient id=\"tmG\" cx=\"50%\" cy=\"50%\"><stop offset=\"0\" stop-color=\"#FFC9A8\"/><stop offset=\"1\" stop-color=\"#F38B5E\"/></radialGradient></defs><circle cx=\"50\" cy=\"50\" r=\"47\" fill=\"url(#tmS)\"/><circle cx=\"50\" cy=\"50\" r=\"42\" fill=\"url(#tmF)\"/><path d=\"M50 50 L82.2 42.8 A33 33 0 0 1 67.3 78.1Z\" fill=\"url(#tmG)\" opacity=\".95\" transform=\"translate(5.5 2.3) scale(.82) translate(13.4 13.4)\"/><path d=\"M50 50 L57.2 82.2 A33 33 0 0 1 21.9 67.3Z\" fill=\"url(#tmG)\" opacity=\".95\" transform=\"translate(-2.3 5.5) scale(.82) translate(13.4 13.4)\"/><path d=\"M50 50 L17.8 57.2 A33 33 0 0 1 32.7 21.9Z\" fill=\"url(#tmG)\" opacity=\".95\" transform=\"translate(-5.5 -2.3) scale(.82) translate(13.4 13.4)\"/><path d=\"M50 50 L42.8 17.8 A33 33 0 0 1 78.1 32.7Z\" fill=\"url(#tmG)\" opacity=\".95\" transform=\"translate(2.3 -5.5) scale(.82) translate(13.4 13.4)\"/><ellipse cx=\"71.8\" cy=\"53.3\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(99 71.8 53.3)\" fill=\"#F7E2A6\"/><ellipse cx=\"67.2\" cy=\"63.7\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(129 67.2 63.7)\" fill=\"#F7E2A6\"/><ellipse cx=\"58.0\" cy=\"70.5\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(159 58.0 70.5)\" fill=\"#F7E2A6\"/><ellipse cx=\"46.7\" cy=\"71.8\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(189 46.7 71.8)\" fill=\"#F7E2A6\"/><ellipse cx=\"36.3\" cy=\"67.2\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(219 36.3 67.2)\" fill=\"#F7E2A6\"/><ellipse cx=\"29.5\" cy=\"58.0\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(249 29.5 58.0)\" fill=\"#F7E2A6\"/><ellipse cx=\"28.2\" cy=\"46.7\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(279 28.2 46.7)\" fill=\"#F7E2A6\"/><ellipse cx=\"32.8\" cy=\"36.3\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(309 32.8 36.3)\" fill=\"#F7E2A6\"/><ellipse cx=\"42.0\" cy=\"29.5\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(339 42.0 29.5)\" fill=\"#F7E2A6\"/><ellipse cx=\"53.3\" cy=\"28.2\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(369 53.3 28.2)\" fill=\"#F7E2A6\"/><ellipse cx=\"63.7\" cy=\"32.8\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(399 63.7 32.8)\" fill=\"#F7E2A6\"/><ellipse cx=\"70.5\" cy=\"42.0\" rx=\"1.8\" ry=\"3.2\" transform=\"rotate(429 70.5 42.0)\" fill=\"#F7E2A6\"/><circle cx=\"50\" cy=\"50\" r=\"9\" fill=\"#F5A27C\"/><circle cx=\"50\" cy=\"50\" r=\"9\" fill=\"none\" stroke=\"#E46B4C\" stroke-width=\"1\"/><ellipse cx=\"34\" cy=\"28\" rx=\"13\" ry=\"6\" fill=\"#fff\" opacity=\".28\" transform=\"rotate(-30 34 28)\"/></svg>",
"lettuce": "<svg viewBox=\"0 0 100 100\"><defs><linearGradient id=\"lt\" x1=\"0\" y1=\"1\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#3E8A22\"/><stop offset=\".5\" stop-color=\"#6DBA3A\"/><stop offset=\"1\" stop-color=\"#B6E27A\"/></linearGradient></defs><path d=\"M8 66 C6 52 14 44 22 46 C20 34 32 26 40 32 C42 20 58 16 64 26 C72 20 86 26 84 38 C94 42 96 56 86 62 C92 72 82 82 72 78 C68 88 52 90 46 82 C36 90 22 86 22 76 C12 78 6 72 8 66Z\" fill=\"url(#lt)\"/><path d=\"M14 70 C30 62 52 54 82 40\" stroke=\"#E6F7C4\" stroke-width=\"3.2\" fill=\"none\" stroke-linecap=\"round\" opacity=\".9\"/><g stroke=\"#CDEB9C\" stroke-width=\"1.6\" fill=\"none\" stroke-linecap=\"round\" opacity=\".8\"><path d=\"M30 64 C28 52 34 42 40 36\"/><path d=\"M46 58 C46 46 52 36 60 30\"/><path d=\"M62 50 C66 42 74 36 80 34\"/><path d=\"M36 62 C42 70 46 76 48 80\"/><path d=\"M56 54 C62 62 68 70 72 74\"/></g><path d=\"M8 66 C6 52 14 44 22 46 C20 34 32 26 40 32 C42 20 58 16 64 26\" stroke=\"#2F6B18\" stroke-width=\"1.5\" fill=\"none\" opacity=\".5\"/></svg>",
"onion": "<svg viewBox=\"0 0 100 100\"><defs><radialGradient id=\"on\" cx=\"50%\" cy=\"50%\"><stop offset=\".62\" stop-color=\"#FBF1F7\"/><stop offset=\".74\" stop-color=\"#D9A3CF\"/><stop offset=\".86\" stop-color=\"#9A3F8C\"/><stop offset=\"1\" stop-color=\"#6E2463\"/></radialGradient></defs><circle cx=\"50\" cy=\"50\" r=\"44\" fill=\"url(#on)\"/><circle cx=\"50\" cy=\"50\" r=\"29\" fill=\"#14100D\"/><circle cx=\"50\" cy=\"50\" r=\"29\" fill=\"none\" stroke=\"#F1D5EA\" stroke-width=\"2.4\"/><circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"none\" stroke=\"#B565A8\" stroke-width=\"1.2\" opacity=\".7\"/><path d=\"M20 34 A36 36 0 0 1 46 15\" stroke=\"#fff\" stroke-width=\"3\" fill=\"none\" opacity=\".45\" stroke-linecap=\"round\"/></svg>",
"cheese": "<svg viewBox=\"0 0 100 100\"><defs><linearGradient id=\"ch\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#FFD25A\"/><stop offset=\".55\" stop-color=\"#F6A91F\"/><stop offset=\"1\" stop-color=\"#DD8A0E\"/></linearGradient></defs><path d=\"M10 18 Q10 12 16 12 H84 Q90 12 90 18 V60 C90 66 84 64 82 70 C80 80 76 86 72 86 C68 86 68 74 64 70 C60 66 56 70 54 78 C52 88 46 92 42 84 C40 78 40 70 36 68 C30 66 30 76 26 76 C22 76 22 66 18 64 C12 62 10 60 10 54Z\" fill=\"url(#ch)\"/><path d=\"M16 18 H70\" stroke=\"#FFF0B8\" stroke-width=\"3\" stroke-linecap=\"round\" opacity=\".7\"/><ellipse cx=\"66\" cy=\"38\" rx=\"14\" ry=\"6\" fill=\"#fff\" opacity=\".18\" transform=\"rotate(-18 66 38)\"/><path d=\"M64 70 C60 66 56 70 54 78\" stroke=\"#C97A0A\" stroke-width=\"1.4\" fill=\"none\" opacity=\".6\"/></svg>",
"pickle": "<svg viewBox=\"0 0 100 100\"><defs><radialGradient id=\"pk\" cx=\"50%\" cy=\"50%\"><stop offset=\"0\" stop-color=\"#E4EDB0\"/><stop offset=\".45\" stop-color=\"#BFD27A\"/><stop offset=\".8\" stop-color=\"#8CAA45\"/><stop offset=\"1\" stop-color=\"#5D7E26\"/></radialGradient></defs><path d=\"M97.2,50.0 L92.4,56.1 L95.3,63.3 L88.9,67.8 L89.7,75.5 L82.3,78.0 L80.9,85.7 L73.1,86.0 L69.6,92.9 L62.1,91.1 L56.7,96.7 L50.0,92.8 L43.3,96.7 L37.9,91.1 L30.4,92.9 L26.9,86.0 L19.1,85.7 L17.7,78.0 L10.3,75.5 L11.1,67.8 L4.7,63.3 L7.6,56.1 L2.8,50.0 L7.6,43.9 L4.7,36.7 L11.1,32.2 L10.3,24.5 L17.7,22.0 L19.1,14.3 L26.9,14.0 L30.4,7.1 L37.9,8.9 L43.3,3.3 L50.0,7.2 L56.7,3.3 L62.1,8.9 L69.6,7.1 L73.1,14.0 L80.9,14.3 L82.3,22.0 L89.7,24.5 L88.9,32.2 L95.3,36.7 L92.4,43.9Z\" fill=\"#3F5F1A\"/><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"url(#pk)\"/><ellipse cx=\"66.0\" cy=\"50.0\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(90 66.0 50.0)\" fill=\"#F4F3D6\"/><ellipse cx=\"61.3\" cy=\"61.3\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(135 61.3 61.3)\" fill=\"#F4F3D6\"/><ellipse cx=\"50.0\" cy=\"66.0\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(180 50.0 66.0)\" fill=\"#F4F3D6\"/><ellipse cx=\"38.7\" cy=\"61.3\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(225 38.7 61.3)\" fill=\"#F4F3D6\"/><ellipse cx=\"34.0\" cy=\"50.0\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(270 34.0 50.0)\" fill=\"#F4F3D6\"/><ellipse cx=\"38.7\" cy=\"38.7\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(315 38.7 38.7)\" fill=\"#F4F3D6\"/><ellipse cx=\"50.0\" cy=\"34.0\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(360 50.0 34.0)\" fill=\"#F4F3D6\"/><ellipse cx=\"61.3\" cy=\"38.7\" rx=\"2.2\" ry=\"3.6\" transform=\"rotate(405 61.3 38.7)\" fill=\"#F4F3D6\"/><ellipse cx=\"66.0\" cy=\"50.0\" rx=\"1\" ry=\"1.8\" transform=\"rotate(90 66.0 50.0)\" fill=\"#C9C88E\"/><ellipse cx=\"61.3\" cy=\"61.3\" rx=\"1\" ry=\"1.8\" transform=\"rotate(135 61.3 61.3)\" fill=\"#C9C88E\"/><ellipse cx=\"50.0\" cy=\"66.0\" rx=\"1\" ry=\"1.8\" transform=\"rotate(180 50.0 66.0)\" fill=\"#C9C88E\"/><ellipse cx=\"38.7\" cy=\"61.3\" rx=\"1\" ry=\"1.8\" transform=\"rotate(225 38.7 61.3)\" fill=\"#C9C88E\"/><ellipse cx=\"34.0\" cy=\"50.0\" rx=\"1\" ry=\"1.8\" transform=\"rotate(270 34.0 50.0)\" fill=\"#C9C88E\"/><ellipse cx=\"38.7\" cy=\"38.7\" rx=\"1\" ry=\"1.8\" transform=\"rotate(315 38.7 38.7)\" fill=\"#C9C88E\"/><ellipse cx=\"50.0\" cy=\"34.0\" rx=\"1\" ry=\"1.8\" transform=\"rotate(360 50.0 34.0)\" fill=\"#C9C88E\"/><ellipse cx=\"61.3\" cy=\"38.7\" rx=\"1\" ry=\"1.8\" transform=\"rotate(405 61.3 38.7)\" fill=\"#C9C88E\"/><circle cx=\"50\" cy=\"50\" r=\"5\" fill=\"#EDF1C6\"/><ellipse cx=\"36\" cy=\"30\" rx=\"12\" ry=\"5\" fill=\"#fff\" opacity=\".3\" transform=\"rotate(-30 36 30)\"/></svg>",
"bacon": "<svg viewBox=\"0 0 120 100\"><defs><linearGradient id=\"bc\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7A2414\"/><stop offset=\".25\" stop-color=\"#B8432A\"/><stop offset=\".4\" stop-color=\"#F2C7A3\"/><stop offset=\".52\" stop-color=\"#C24A2E\"/><stop offset=\".7\" stop-color=\"#9B3020\"/><stop offset=\".82\" stop-color=\"#EBB892\"/><stop offset=\"1\" stop-color=\"#6E1E10\"/></linearGradient></defs><path d=\"M4 38 C18 22 30 46 46 32 C62 18 74 44 90 30 C102 20 112 28 116 30 V56 C112 54 102 46 90 56 C74 70 62 44 46 58 C30 72 18 48 4 64Z\" fill=\"url(#bc)\"/><path d=\"M4 38 C18 22 30 46 46 32 C62 18 74 44 90 30 C102 20 112 28 116 30\" stroke=\"#5A170B\" stroke-width=\"2\" fill=\"none\"/><g fill=\"#5A170B\" opacity=\".35\"><circle cx=\"24\" cy=\"44\" r=\"1.6\"/><circle cx=\"58\" cy=\"40\" r=\"1.4\"/><circle cx=\"82\" cy=\"46\" r=\"1.8\"/><circle cx=\"100\" cy=\"40\" r=\"1.3\"/><circle cx=\"38\" cy=\"54\" r=\"1.2\"/></g></svg>",
"pepper": "<svg viewBox=\"0 0 100 100\"><defs><radialGradient id=\"jp\" cx=\"45%\" cy=\"40%\"><stop offset=\"0\" stop-color=\"#6FBF3E\"/><stop offset=\".85\" stop-color=\"#2F7A1E\"/><stop offset=\"1\" stop-color=\"#1D5A12\"/></radialGradient></defs><circle cx=\"50\" cy=\"50\" r=\"44\" fill=\"url(#jp)\"/><circle cx=\"50\" cy=\"50\" r=\"36\" fill=\"#A6D46B\"/><circle cx=\"50\" cy=\"50\" r=\"33\" fill=\"#14100D\" opacity=\".88\"/><circle cx=\"50\" cy=\"50\" r=\"10\" fill=\"#EFF5D2\"/><ellipse cx=\"65.0\" cy=\"50.0\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(90 65.0 50.0)\" fill=\"#F7F2D8\"/><ellipse cx=\"61.5\" cy=\"59.6\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(130 61.5 59.6)\" fill=\"#F7F2D8\"/><ellipse cx=\"52.6\" cy=\"64.8\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(170 52.6 64.8)\" fill=\"#F7F2D8\"/><ellipse cx=\"42.5\" cy=\"63.0\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(210 42.5 63.0)\" fill=\"#F7F2D8\"/><ellipse cx=\"35.9\" cy=\"55.1\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(250 35.9 55.1)\" fill=\"#F7F2D8\"/><ellipse cx=\"35.9\" cy=\"44.9\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(290 35.9 44.9)\" fill=\"#F7F2D8\"/><ellipse cx=\"42.5\" cy=\"37.0\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(330 42.5 37.0)\" fill=\"#F7F2D8\"/><ellipse cx=\"52.6\" cy=\"35.2\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(370 52.6 35.2)\" fill=\"#F7F2D8\"/><ellipse cx=\"61.5\" cy=\"40.4\" rx=\"2.2\" ry=\"3.4\" transform=\"rotate(410 61.5 40.4)\" fill=\"#F7F2D8\"/><path d=\"M22 32 A34 34 0 0 1 44 14\" stroke=\"#fff\" stroke-width=\"3\" fill=\"none\" opacity=\".35\" stroke-linecap=\"round\"/></svg>",
"sesame": "<svg viewBox=\"0 0 100 100\"><defs><radialGradient id=\"ss\" cx=\"40%\" cy=\"35%\"><stop offset=\"0\" stop-color=\"#FFF6DD\"/><stop offset=\"1\" stop-color=\"#D9B979\"/></radialGradient></defs><g fill=\"url(#ss)\" stroke=\"#B8955A\" stroke-width=\".8\"><ellipse cx=\"30\" cy=\"40\" rx=\"7\" ry=\"11\" transform=\"rotate(30 30 40)\"/><ellipse cx=\"64\" cy=\"30\" rx=\"7\" ry=\"11\" transform=\"rotate(-20 64 30)\"/><ellipse cx=\"54\" cy=\"68\" rx=\"7\" ry=\"11\" transform=\"rotate(60 54 68)\"/></g></svg>"
};
  var INGIMG = D.ingredientes || {};
  // posições em fração do tamanho do prato: [x, y, tamanho, rotação, atraso]
  var SPOTS = [[-0.52, -0.30, 0.22, -24, 0], [0.50, -0.36, 0.20, 28, 0.08], [-0.56, 0.22, 0.20, 18, 0.16], [0.54, 0.24, 0.22, -30, 0.24], [0.06, -0.58, 0.17, 40, 0.32], [-0.30, -0.54, 0.09, 0, 0.4], [0.32, 0.52, 0.09, 0, 0.44]];


  /* ---------- navegação: funciona também em pré-visualização e celular ---------- */
  var PAGES = window.CABANA_PAGES || null;
  function go(key) {
    var m = PAGES[key === 'onde' ? 'inicio' : key]; if (!m) return;
    var k = key === 'onde' ? 'inicio' : key;
    var old = document.querySelector('main');
    var fresh = document.getElementById('pg-' + k).content.cloneNode(true).querySelector('main');
    if (old) old.replaceWith(fresh); else document.body.insertBefore(fresh, document.querySelector('.footer'));
    page = m[0]; document.body.setAttribute('data-page', page); document.body.className = m[1] || ''; document.title = m[2];
    header.querySelectorAll('a').forEach(function (a) { var h = a.getAttribute('href'); if (h === '#' + k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var ac = header.querySelector('.secnav [aria-current]'); if (ac) ac.parentNode.parentNode.scrollLeft = ac.parentNode.offsetLeft - 18;
    try { sessionStorage.setItem('cabana_pg', k); } catch (e) {}
    renderPage();
    if (key === 'onde') { var o = document.getElementById('onde'); if (o) o.scrollIntoView({ behavior: 'instant' }); } else window.scrollTo({ top: 0, behavior: 'instant' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href').slice(1); if (!id) return;
    if (PAGES && (PAGES[id] || id === 'onde')) { e.preventDefault(); if (id === 'onde' && page === 'home') { document.getElementById('onde').scrollIntoView({ behavior: 'smooth' }); } else go(id); return; }
    var t = document.getElementById(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
  });

  var TIMERS = [];
  function renderPage() {
    TIMERS.forEach(clearInterval); TIMERS = [];
  /* ---------- página inicial ---------- */
  if (page === 'home') {
    var heroItems = D.hero.map(function (id) { return ITEMS[id]; });
    var hero = document.querySelector('[data-hero]');
    var stage = hero.querySelector('.hero-plate');
    var big = hero.querySelector('.hero-bigname');
    stage.innerHTML = heroItems.map(function (it, i) { return '<div class="hero-burger' + (i ? ' is-out' : '') + '" aria-hidden="' + (i ? 'true' : 'false') + '">' + pic(it.img, it.nome) + '</div>'; }).join('') + '<div class="ings" aria-hidden="true"></div>';
    var ingBox = stage.querySelector('.ings');
    var dots = hero.querySelector('.hero-dots');
    dots.innerHTML = heroItems.map(function (it, i) { return '<button type="button" aria-label="Ver ' + esc(it.nome) + '"><span></span></button>'; }).join('');
    var hi = 0, timer;
    function placeIngs(it) {
      var w = stage.clientWidth || 300;
      var list = (it.ing || []).filter(function (k) { return INGIMG[k]; }); // só aparecem se tiver foto real em menu.js
      ingBox.innerHTML = list.map(function (k, i) {
        var s = SPOTS[i] || SPOTS[0];
        return '<span class="ing" style="--x:' + Math.round(s[0] * w) + 'px;--y:' + Math.round(s[1] * w) + 'px;--s:' + Math.round(s[2] * w) + 'px;--r:' + s[3] + 'deg;--d:' + s[4] + 's">' + '<img src="' + INGIMG[k] + '" alt="">' + '</span>';
      }).join('');
      hero.classList.remove('is-live'); void hero.offsetWidth; hero.classList.add('is-live');
    }
    function showHero(i) {
      hi = (i + heroItems.length) % heroItems.length;
      var it = heroItems[hi];
      stage.querySelectorAll('.hero-burger').forEach(function (b, k) { b.classList.toggle('is-out', k !== hi); b.setAttribute('aria-hidden', k === hi ? 'false' : 'true'); });
      big.textContent = it.curto || it.nome;
      hero.querySelector('[data-h-tag]').textContent = (it.tag || 'Mais pedido') + ' · #' + (hi + 1);
      var nm = it.nome.split(' ');
      var last = nm.pop();
      hero.querySelector('[data-h-name]').innerHTML = (nm.length ? esc(nm.join(' ')) + '<br>' : '') + '<span class="accent">' + esc(last) + '</span>';
      hero.querySelector('[data-h-desc]').textContent = it.desc;
      hero.querySelector('[data-h-price]').textContent = brl(it.preco);
      hero.querySelector('[data-h-add]').setAttribute('data-add', it.id);
      hero.querySelector('[data-h-count]').innerHTML = '0' + (hi + 1) + ' <small>/ 0' + heroItems.length + '</small>';
      dots.querySelectorAll('button').forEach(function (d, k) { d.setAttribute('aria-current', k === hi ? 'true' : 'false'); });
      placeIngs(it);
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { showHero(hi + 1); }, 5500); TIMERS.push(timer); }
    dots.querySelectorAll('button').forEach(function (d, k) { d.addEventListener('click', function () { showHero(k); restart(); }); });
    var sx = null;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { showHero(hi + (dx < 0 ? 1 : -1)); restart(); } sx = null; });
    showHero(0); restart();

    // esteira de destaques
    var all = []; D.lanches.forEach(function (c) { if (c.id !== 'combos' && c.id !== 'kids') all = all.concat(c.itens); });
    var feat = all.filter(function (i) { return i.img; }).concat(all.filter(function (i) { return !i.img; }).slice(0, 3));
    var card = function (it) {
      return '<article class="fcard"><div class="pic">' + pic(it.img, it.nome) + '</div><h3>' + esc(it.nome) + '</h3><p>' + esc(it.desc) + '</p>' +
        '<div class="row"><span class="price">' + brl(it.preco) + '</span><button type="button" class="addMini" data-add="' + it.id + '" aria-label="Adicionar ' + esc(it.nome) + ' ao pedido">' + ICON.plus + '</button></div></article>';
    };
    var track = document.querySelector('[data-marquee]');
    track.innerHTML = feat.map(card).join('') + feat.map(card).join('').replace(/<article class="fcard">/g, '<article class="fcard" aria-hidden="true">');
    track.querySelectorAll('[aria-hidden="true"] button').forEach(function (b) { b.tabIndex = -1; });
    // no celular a esteira para quando a pessoa toca, para dar tempo de apertar o +
    var mq = track.parentNode, mqT;
    var pause = function () { mq.classList.add('is-paused'); clearTimeout(mqT); mqT = setTimeout(function () { mq.classList.remove('is-paused'); }, 4000); };
    mq.addEventListener('touchstart', pause, { passive: true });
    mq.addEventListener('pointerdown', pause);

    // carrossel de combos
    var combos = D.combosDestaque.map(function (id) { return ITEMS[id]; });
    var car = document.querySelector('[data-combos]');
    car.innerHTML = combos.map(function (it) { return '<div class="combo-item" data-pos="hide"><div class="plate">' + pic(it.img, it.nome) + '</div><span class="tag">' + brl(it.preco) + '</span></div>'; }).join('');
    var ci = 0, ctimer;
    function showCombo(i) {
      ci = (i + combos.length) % combos.length;
      car.querySelectorAll('.combo-item').forEach(function (n, k) {
        var d = (k - ci + combos.length) % combos.length;
        n.setAttribute('data-pos', d === 0 ? '0' : d === 1 ? '1' : d === combos.length - 1 ? '-1' : 'hide');
      });
      var it = combos[ci];
      document.querySelector('[data-c-name]').textContent = it.nome;
      document.querySelector('[data-c-desc]').textContent = it.desc;
      document.querySelector('[data-c-add]').setAttribute('data-add', it.id);
    }
    function crestart() { clearInterval(ctimer); ctimer = setInterval(function () { showCombo(ci + 1); }, 3800); TIMERS.push(ctimer); }
    showCombo(0); crestart();

    // depoimentos
    document.querySelector('[data-reviews]').innerHTML = D.depoimentos.map(function (r) {
      return '<figure class="review"><div class="stars" aria-label="5 de 5 estrelas">★★★★★</div><blockquote style="margin:0"><p>' + esc(r.texto) + '</p></blockquote>' +
        '<figcaption class="who"><span aria-hidden="true">' + esc(r.nome.charAt(0)) + '</span><div><b>' + esc(r.nome) + '</b><em>' + esc(r.info) + '</em></div></figcaption></figure>';
    }).join('');

    // onde fica
    document.querySelectorAll('[data-maps]').forEach(function (a) { a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(D.mapsQuery); });
    document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = waLink(a.getAttribute('data-wa')); });
    document.querySelectorAll('[data-ig]').forEach(function (a) { a.href = D.instagram; });
  }

  /* ---------- página de lanches ---------- */
  if (page === 'lanches') {
    var tabs = document.querySelector('[data-tabs]');
    var box = document.querySelector('[data-cats]');
    tabs.innerHTML = D.lanches.map(function (c, i) { return '<a class="tab" href="#' + c.id + '" aria-current="' + (i ? 'false' : 'true') + '">' + esc(c.nome) + '</a>'; }).join('');
    box.innerHTML = D.lanches.map(function (c) {
      return '<section class="cat" id="' + c.id + '"><h2>' + esc(c.nome) + '<small>' + esc(c.nota || '') + '</small></h2><div class="pgrid">' + c.itens.map(function (it) {
        return '<article class="pcard"><div class="pic">' + (it.tag ? '<span class="badge' + (it.tag === 'Novo' ? ' new' : '') + '">' + esc(it.tag) + '</span>' : '') + pic(it.img, it.nome) + '</div>' +
          '<span class="pprice-top">' + brl(it.preco) + '</span>' +
          '<div class="body"><h3>' + esc(it.nome) + '</h3><p>' + esc(it.desc) + '</p><div class="foot" data-qtywrap><span class="price">' + brl(it.preco) + '</span>' +
          '<span style="display:flex;gap:6px;align-items:center"><span class="qty"><button type="button" data-dec aria-label="Diminuir quantidade de ' + esc(it.nome) + '">−</button><output>1</output><button type="button" data-inc aria-label="Aumentar quantidade de ' + esc(it.nome) + '">+</button></span>' +
          '<button type="button" class="addBtn" data-add="' + it.id + '" aria-label="Adicionar ' + esc(it.nome) + ' ao pedido">' + ICON.plus + '</button></span></div></div></article>';
      }).join('') + '</div></section>';
    }).join('');
    spyTabs(tabs);
  }

  /* ---------- página de bebidas ---------- */
  if (page === 'bebidas') {
    var tabsB = document.querySelector('[data-tabs]');
    tabsB.innerHTML = D.bebidas.map(function (c, i) { return '<a class="tab" href="#' + c.id + '" aria-current="' + (i ? 'false' : 'true') + '">' + esc(c.nome) + '</a>'; }).join('');
    document.querySelector('[data-cats]').innerHTML = D.bebidas.map(function (c) {
      return '<section class="cat" id="' + c.id + '"><h2>' + esc(c.nome) + '</h2><div class="dgrid">' + c.itens.map(function (it) {
        return '<article class="drink"><div class="glass">' + pic(it.img, it.nome) + '</div>' + (it.tag ? '<span class="tagline">' + esc(it.tag) + '</span>' : '') +
          '<h3>' + esc(it.nome) + '</h3><p>' + esc(it.desc) + '</p><div class="row"><span class="price">' + brl(it.preco) + '</span><button type="button" class="addMini" style="background:var(--coal-3)" data-add="' + it.id + '" aria-label="Adicionar ' + esc(it.nome) + ' ao pedido">' + ICON.plus + '</button></div></article>';
      }).join('') + '</div></section>';
    }).join('');
    spyTabs(tabsB);
  }

  /* ---------- página de sobremesas ---------- */
  if (page === 'sobremesas') {
    document.querySelector('[data-sweets]').innerHTML = D.sobremesas.map(function (it) {
      return '<li class="sitem"><div class="plate">' + pic(it.img, it.nome) + '</div><div class="txt"><h3>' + esc(it.nome) + '</h3><p>' + esc(it.desc) + '</p>' +
        '<div class="row"><span class="price">' + brl(it.preco) + '</span><button type="button" class="addMini" data-add="' + it.id + '" aria-label="Adicionar ' + esc(it.nome) + ' ao pedido">' + ICON.plus + '</button></div></div></li>';
    }).join('');
    document.querySelector('[data-extras]').innerHTML = D.adicionais.map(function (it) {
      return '<li><span>' + esc(it.nome) + '</span><i></i><b>' + brl(it.preco) + '</b><button type="button" data-add="' + it.id + '" aria-label="Adicionar ' + esc(it.nome) + '">' + ICON.plus + '</button></li>';
    }).join('');
  }

  }
  renderPage();
  if (PAGES && window.CABANA_START === 'onde') { var oo = document.getElementById('onde'); if (oo) setTimeout(function () { oo.scrollIntoView(); }, 50); }

  function spyTabs(tabsEl) {
    var anchors = tabsEl.querySelectorAll('a');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        anchors.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.setAttribute('aria-current', on ? 'true' : 'false');
          if (on) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.cat').forEach(function (s) { io.observe(s); });
  }
})();
