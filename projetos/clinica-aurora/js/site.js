(function () {
  // Menu do celular
  var menuBtn = document.querySelector('.menuBtn');
  var menu = document.getElementById('menu-links');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Dúvidas frequentes
  var faqButtons = document.querySelectorAll('#duvidas button');
  function setFaq(btn, open) {
    var answer = btn.nextElementSibling, sign = btn.querySelector('span:last-child');
    if (answer) answer.style.display = open ? '' : 'none';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (sign) sign.textContent = open ? '−' : '+';
  }
  faqButtons.forEach(function (btn, i) {
    setFaq(btn, i === 0);
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      faqButtons.forEach(function (b) { setFaq(b, false); });
      setFaq(btn, !wasOpen);
    });
  });

  // Comparador antes e depois
  var range = document.getElementById('cmp-range');
  if (range) {
    var box = range.parentElement;
    var antes = box.children[1], line = box.children[2], handle = box.children[3];
    var update = function () {
      var pos = Number(range.value);
      antes.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
      line.style.left = pos + '%';
      handle.style.left = pos + '%';
    };
    range.addEventListener('input', update);
    update();
  }

  // Mapa do Google: carrega só quando chega perto da tela
  var slot = document.getElementById('mapa-slot');
  if (slot) {
    var loadMap = function () {
      if (slot.dataset.loaded) return;
      slot.dataset.loaded = '1';
      var f = document.createElement('iframe');
      f.title = 'Mapa com a localização da Clínica Aurora';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Av. das Palmeiras, 850, Umarizal, Belém - PA') + '&output=embed';
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
      slot.appendChild(f);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); io.disconnect(); } }, { rootMargin: '400px' });
      io.observe(slot);
    } else { loadMap(); }
  }

  // Implante 3D: carrega depois do resto da página
  var c = document.getElementById('implant3d');
  if (!c) return;
  function fallback(err) {
    if (c.dataset.fallback) return;
    c.dataset.fallback = '1';
    if (window.console) console.warn('Implante 3D indisponível, usando imagem:', err || 'WebGL não suportado');
    var img = document.createElement('img');
    img.className = 'spin';
    img.src = 'img/implante.webp'; img.alt = 'Implante dentário com coroa em porcelana';
    img.style.cssText = 'position:absolute;inset:0;margin:auto;width:80%;height:auto';
    c.parentElement.appendChild(img);
  }
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = ok; s.onerror = fail; document.head.appendChild(s);
    });
  }
  function start() {
    loadScript('js/three.min.js').then(function () { return loadScript('js/implante-data.js'); })
      .then(init3d).catch(fallback);
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);

  function buf(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u.buffer; }

  function init3d() {
    var T = window.THREE, data = window.IMPLANT_DATA;
    if (!T || !data) return fallback();
    try {
      var w = c.clientWidth || 360, h = c.clientHeight || 580;
      var r = new T.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      r.setSize(w, h, false);
      r.outputEncoding = T.sRGBEncoding;
      r.toneMapping = T.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.05;
      var scene = new T.Scene();
      var cam = new T.PerspectiveCamera(28, w / h, 0.1, 100);
      cam.position.set(0, 1.4, 17);
      cam.lookAt(0, 0.4, 0);

      var pm = new T.PMREMGenerator(r);
      var env = new T.Scene();
      env.background = new T.Color(0x93a99c);
      var pg = new T.PlaneGeometry(1, 1);
      function panel(col, x, y, z, sx, sy, ry, rx) {
        var m = new T.Mesh(pg, new T.MeshBasicMaterial({ color: col, side: T.DoubleSide }));
        m.position.set(x, y, z); m.scale.set(sx, sy, 1);
        m.rotation.y = ry || 0; m.rotation.x = rx || 0;
        env.add(m);
      }
      panel(0xffffff, 0, 6, 0, 10, 10, 0, Math.PI / 2);
      panel(0xffffff, -6, 1, 2, 3, 9, Math.PI / 2, 0);
      panel(0xe6f2ea, 6, 0, -1, 3, 9, -Math.PI / 2, 0);
      panel(0xffffff, 1, 1, 7, 5, 2.5, 0, 0);
      panel(0x26332c, 0, -5, 0, 14, 14, 0, -Math.PI / 2);
      scene.environment = pm.fromScene(env, 0.03).texture;

      scene.add(new T.HemisphereLight(0xffffff, 0x6f8a7a, 0.55));
      var key = new T.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 6); scene.add(key);
      var rim = new T.DirectionalLight(0xe3f0e8, 0.7); rim.position.set(-5, 3, -4); scene.add(rim);

      var crownTex = new T.TextureLoader().load(window.IMPLANT_TEX);
      crownTex.encoding = T.sRGBEncoding;
      var mats = {
        Coroa_Ceramica: new T.MeshPhysicalMaterial({ color: 0xffffff, map: crownTex, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04 }),
        Pilar_Titanio: new T.MeshStandardMaterial({ color: 0xe8e5e0, metalness: 1, roughness: 0.1 }),
        Implante_Titanio: new T.MeshStandardMaterial({ color: 0xdad6d0, metalness: 1, roughness: 0.28 })
      };
      var g = new T.Group(), model = new T.Group();
      model.scale.setScalar(5.8);
      g.add(model);
      g.position.y = 0.3; g.rotation.x = 0.1; g.rotation.y = 0.5;
      scene.add(g);

      var k = data.scale / 32767;
      Object.keys(data.parts).forEach(function (name) {
        var part = data.parts[name];
        var q = new Int16Array(buf(part.p)), pos = new Float32Array(q.length);
        for (var i = 0; i < q.length; i++) pos[i] = q[i] * k;
        var geo = new T.BufferGeometry();
        geo.setAttribute('position', new T.BufferAttribute(pos, 3));
        if (part.uv) {
          var qu = new Uint16Array(buf(part.uv)), uv = new Float32Array(qu.length);
          for (var j = 0; j < qu.length; j++) uv[j] = qu[j] / 65535;
          geo.setAttribute('uv', new T.BufferAttribute(uv, 2));
        }
        geo.setIndex(new T.BufferAttribute(new Uint16Array(buf(part.i)), 1));
        geo.computeVertexNormals();
        model.add(new T.Mesh(geo, mats[name] || mats.Implante_Titanio));
      });

      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var dragging = false, lx = 0, vel = 0;
      c.addEventListener('pointerdown', function (e) { dragging = true; lx = e.clientX; c.style.cursor = 'grabbing'; try { c.setPointerCapture(e.pointerId); } catch (err) {} });
      c.addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - lx; lx = e.clientX; g.rotation.y += dx * 0.012; vel = Math.max(-6, Math.min(6, dx * 0.12)); });
      function up() { dragging = false; c.style.cursor = 'grab'; }
      c.addEventListener('pointerup', up);
      c.addEventListener('pointercancel', up);
      if (window.ResizeObserver) {
        new ResizeObserver(function () {
          var nw = c.clientWidth, nh = c.clientHeight;
          if (!nw || !nh) return;
          r.setSize(nw, nh, false); cam.aspect = nw / nh; cam.updateProjectionMatrix();
        }).observe(c);
      }
      var visible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(c);
      }
      var last = performance.now();
      function tick(now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (visible) {
          if (!dragging) { g.rotation.y += ((reduce ? 0 : 0.55) + vel) * dt; vel *= 0.94; }
          if (!reduce) { g.position.y = 0.3 + Math.sin(now / 1100) * 0.08; g.rotation.z = Math.sin(now / 1700) * 0.035; }
          r.render(scene, cam);
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    } catch (e) { fallback(); }
  }
})();
