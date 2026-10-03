import { techSpecs } from '../data/tech-data.js';

let activeCategory = 'all';

export function renderTechInfo(container) {
  const categories = Object.keys(techSpecs);

  container.innerHTML = `
    <div class="page tech-page">
      <div class="container">
        <section class="hero" style="padding-bottom: var(--space-lg);">
          <div class="hero-badge">
            <span class="pulse"></span>
            Dados Técnicos Completos
          </div>
          <h1 class="hero-title" style="font-size: var(--font-4xl);">
            <span class="gradient-text">Informações Técnicas</span>
          </h1>
          <p class="hero-subtitle">
            Especificações detalhadas de todos os sistemas da carreta com tomógrafo.
          </p>
        </section>

        <!-- Category Filters -->
        <div class="tech-categories" id="tech-categories">
          <button class="tech-category-btn active" data-category="all">
            📋 Todos os Sistemas
          </button>
          ${categories.map(key => {
            const cat = techSpecs[key];
            return `
              <button class="tech-category-btn" data-category="${key}">
                ${cat.icon} ${cat.title}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Tech Content -->
        <div class="tech-content" id="tech-content">
        </div>
      </div>

      <footer class="footer">
        <div class="container">
          BlueTruck © 2026 — Sistema Interativo de Manuseio de Carreta com Tomógrafo
        </div>
      </footer>
    </div>
  `;

  renderTechContent('all');
  setupTechFilters();
}

function renderTechContent(category) {
  const contentEl = document.getElementById('tech-content');
  if (!contentEl) return;

  const categories = category === 'all'
    ? Object.entries(techSpecs)
    : Object.entries(techSpecs).filter(([key]) => key === category);

  contentEl.innerHTML = categories.map(([key, data], index) => `
    <div class="tech-card" style="animation: pageIn 0.4s ease ${index * 0.1}s both;">
      <div class="tech-card-header">
        <div class="tech-card-icon" style="background: ${data.color}22; color: ${data.color}; font-size: 1.5rem;">
          ${data.icon}
        </div>
        <div>
          <h3 class="tech-card-title">${data.title}</h3>
          <span style="font-size: var(--font-sm); color: var(--text-tertiary);">${data.specs.length} especificações</span>
        </div>
      </div>
      <div class="tech-specs-grid">
        ${data.specs.map(spec => `
          <div class="tech-spec-item">
            <span class="tech-spec-label">${spec.label}</span>
            <span class="tech-spec-value">${spec.value}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function setupTechFilters() {
  const container = document.getElementById('tech-categories');
  if (!container) return;

  container.querySelectorAll('.tech-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tech-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTechContent(btn.dataset.category);
    });
  });
}
