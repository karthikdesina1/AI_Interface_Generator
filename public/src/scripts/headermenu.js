// /src/scripts/headerMenu.js
window.initHeaderMenu = function initHeaderMenu() {
  const btn  = document.getElementById('mobileMenuButton');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const close = () => {
    if (!menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('hidden') &&
        !e.target.closest('#mobileMenu') &&
        !e.target.closest('#mobileMenuButton')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
};
