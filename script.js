/* UE Debate and Speech Society — accessible navigation + six scroll effects.
   Vanilla JavaScript: no libraries, no npm, safe on GitHub Pages. */
(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => motionPreference.matches;
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  // Mobile navigation: close and restore focus WITHOUT disrupting hash scrolling.
  const toggle = $('.menu-toggle');
  const drawer = $('#nav-drawer');
  const closeButton = $('.drawer-close');
  let previousFocus = null;

  function setMenu(open, restoreFocus = true) {
    if (!toggle || !drawer) return;
    const wasOpen = document.body.classList.contains('menu-open');
    if (open && !wasOpen) previousFocus = document.activeElement;
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    drawer.inert = !open;
    if (open) closeButton?.focus({ preventScroll: true });
    else if (wasOpen && restoreFocus && previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
  }
  toggle?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('[data-close-menu]').forEach(el => el.addEventListener('click', () => setMenu(false)));
  $$('.drawer-link').forEach(el => el.addEventListener('click', () => setMenu(false, false)));
  document.addEventListener('keydown', event => {
    if (!document.body.classList.contains('menu-open')) return;
    if (event.key === 'Escape') { setMenu(false); return; }
    if (event.key !== 'Tab' || !drawer) return;
    const focusables = $$('button:not([disabled]),a[href]', drawer);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  // Smooth in-page navigation, including links that use index.html#section
  // while the homepage is being visited from the directory root URL.
  const normalizedPath = path => path.endsWith('/') ? path + 'index.html' : path;
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(anchor.href, location.href);
    if (!url.hash || url.origin !== location.origin ||
        normalizedPath(url.pathname) !== normalizedPath(location.pathname)) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    if (document.body.classList.contains('menu-open')) setMenu(false, false);
    // Updating the hash also preserves the expected Back-button behavior.
    if (location.hash !== url.hash) history.pushState(null, '', url.hash);
    target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  // Existing utility actions.
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
  const copy = $('[data-copy-email]');
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('uedebssoc.mnl@gmail.com');
      copy.textContent = 'Email copied ✓';
    } catch {
      copy.textContent = 'Email: uedebssoc.mnl@gmail.com';
    }
    window.setTimeout(() => { copy.textContent = 'Copy email address ⧉'; }, 2400);
  });

  // Scroll progress: schedule at most one update per animation frame.
  const progress = $('#scroll-progress');
  let scrollQueued = false;
  const activePhotos = new Set();
  function updateScrollEffects() {
    scrollQueued = false;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = documentHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / documentHeight)) : 0;
    if (progress) progress.style.transform = `scaleX(${percent})`;

    if (reduceMotion()) return;
    for (const frame of activePhotos) {
      const rect = frame.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      const ratio = (middle - window.innerHeight / 2) / ((window.innerHeight + rect.height) / 2);
      const shift = Math.round(Math.max(-1, Math.min(1, ratio)) * -16);
      frame.style.setProperty('--photo-shift', `${shift}px`);
    }
  }
  function queueScrollUpdate() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateScrollEffects);
  }
  window.addEventListener('scroll', queueScrollUpdate, { passive: true });
  window.addEventListener('resize', queueScrollUpdate, { passive: true });
  window.addEventListener('pageshow', queueScrollUpdate);
  queueScrollUpdate();

  // Photo auto-loader: same filenames as before. Missing photos retain their
  // elegant Canva-inspired placeholders, rather than a broken-image icon.
  const photoObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activePhotos.add(entry.target);
            entry.target.classList.add('parallax-active');
          } else {
            activePhotos.delete(entry.target);
            entry.target.classList.remove('parallax-active');
          }
        }
        queueScrollUpdate();
      }, { rootMargin: '120px 0px' })
    : null;

  $$('[data-photo]').forEach(frame => {
    const name = frame.getAttribute('data-photo');
    if (!name || !/^[\w-]+\.(?:jpe?g|png|webp)$/i.test(name)) return;
    const image = new Image();
    image.className = 'site-photo';
    image.alt = ''; // Decorative; the section's nearby text provides context.
    image.decoding = 'async';
    image.loading = frame.classList.contains('photo-hero') ? 'eager' : 'lazy';
    image.onload = () => {
      frame.prepend(image);
      frame.classList.add('has-photo');
      if (!frame.classList.contains('event-photo') && !reduceMotion()) {
        if (photoObserver) photoObserver.observe(frame);
        else activePhotos.add(frame);
      }
      queueScrollUpdate();
    };
    image.src = `images/${name}`;
  });

  // Reveal targets are chosen to preserve card hover behavior and section layout.
  // Without IntersectionObserver the page is shown normally, never hidden.
  const revealSelector = [
    '.about-layout', '.section-head-row', '.program-item',
    '.event-layout', '.gallery h2', '.gallery-lead', '.gallery-photo',
    '.engagement-layout', '.membership-layout', '.contact-layout',
    '.learn h2', '.learn-cards article', '.quote-band h2',
    '.related h2', '.related-links a', '.related-cta'
  ].join(', ');

  if (!reduceMotion() && 'IntersectionObserver' in window) {
    const elements = $$(revealSelector);
    elements.forEach((el, index) => {
      el.setAttribute('data-reveal', '');
      if (el.matches('.program-item, .gallery-photo, .learn-cards article, .related-links a')) {
        el.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
      }
    });
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -30px 0px', threshold: 0.08 });
    elements.forEach(el => revealObserver.observe(el));
    document.body.classList.add('motion-ready');
  } else if (!reduceMotion()) {
    document.body.classList.add('motion-ready'); // Hero opening only; content stays visible.
  }

  // Follow live changes to the OS reduced-motion preference.
  motionPreference.addEventListener?.('change', () => {
    if (reduceMotion()) {
      $$('[data-reveal]').forEach(el => el.classList.add('is-visible'));
      activePhotos.forEach(frame => frame.style.setProperty('--photo-shift', '0px'));
    }
    queueScrollUpdate();
  });
})();
