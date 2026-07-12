const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close main navigation' : 'Open main navigation');
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open main navigation');
    }
  });
}

const year = document.querySelector('[data-current-year]');
if (year) {
  year.textContent = String(new Date().getFullYear());
}
