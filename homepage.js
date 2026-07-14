const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');
const navDropdowns = document.querySelectorAll('[data-nav-dropdown]');

function setDropdownOpen(dropdown, isOpen) {
  const toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
  dropdown.classList.toggle('is-open', isOpen);
  toggle?.setAttribute('aria-expanded', String(isOpen));
  toggle?.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} Special Pathways menu`);
}

function closeDropdowns(except = null) {
  navDropdowns.forEach((dropdown) => {
    if (dropdown !== except) setDropdownOpen(dropdown, false);
  });
}

navDropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
  toggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains('is-open');
    closeDropdowns(dropdown);
    setDropdownOpen(dropdown, willOpen);
  });
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element) || !event.target.closest('[data-nav-dropdown]')) {
    closeDropdowns();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDropdowns();
});

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close main navigation' : 'Open main navigation');
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove('is-open');
      closeDropdowns();
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open main navigation');
    }
  });
}

const year = document.querySelector('[data-current-year]');
if (year) {
  year.textContent = String(new Date().getFullYear());
}
