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
  });
  siteNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove('is-open');
      closeDropdowns();
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
      <article id="${index === 0 ? 'lecheng' : 'greater-bay-area'}" class="park-card">
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

function scrollToRenderedAnchor() {
  const targetId = window.location.hash.slice(1);
  if (!['lecheng', 'greater-bay-area', 'pathway-comparison'].includes(targetId)) return;

  window.requestAnimationFrame(() => {
    document.getElementById(targetId)?.scrollIntoView();
  });
}

scrollToRenderedAnchor();

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

const submissionModal = document.querySelector('[data-submission-modal]');
const submissionModalTitle = document.querySelector('#submission-modal-title');
const submissionModalMessage = document.querySelector('#submission-modal-message');
let lastFocusedElement = null;

function getSubmissionCopy(form) {
  const title = form.querySelector('h3')?.textContent?.trim() || 'Submission';
  if (title.includes('Assessment') || title.includes('Consultation')) {
    return {
      title: 'Thank you. Your pathway assessment request has been submitted successfully.',
      message: 'AsterNexis Advisory will review your request and follow up with a focused discussion plan.'
    };
  }
  if (title.includes('Product')) {
    return {
      title: 'Thank you. Your product profile has been submitted successfully.',
      message: 'AsterNexis Advisory will review your material and consider the most relevant market-access pathway.'
    };
  }
  if (title.includes('Brief') || title.includes('Guide')) {
    return {
      title: 'Thank you. Your China Entry Brief request has been submitted successfully.',
      message: 'AsterNexis Advisory will follow up with the requested material and relevant next steps.'
    };
  }
  return {
    title: 'Thank you. Your material has been submitted successfully.',
    message: 'AsterNexis Advisory will review your needs carefully and follow up with relevant next steps.'
  };
}

function openSubmissionModal(form) {
  if (!submissionModal) return;

  const copy = getSubmissionCopy(form);
  if (submissionModalTitle) {
    submissionModalTitle.textContent = copy.title;
  }
  if (submissionModalMessage) {
    submissionModalMessage.textContent = copy.message;
  }

  lastFocusedElement = document.activeElement;
  submissionModal.hidden = false;
  document.body.classList.add('modal-open');
  const closeButton = submissionModal.querySelector('[data-modal-close]');
  if (closeButton instanceof HTMLElement) {
    closeButton.focus();
  }
}

function closeSubmissionModal() {
  if (!submissionModal) return;

  submissionModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll('[data-modal-close]').forEach((control) => {
  control.addEventListener('click', closeSubmissionModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && submissionModal && !submissionModal.hidden) {
    closeSubmissionModal();
  }
});

function isRemoteForm(form) {
  return form.action.startsWith('https://formspree.io/');
}

function setSubmittingState(form, isSubmitting) {
  const button = form.querySelector('button[type="submit"]');
  if (!(button instanceof HTMLButtonElement)) return;

  if (isSubmitting) {
    button.dataset.originalText = button.textContent || '';
    button.textContent = 'Submitting...';
    button.disabled = true;
    return;
  }

  button.disabled = false;
  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }
}

async function submitLeadForm(form) {
  if (!isRemoteForm(form)) return true;

  const response = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: {
      Accept: 'application/json'
    }
  });

  return response.ok;
}

function resetFileUploadLabels(form) {
  form.querySelectorAll('[data-file-name]').forEach((target) => {
    target.textContent = 'No file selected';
  });
}

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const status = form.querySelector('.form-status');
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Please complete the required fields.';
      }
      return;
    }

    if (status) {
      status.textContent = isRemoteForm(form) ? 'Submitting...' : 'Submitted successfully.';
    }
    setSubmittingState(form, true);

    try {
      const success = await submitLeadForm(form);
      if (!success) {
        throw new Error('Submission failed');
      }

      form.reset();
      resetFileUploadLabels(form);
      if (status) {
        status.textContent = 'Submitted successfully.';
      }
      openSubmissionModal(form);
    } catch (error) {
      if (status) {
        status.textContent = 'Submission failed. Please check your connection and try again, or email AsterNexis Advisory directly.';
      }
    } finally {
      setSubmittingState(form, false);
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

document.querySelectorAll('[data-file-input]').forEach((input) => {
  input.addEventListener('change', () => {
    const upload = input.closest('.file-upload');
    const nameTarget = upload?.querySelector('[data-file-name]');
    if (!nameTarget) return;

    const fileName = input.files && input.files.length > 0 ? input.files[0].name : 'No file selected';
    nameTarget.textContent = fileName;
  });
});
