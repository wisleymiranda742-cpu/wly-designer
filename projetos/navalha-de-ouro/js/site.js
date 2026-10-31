(function () {
  var ACCENT = '#C9A24A';
  var slides = document.querySelectorAll('img.slide');
  var txts = document.querySelectorAll('.fadeTxt');
  var dots = document.querySelectorAll('.dot');
  var n = slides.length;
  if (!n) return;
  var active = 0, timer = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(i) {
    active = (i + n) % n;
    for (var k = 0; k < n; k++) {
      var on = k === active;
      var s = slides[k];
      s.style.opacity = on ? 1 : 0;
      s.style.transform = on ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(24px) scale(0.97)';
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (txts[k]) {
        txts[k].style.opacity = on ? 1 : 0;
        txts[k].style.transform = on ? 'translateY(0)' : 'translateY(10px)';
        txts[k].setAttribute('aria-hidden', on ? 'false' : 'true');
      }
      if (dots[k]) {
        dots[k].style.width = on ? '40px' : '16px';
        dots[k].style.background = on ? ACCENT : '#5A5A57';
      }
    }
  }
  function restart() {
    if (timer) clearInterval(timer);
    if (!reduce) timer = setInterval(function () { show(active + 1); }, 4000);
  }

  for (var d = 0; d < dots.length; d++) {
    (function (idx) {
      var btn = dots[idx].parentElement;
      if (btn) btn.addEventListener('click', function () { show(idx); restart(); });
    })(d);
  }
  var prev = document.querySelector('[aria-label="Barbeiro anterior"]');
  var next = document.querySelector('[aria-label="Próximo barbeiro"]');
  if (prev) prev.addEventListener('click', function () { show(active - 1); restart(); });
  if (next) next.addEventListener('click', function () { show(active + 1); restart(); });

  show(0);
  restart();
})();
