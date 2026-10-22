/* Creative Automation — navigatie, scroll en motion */
(() => {
  document.documentElement.classList.add('js');

  /* ---------- Modules komen binnen bij het scrollen ----------
     Eén keer per module, met een vaste duur: de animatie hangt niet af van de scrollsnelheid. */
  const moduleIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const module = entry.target;
      module.classList.add('is-in');
      moduleIo.unobserve(module);
      // Na de volledige intro: hover-overgangen zonder vertraging
      setTimeout(() => module.classList.add('is-settled'), 1800);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.module').forEach((m) => moduleIo.observe(m));

  /* ---------- Mobiel menu ---------- */
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const background = [document.querySelector('main'), document.querySelector('footer')];

  const setMenu = (open, returnFocus = true) => {
    const wasOpen = nav.classList.contains('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    // Achtergrond onbereikbaar voor toetsenbord en schermlezer zolang het menu open is
    background.forEach((el) => { el.inert = open; });
    if (open) nav.querySelector('a').focus({ preventScroll: true });
    else if (wasOpen && returnFocus) burger.focus({ preventScroll: true });
  };

  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false, false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && nav.classList.contains('is-open')) setMenu(false, false);
  });

  /* ---------- Actieve sectie in de navigatie ---------- */
  const navLinks = [...document.querySelectorAll('.nav__link')];
  const sectionIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach((s) => sectionIo.observe(s));

  /* ---------- Voortgangsbalk en header ---------- */
  const bar = document.querySelector('.progress__bar');
  const header = document.querySelector('.header');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    // Header verdwijnt bij naar beneden scrollen, komt terug bij naar boven scrollen
    const menuOpen = nav.classList.contains('is-open');
    header.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 300);
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
})();
