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
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initHeader() {
  const header = qs('[data-header]');
  const toggle = qs('[data-nav-toggle]');
  const nav = qs('[data-nav]');
  if (!header || !toggle || !nav) return;

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
  if (!target || reducedMotion.matches) return;

  let index = 0;
  setInterval(async () => {
    index = (index + 1) % roles.length;
    try {
      await target.animate(
        [{opacity: 1, transform: 'translateY(0)'}, {opacity: 0, transform: 'translateY(-7px)'}],
        {duration: 180, fill: 'forwards', easing: 'ease-in'}
      ).finished;
    } catch {
      return;
    }
    target.textContent = roles[index];
    target.animate(
      [{opacity: 0, transform: 'translateY(7px)'}, {opacity: 1, transform: 'translateY(0)'}],
      {duration: 240, fill: 'forwards', easing: 'ease-out'}
    );
  }, 2600);
}

function initMotionLayer() {
  if (!qs('link[data-quantum-motion]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'assets/css/quantum-motion.css';
    stylesheet.dataset.quantumMotion = 'true';
    document.head.appendChild(stylesheet);
  }

  if (!qs('[data-quantum-field]')) {
    const field = document.createElement('div');
    field.className = 'quantum-field';
    field.dataset.quantumField = 'true';
    field.setAttribute('aria-hidden', 'true');
    field.innerHTML = `
      <div class="quantum-mesh"></div>
      <div class="quantum-wave wave-alpha"></div>
      <div class="quantum-wave wave-beta"></div>
      <div class="quantum-particles" data-quantum-particles></div>
      <div class="observer-field"></div>`;
    document.body.prepend(field);
  }
}

function initQuantumField() {
  const field = qs('[data-quantum-field]');
  const particleLayer = qs('[data-quantum-particles]', field || document);
  if (!field || !particleLayer) return;

  const particleCount = window.innerWidth < 720 ? 16 : 30;
  const particles = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement('span');
    const x = (index * 37 + 11) % 100;
    const y = (index * 61 + 17) % 100;
    const size = 2 + (index % 4);
    const duration = 13 + (index % 8) * 1.8;
    const delay = -((index * 1.37) % duration);
    particle.style.setProperty('--particle-x', `${x}%`);
    particle.style.setProperty('--particle-y', `${y}%`);
    particle.style.setProperty('--particle-size', `${size}px`);
    particle.style.setProperty('--particle-duration', `${duration}s`);
    particle.style.setProperty('--particle-delay', `${delay}s`);
    particles.appendChild(particle);
  }
  particleLayer.replaceChildren(particles);

  if (reducedMotion.matches) return;

  let frame = 0;
  let pointerX = window.innerWidth * 0.5;
  let pointerY = window.innerHeight * 0.3;
  const applyPointer = () => {
    frame = 0;
    document.documentElement.style.setProperty('--observer-x', `${pointerX}px`);
    document.documentElement.style.setProperty('--observer-y', `${pointerY}px`);
    document.documentElement.style.setProperty('--observer-nx', String((pointerX / window.innerWidth) - 0.5));
    document.documentElement.style.setProperty('--observer-ny', String((pointerY / window.innerHeight) - 0.5));
  };

  window.addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(applyPointer);
  }, {passive: true});
}

function initHeroObserver() {
  const visual = qs('.hero-visual');
  if (!visual || reducedMotion.matches) return;

  visual.addEventListener('pointermove', event => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visual.style.setProperty('--hero-rotate-y', `${x * 7}deg`);
    visual.style.setProperty('--hero-rotate-x', `${y * -7}deg`);
  });

  visual.addEventListener('pointerleave', () => {
    visual.style.setProperty('--hero-rotate-y', '0deg');
    visual.style.setProperty('--hero-rotate-x', '0deg');
  });
}

function projectCard(project, index) {
  const repoLink = project.repo
    ? `<a class="card-link" href="${project.repo}" target="_blank" rel="noreferrer">Repository ↗</a>`
    : `<span class="card-link disabled" aria-label="Private repository">Controlled access</span>`;

  return `
    <article class="project-card" data-project-card data-categories="${project.category.join(' ')}" style="--project-glow:${project.glow};--card-index:${index}">
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

function initProjectTilt(grid) {
  if (reducedMotion.matches) return;

  grid.addEventListener('pointermove', event => {
    const card = event.target.closest('[data-project-card]');
    if (!card || event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-y', `${normalizedX * 4.5}deg`);
    card.style.setProperty('--tilt-x', `${normalizedY * -4.5}deg`);
    card.style.setProperty('--card-light-x', `${(normalizedX + 0.5) * 100}%`);
    card.style.setProperty('--card-light-y', `${(normalizedY + 0.5) * 100}%`);
  });

  grid.addEventListener('pointerout', event => {
    const card = event.target.closest('[data-project-card]');
    if (!card || card.contains(event.relatedTarget)) return;
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--tilt-x', '0deg');
  });
}

function initProjects() {
  const grid = qs('#project-grid');
  if (!grid) return;
  let status = qs('[data-filter-status]');
  const projects = window.PORTFOLIO_PROJECTS || [];
  if (!status) {
    status = document.createElement('p');
    status.className = 'filter-status';
    status.dataset.filterStatus = 'true';
    status.setAttribute('aria-live', 'polite');
    grid.before(status);
  }
  const filterLabels = {
    all: 'All systems',
    quantum: 'Quantum systems',
    trading: 'Algorithmic trading systems',
    governance: 'Governance systems',
    finance: 'Financial systems',
    platform: 'Software platforms'
  };

  let renderEpoch = 0;

  const render = (filter, initial = false) => {
    const epoch = ++renderEpoch;
    const selectedProjects = filter === 'all'
      ? projects
      : projects.filter(project => project.category.includes(filter));

    const commit = () => {
      if (epoch !== renderEpoch) return;
      grid.innerHTML = selectedProjects.map(projectCard).join('');
      grid.classList.remove('is-switching');
      grid.removeAttribute('aria-busy');

      if (status) {
        const noun = selectedProjects.length === 1 ? 'system' : 'systems';
        status.textContent = `${filterLabels[filter] || 'Selected systems'} · ${selectedProjects.length} ${noun} observed`;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          qsa('[data-project-card]', grid).forEach(card => card.classList.add('is-visible'));
        });
      });
    };

    grid.setAttribute('aria-busy', 'true');
    if (initial || reducedMotion.matches || !grid.children.length) {
      commit();
      return;
    }

    grid.classList.add('is-switching');
    window.setTimeout(commit, 180);
  };

  qsa('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    qsa('[data-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render(filter);
  }));

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-project-id]');
    if (!button) return;
    const project = projects.find(item => item.id === button.dataset.projectId);
    if (project) openProject(project);
  });

  initProjectTilt(grid);
  render('all', true);
}

function openProject(project) {
  const dialog = qs('[data-project-dialog]');
  const content = qs('[data-dialog-content]', dialog || document);
  if (!dialog || !content) return;

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
  if (!dialog) return;

  const closeButton = qs('[data-dialog-close]', dialog);
  closeButton?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
}

function initReveal() {
  const elements = qsa('.reveal:not([data-reveal-bound])');
  if (reducedMotion.matches) {
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
  if (!form) return;
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
  initMotionLayer();
  initQuantumField();
  initHeroObserver();
  initProjects();
  initDialog();
  initReveal();
  initContact();
  qsa('[data-year]').forEach(node => node.textContent = String(new Date().getFullYear()));
});
