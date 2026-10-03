import { videoData, videoCategories } from '../data/video-data.js';

let activeCategory = 'all';

export function renderVideos(container) {
  container.innerHTML = `
    <div class="page video-page">
      <div class="container">
        <section class="hero" style="padding-bottom: var(--space-xl);">
          <div class="hero-badge">
            <span class="pulse"></span>
            Treinamento Completo
          </div>
          <h1 class="hero-title" style="font-size: var(--font-4xl);">
            <span class="gradient-text">Vídeo-Aulas</span>
          </h1>
          <p class="hero-subtitle">
            Assista aos vídeos de treinamento para operação segura da carreta com tomógrafo.
          </p>
        </section>

        <!-- Category Filters -->
        <div class="video-categories" id="video-categories">
          <button class="video-category-btn active" data-category="all">
            📋 Todos
          </button>
          ${videoCategories.map(cat => `
            <button class="video-category-btn" data-category="${cat.id}">
              ${cat.icon} ${cat.title}
            </button>
          `).join('')}
        </div>

        <!-- Video Grid -->
        <div class="video-grid" id="video-grid">
        </div>
      </div>

      <footer class="footer">
        <div class="container">
          BlueTruck © 2026 — Sistema Interativo de Manuseio de Carreta com Tomógrafo
        </div>
      </footer>
    </div>
  `;

  renderVideoGrid('all');
  setupCategoryFilters();
}

function renderVideoGrid(category) {
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  const filtered = category === 'all'
    ? videoData
    : videoData.filter(v => v.category === category);

  grid.innerHTML = filtered.map(video => {
    const cat = videoCategories.find(c => c.id === video.category);
    return `
      <div class="video-card" data-video-id="${video.id}">
        <div class="video-thumbnail" style="background: linear-gradient(135deg, ${cat?.color || '#0A84FF'}22, ${cat?.color || '#0A84FF'}08);">
          <div class="video-play-btn">▶</div>
          <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.title}</h3>
          <p class="video-desc">${video.description}</p>
          <div class="video-meta">
            <span class="video-tag" style="background: ${cat?.color || '#0A84FF'}22; color: ${cat?.color || '#0A84FF'};">${cat?.title || ''}</span>
            <span class="video-difficulty">📊 ${video.difficulty}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Video card click handlers
  grid.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.videoId;
      const video = videoData.find(v => v.id === videoId);
      if (video) openVideoModal(video);
    });
  });
}

function setupCategoryFilters() {
  const container = document.getElementById('video-categories');
  if (!container) return;

  container.querySelectorAll('.video-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      container.querySelectorAll('.video-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;
      activeCategory = category;
      renderVideoGrid(category);
    });
  });
}

function openVideoModal(video) {
  const cat = videoCategories.find(c => c.id === video.category);

  const overlay = document.createElement('div');
  overlay.className = 'video-modal-overlay';
  overlay.id = 'video-modal';

  overlay.innerHTML = `
    <button class="video-modal-close" id="modal-close">✕</button>
    <div class="video-modal">
      <div class="video-modal-player">
        <iframe 
          src="${video.videoUrl}?autoplay=1" 
          allow="autoplay; encrypted-media" 
          allowfullscreen
        ></iframe>
      </div>
      <div class="video-modal-info">
        <h2 class="video-modal-title">${video.title}</h2>
        <p class="video-modal-desc">${video.description}</p>
        <div class="video-meta" style="margin-top: var(--space-md);">
          <span class="video-tag" style="background: ${cat?.color || '#0A84FF'}22; color: ${cat?.color || '#0A84FF'};">${cat?.title || ''}</span>
          <span class="video-difficulty">📊 ${video.difficulty}</span>
          <span class="video-difficulty">⏱️ ${video.duration}</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  document.getElementById('modal-close')?.addEventListener('click', closeVideoModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeVideoModal();
  });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeVideoModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  if (modal) {
    modal.style.animation = 'fadeIn 0.2s ease reverse';
    setTimeout(() => modal.remove(), 200);
  }
}
