const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function renderCards() {
  const content = window.MEDACCESS_CONTENT;
  if (!content) return;

  const pathwayTarget = document.querySelector('[data-render="pathway"]');
  if (pathwayTarget && content.pathway) {
    pathwayTarget.innerHTML = content.pathway.map((item) => `
      <article class="step-card">
        <div class="number">${item.step}</div>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>
    `).join('');
  }

  const policyTarget = document.querySelector('[data-render="policies"]');
  if (policyTarget && content.policies) {
    policyTarget.innerHTML = content.policies.map((item) => `
      <article class="policy-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>
    `).join('');
  }

  const parksTarget = document.querySelector('[data-render="parks"]');
  if (parksTarget && content.parks) {
    parksTarget.innerHTML = content.parks.map((item, index) => `
      <article class="park-card">
        <div class="park-index">${index + 1}</div>
        <div>
          ${item.eyebrow ? `<p class="park-eyebrow">${item.eyebrow}</p>` : ''}
          <h3>${item.title}</h3>
          <p>${item.body}</p>
          ${Array.isArray(item.highlights) ? `
            <ul class="park-highlights">
              ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        ${item.image ? `
          <figure class="park-visual">
            <img src="${item.image}" alt="${item.imageAlt || item.title}">
          </figure>
        ` : `
          <figure class="park-visual park-placeholder">
            <span>${item.imagePlaceholder || 'Image space reserved'}</span>
          </figure>
        `}
      </article>
    `).join('');
  }

  const comparisonTarget = document.querySelector('[data-render="park-comparison"]');
  if (comparisonTarget && Array.isArray(content.parkComparison)) {
    comparisonTarget.innerHTML = content.parkComparison.map((row) => `
      <tr>
        <th scope="row">${row.factor}</th>
        <td>${row.lecheng}</td>
        <td>${row.gba}</td>
      </tr>
    `).join('');
  }
}

renderCards();

function renderTextStacks() {
  const content = window.MEDACCESS_CONTENT;
  if (!content) return;

  [
    { key: 'aboutHainan', selector: '[data-render="aboutHainan"]' },
    { key: 'aboutUs', selector: '[data-render="aboutUs"]' }
  ].forEach(({ key, selector }) => {
    const target = document.querySelector(selector);
    const textItems = content[key];
    if (!target || !Array.isArray(textItems)) return;

    target.innerHTML = textItems.map((text) => `<p>${text}</p>`).join('');
  });
}

renderTextStacks();

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const status = form.querySelector('.form-status');
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Please complete the required fields.';
      }
      return;
    }

    form.reset();
    if (status) {
      status.textContent = 'Thank you. This preview records no data; a production version should connect this form to your preferred intake workflow.';
    }
  });
});

function renderSources() {
  const content = window.MEDACCESS_CONTENT;
  const target = document.querySelector('[data-render="sources"]');
  if (!content || !target || !Array.isArray(content.sources)) return;

  target.innerHTML = '';
  content.sources.forEach((source) => {
    if (!source || !source.label || !source.href) return;

    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.href;
    link.textContent = source.label;
    link.target = '_blank';
    link.rel = 'noreferrer';
    item.append(link);
    target.append(item);
  });
}

renderSources();
