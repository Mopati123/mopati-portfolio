'use strict';

const roles = [
  'Systems Architect',
  'Quantum Computing Researcher',
  'Algorithmic Trading Engineer',
  'Governed AI Engineer',
  'Full-Stack Platform Builder',
  'Hamiltonian Systems Researcher'
];

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function initHeader() {
  const header = qs('[data-header]');
  const toggle = qs('[data-nav-toggle]');
  const nav = qs('[data-nav]');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
  window.addEventListener('scroll', updateHeader, {passive: true});
  updateHeader();
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  qsa('a', nav).forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function initRoleRotator() {
  const target = qs('[data-role-rotator]');
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let index = 0;
  setInterval(() => {
    index = (index + 1) % roles.length;
    target.animate([{opacity: 1, transform: 'translateY(0)'}, {opacity: 0, transform: 'translateY(-7px)'}], {duration: 180, fill: 'forwards'}).finished.then(() => {
      target.textContent = roles[index];
      target.animate([{opacity: 0, transform: 'translateY(7px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 220, fill: 'forwards'});
    });
  }, 2600);
}

function projectCard(project) {
  const repoLink = project.repo
    ? `<a class="card-link" href="${project.repo}" target="_blank" rel="noreferrer">Repository ↗</a>`
    : `<span class="card-link disabled" aria-label="Private repository">Controlled access</span>`;
  return `
    <article class="project-card reveal" data-categories="${project.category.join(' ')}" style="--project-glow:${project.glow}">
      <div class="project-card-top">
        <span class="project-kicker">${escapeHtml(project.kicker)}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="project-summary">${escapeHtml(project.summary)}</p>
      </div>
      <div class="project-card-body">
        <div class="project-meta">
          <div><small>Status</small><strong>${escapeHtml(project.status)}</strong></div>
          <div><small>Validation</small><strong>${escapeHtml(project.validation)}</strong></div>
        </div>
        <div class="tech-list">${project.technologies.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
        <div class="card-actions">
          <button class="card-link" type="button" data-project-id="${project.id}">Examine system →</button>
          ${repoLink}
        </div>
      </div>
    </article>`;
}

function initProjects() {
  const grid = qs('#project-grid');
  const projects = window.PORTFOLIO_PROJECTS || [];
  grid.innerHTML = projects.map(projectCard).join('');
  initReveal();

  qsa('[data-filter]').forEach(button => button.addEventListener('click', () => {
    qsa('[data-filter]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    qsa('.project-card', grid).forEach(card => {
      const visible = filter === 'all' || card.dataset.categories.split(' ').includes(filter);
      card.hidden = !visible;
    });
  }));

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-project-id]');
    if (!button) return;
    const project = projects.find(item => item.id === button.dataset.projectId);
    if (project) openProject(project);
  });
}

function openProject(project) {
  const dialog = qs('[data-project-dialog]');
  const content = qs('[data-dialog-content]', dialog);
  content.innerHTML = `
    <article class="dialog-body">
      <p class="eyebrow">${escapeHtml(project.kicker)}</p>
      <h2 id="dialog-title">${escapeHtml(project.title)}</h2>
      <p class="project-summary">${escapeHtml(project.summary)}</p>
      <div class="dialog-facts">
        <div><small>Status</small><strong>${escapeHtml(project.status)}</strong></div>
        <div><small>Validation</small><strong>${escapeHtml(project.validation)}</strong></div>
      </div>
      <section class="dialog-section"><h3>Problem</h3><p>${escapeHtml(project.problem)}</p></section>
      <section class="dialog-section"><h3>System</h3><p>${escapeHtml(project.system)}</p></section>
      <section class="dialog-section"><h3>Authority boundary</h3><p>${escapeHtml(project.authority)}</p></section>
      <section class="dialog-section"><h3>Evidence</h3><p>${escapeHtml(project.evidence)}</p></section>
      <section class="dialog-section"><h3>Current limitation</h3><p>${escapeHtml(project.boundary)}</p></section>
      ${project.repo ? `<a class="button primary" href="${project.repo}" target="_blank" rel="noreferrer">Open public repository</a>` : '<span class="status private">Private implementation · public architecture only</span>'}
    </article>`;
  dialog.showModal();
}

function initDialog() {
  const dialog = qs('[data-project-dialog]');
  qs('[data-dialog-close]', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
}

function initReveal() {
  const elements = qsa('.reveal:not([data-reveal-bound])');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(element => element.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), {threshold: .09, rootMargin: '0px 0px -50px'});
  elements.forEach(element => {
    element.dataset.revealBound = 'true';
    observer.observe(element);
  });
}

function initContact() {
  const form = qs('[data-contact-form]');
  const status = qs('[data-form-status]', form);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const enquiry = [
      'Portfolio enquiry for Mopati Ramaologa',
      `Name: ${data.get('name')}`,
      `Organisation: ${data.get('organisation') || 'Not specified'}`,
      `Topic: ${data.get('topic')}`,
      '',
      String(data.get('message')).trim()
    ].join('\n');
    try {
      await navigator.clipboard.writeText(enquiry);
      status.textContent = 'Structured enquiry copied. Continue through the GitHub profile link.';
    } catch {
      status.textContent = 'Copy was blocked by the browser. Select and copy your message manually.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initRoleRotator();
  initProjects();
  initDialog();
  initReveal();
  initContact();
  qsa('[data-year]').forEach(node => node.textContent = String(new Date().getFullYear()));
});
