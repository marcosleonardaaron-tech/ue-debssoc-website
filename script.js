/* UE DebSSoc — accessible site navigation and handy UI features */
const menuButton = document.querySelector('.menu-toggle');
const menuPanel = document.getElementById('site-menu');
const backdrop = document.querySelector('.menu-backdrop');
const menuClose = document.querySelector('.menu-close');
let previousFocus = null;

function setMenu(open) {
  if (!menuButton || !menuPanel) return;
  if (open) previousFocus = document.activeElement;
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuPanel.inert = !open;
  if (open) menuClose?.focus();
  else if (previousFocus instanceof HTMLElement) previousFocus.focus();
}
menuButton?.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
document.querySelectorAll('[data-close-menu], .menu-link').forEach(el => el.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false);
  if (event.key !== 'Tab' || !document.body.classList.contains('menu-open')) return;
  const focusable = Array.from(menuPanel.querySelectorAll('button:not([disabled]), a[href]'));
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const copyButton = document.querySelector('[data-copy-email]');
copyButton?.addEventListener('click', async () => {
  const original = copyButton.innerHTML;
  try {
    await navigator.clipboard.writeText('uedebssoc.mnl@gmail.com');
    copyButton.textContent = 'Copied! ✓';
  } catch {
    copyButton.textContent = 'Select the email above to copy';
  }
  window.setTimeout(() => copyButton.innerHTML = original, 2200);
});
