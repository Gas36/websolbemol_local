/* ============================================================
   SolBemol — main.js · JavaScript puro (sin dependencias)
   1. Header transparente que se auto-oculta y reaparece al
      acercar el mouse al borde superior (o al hacer scroll arriba)
   2. Menú deslizante accesible (hamburguesa + backdrop)
   3. Aparición de secciones al hacer scroll (IntersectionObserver)
   4. Año dinámico en el footer
   5. Validación básica del formulario de contacto (solo front;
      el envío real se conecta en WordPress vía WP Mail SMTP)
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;

  /* ---------- 1. HEADER AUTO-OCULTO / REAPARICIÓN ---------- */
  var header = document.querySelector('[data-header]');
  var hero = document.querySelector('.hero');
  var lastY = window.scrollY || 0;
  var mouseNearTop = false;
  var navOpen = false;

  function heroBottom() { return hero ? hero.offsetHeight - 80 : 320; }

  function applyHeader() {
    if (!header) return;
    var y = window.scrollY || 0;
    var overHero = y < heroBottom();
    var scrollingUp = y < lastY - 2;
    var nearPageTop = y < 10;

    var show = overHero || mouseNearTop || scrollingUp || navOpen || nearPageTop;
    header.classList.toggle('is-hidden', !show);
    // Sólo se ve "sólido" (fondo índigo) cuando está visible fuera del hero
    header.classList.toggle('is-solid', show && !overHero);
    lastY = y;
  }

  window.addEventListener('scroll', applyHeader, { passive: true });
  window.addEventListener('resize', applyHeader);
  // Reaparece al acercar el mouse a la franja superior de la página
  window.addEventListener('mousemove', function (e) {
    var near = e.clientY <= 64;
    if (near !== mouseNearTop) { mouseNearTop = near; applyHeader(); }
  });
  applyHeader();

  /* ---------- 2. MENÚ DESLIZANTE ---------- */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  var backdrop = document.querySelector('[data-nav-backdrop]');

  function openNav() {
    navOpen = true;
    if (toggle) { toggle.setAttribute('aria-expanded', 'true'); toggle.setAttribute('aria-label', 'Cerrar menú'); }
    if (nav) nav.classList.add('is-open');
    if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add('is-open'); }); }
    body.classList.add('nav-open');
    applyHeader();
  }

  function closeNav() {
    navOpen = false;
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); }
    if (nav) nav.classList.remove('is-open');
    if (backdrop) { backdrop.classList.remove('is-open'); setTimeout(function () { backdrop.hidden = true; }, 380); }
    body.classList.remove('nav-open');
    applyHeader();
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      (toggle.getAttribute('aria-expanded') === 'true') ? closeNav() : openNav();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeNav);
  if (nav) nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navOpen) closeNav(); });

  /* ---------- 3. APARICIÓN AL SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4. AÑO DINÁMICO ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 5. VALIDACIÓN DEL FORMULARIO ---------- */
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');

  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, msg) {
      var wrap = field.closest('.field');
      var errEl = form.querySelector('[data-error-for="' + field.name + '"]');
      if (wrap) wrap.classList.toggle('has-error', !!msg);
      if (errEl) errEl.textContent = msg || '';
    }

    function validateField(field) {
      var v = (field.value || '').trim();
      switch (field.name) {
        case 'nombre':
          if (!v) return 'Cuéntanos tu nombre.';
          break;
        case 'email':
          if (!v) return 'Necesitamos un email para responderte.';
          if (!emailRe.test(v)) return 'Revisa el formato del email.';
          break;
        case 'telefono':
          if (!v) return 'Déjanos un teléfono de contacto.';
          if (v.replace(/[^0-9]/g, '').length < 8) return 'Ingresa un teléfono válido.';
          break;
        case 'mensaje':
          if (!v) return 'Escríbenos un mensaje, aunque sea breve.';
          break;
      }
      return '';
    }

    // Limpia el error mientras el usuario corrige
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () { if (field.name) setError(field, ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('input[required], textarea[required]');
      var firstInvalid = null;

      fields.forEach(function (field) {
        var msg = validateField(field);
        setError(field, msg);
        if (msg && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        if (statusEl) { statusEl.textContent = 'Revisa los campos marcados.'; statusEl.classList.remove('is-ok'); }
        firstInvalid.focus();
        return;
      }

      // Validación OK. NOTA: aquí NO se envía correo.
      // El envío real se conectará en WordPress (WP Mail SMTP → casilla del hosting).
      if (statusEl) {
        statusEl.textContent = '¡Gracias! Recibimos tu mensaje y te contactaremos pronto.';
        statusEl.classList.add('is-ok');
      }
      form.reset();
    });
  }

})();
