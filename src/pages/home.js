import { Scene3D } from '../three/scene.js';
import { createTruck } from '../three/truck.js';
import { hotspotData } from '../data/tech-data.js';

let scene3D = null;

export function renderHome(container, router) {
  container.innerHTML = `
    <div class="page">
      <div class="container">
        <!-- Hero -->
        <section class="hero">
          <div class="hero-badge">
            <span class="pulse"></span>
            Sistema de Manuseio Interativo
          </div>
          <h1 class="hero-title">
            Carreta com <span class="gradient-text">Tomógrafo</span><br>
            Manual Interativo
          </h1>
          <p class="hero-subtitle">
            Explore a carreta em 3D, acesse vídeo-aulas, manuais técnicos e plantas. 
            Clique nos pontos iluminados para ver detalhes de cada componente.
          </p>
        </section>

        <!-- 3D Viewer -->
        <section class="viewer-section">
          <div class="viewer-container" id="viewer-3d">
            <div class="viewer-hint" id="viewer-hint">
              🖱️ Arraste para rotacionar • Clique nos pontos para detalhes • Scroll para zoom
            </div>
            <div class="viewer-controls">
              <button class="viewer-control-btn" id="btn-reset-camera" title="Resetar câmera">⟳</button>
              <button class="viewer-control-btn" id="btn-zoom-in" title="Zoom in">+</button>
              <button class="viewer-control-btn" id="btn-zoom-out" title="Zoom out">−</button>
            </div>
            <!-- Detail Panel -->
            <div class="detail-panel" id="detail-panel">
              <div class="detail-panel-header">
                <h3 class="detail-panel-title" id="detail-title"></h3>
                <button class="detail-panel-close" id="detail-close">✕</button>
              </div>
              <p class="detail-panel-desc" id="detail-desc"></p>
              <div class="detail-panel-specs" id="detail-specs"></div>
              <button class="detail-panel-link" id="detail-manual-link">
                📘 Ver Manual Relacionado →
              </button>
            </div>
          </div>
        </section>

        <!-- Stats -->
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-value">84</div>
            <div class="stat-label">kVA Gerador Externo (Diesel)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">60</div>
            <div class="stat-label">kVA Gerador Interno</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">15 m</div>
            <div class="stat-label">Comprimento Total</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">22</div>
            <div class="stat-label">Circuitos no QD01</div>
          </div>
        </div>

        <!-- Quick Access -->
        <section class="quick-access">
          <h2 class="section-title">Acesso Rápido</h2>
          <p class="section-subtitle">Navegue pelas seções do manual interativo</p>
          <div class="quick-cards">
            <div class="quick-card" data-route="videos">
              <div class="quick-card-icon">🎬</div>
              <h3 class="quick-card-title">Vídeo-Aulas</h3>
              <p class="quick-card-desc">9 vídeos de treinamento para ativação, operação e manutenção.</p>
            </div>
            <div class="quick-card" data-route="manual">
              <div class="quick-card-icon">📘</div>
              <h3 class="quick-card-title">Manual</h3>
              <p class="quick-card-desc">Ativação e desligamento em 3 etapas: Montagem/Desmontagem, Hidráulica e Elétrica.</p>
            </div>
            <div class="quick-card" data-route="techinfo">
              <div class="quick-card-icon">⚙️</div>
              <h3 class="quick-card-title">Info Técnicas</h3>
              <p class="quick-card-desc">Especificações completas de todos os sistemas.</p>
            </div>
            <div class="quick-card" data-route="plants">
              <div class="quick-card-icon">📐</div>
              <h3 class="quick-card-title">Plantas</h3>
              <p class="quick-card-desc">Plantas técnicas, layouts e diagramas.</p>
            </div>
          </div>
        </section>
      </div>

      <footer class="footer">
        <div class="container">
          BlueTruck © 2026 — Sistema Interativo de Manuseio de Carreta com Tomógrafo
        </div>
      </footer>
    </div>
  `;

  // Initialize 3D
  initScene(router);

  // Quick card navigation
  document.querySelectorAll('.quick-card').forEach(card => {
    card.addEventListener('click', () => {
      router.navigate(card.dataset.route);
    });

    // Mouse tracking for glow effect
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  // Viewer controls
  document.getElementById('btn-reset-camera')?.addEventListener('click', () => {
    scene3D?.resetCamera();
  });

  document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
    if (scene3D) {
      const dir = new (window.__THREE__ || THREE_MODULE).Vector3();
      scene3D.camera.getWorldDirection(dir);
      scene3D.camera.position.addScaledVector(dir, 2);
    }
  });

  document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
    if (scene3D) {
      const dir = new (window.__THREE__ || THREE_MODULE).Vector3();
      scene3D.camera.getWorldDirection(dir);
      scene3D.camera.position.addScaledVector(dir, -2);
    }
  });
}

let THREE_MODULE;

async function initScene(router) {
  const viewerEl = document.getElementById('viewer-3d');
  if (!viewerEl) return;

  THREE_MODULE = await import('three');

  // Cleanup previous scene
  if (scene3D) {
    scene3D.destroy();
    scene3D = null;
  }

  scene3D = new Scene3D(viewerEl);
  const truck = await createTruck(scene3D.scene);

  // Add hotspots
  hotspotData.forEach(data => {
    scene3D.addHotspot(data, null);
  });

  // Hotspot click handler
  scene3D.onHotspotClick = (data) => {
    showDetailPanel(data, router);
    scene3D.focusOnPosition(data.position, 6);
  };

  // Close detail panel
  document.getElementById('detail-close')?.addEventListener('click', () => {
    document.getElementById('detail-panel')?.classList.remove('open');
    scene3D?.resetCamera();
  });
}

function showDetailPanel(data, router) {
  const panel = document.getElementById('detail-panel');
  if (!panel) return;

  document.getElementById('detail-title').textContent = data.name;
  document.getElementById('detail-desc').textContent = data.description;

  const specsContainer = document.getElementById('detail-specs');
  specsContainer.innerHTML = data.specs.map(spec => `
    <div class="detail-spec-row">
      <span class="detail-spec-label">${spec.label}</span>
      <span class="detail-spec-value">${spec.value}</span>
    </div>
  `).join('');

  // Manual link
  const manualLink = document.getElementById('detail-manual-link');
  manualLink.onclick = () => {
    router.navigate('manual');
  };

  panel.classList.add('open');
}

export function destroyHome() {
  if (scene3D) {
    scene3D.destroy();
    scene3D = null;
  }
}
