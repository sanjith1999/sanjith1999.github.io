/* Progressive enhancement only — every page works with this file absent. */
(function () {
  'use strict';

  /* Mobile navigation ----------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* Hero tagline ----------------------------------------------------------- */
  var role = document.querySelector('.hero-role[data-roles]');
  if (!role) return;

  var roles = role.getAttribute('data-roles').split('|').map(function (s) { return s.trim(); });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Respect the user's motion preference: show the first role and stop.
  if (reduced.matches || roles.length === 0) return;

  var text = document.createElement('span');
  var caret = document.createElement('span');
  caret.className = 'caret blink';
  caret.textContent = '▏';
  caret.setAttribute('aria-hidden', 'true');

  role.textContent = '';
  role.appendChild(text);
  role.appendChild(caret);
  role.setAttribute('aria-label', roles.join(', '));

  var index = 0;
  var chars = 0;
  var deleting = false;

  function tick() {
    var current = roles[index];
    chars += deleting ? -1 : 1;
    text.textContent = current.slice(0, chars);

    var delay = deleting ? 40 : 75;

    if (!deleting && chars === current.length) {
      if (roles.length === 1) { caret.classList.remove('blink'); return; }
      deleting = true;
      delay = 1800;
    } else if (deleting && chars === 0) {
      deleting = false;
      index = (index + 1) % roles.length;
      delay = 300;
    }

    caret.classList.toggle('blink', delay > 300);
    setTimeout(tick, delay);
  }

  tick();
})();
