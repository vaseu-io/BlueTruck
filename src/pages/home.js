import * as THREE from 'three';
import { Scene3D } from '../three/scene.js';
import { createTruck } from '../three/truck.js';
import { hotspotData } from '../data/tech-data.js';

let scene3D = null;

// Capacidade de exames por dia (horário comercial). Premissas — ajuste aqui se mudarem:
//  - 8 horas úteis por dia
//  - 20 min por exame de tomografia e 30 min por exame de ultrassom (incluem preparo e troca de paciente)
//  - 1 tomógrafo e 1 sala de ultrassom funcionando ao mesmo tempo
const HORAS_UTEIS = 8;
const MINUTOS_TOMOGRAFIA = 20;
const MINUTOS_ULTRASSOM = 30;
const EXAMES_TOMOGRAFIA = Math.floor((HORAS_UTEIS * 60) / MINUTOS_TOMOGRAFIA);
const EXAMES_ULTRASSOM = Math.floor((HORAS_UTEIS * 60) / MINUTOS_ULTRASSOM);
const EXAMES_POR_DIA = EXAMES_TOMOGRAFIA + EXAMES_ULTRASSOM;

export function renderHome(container, router) {
  container.innerHTML = `
    <div class="page">
      <div class="container">
        <!-- Hero -->
        <section class="hero home-hero">
          <h1 class="hero-title">
            <span class="gradient-text">BlueTruck</span><br>
            <span class="hero-tagline"><span class="tagline-line">Tomografia e saúde</span> <span class="tagline-line">em todo lugar!</span></span>
          </h1>
          <p class="hero-subtitle">
            A saúde está ficando cada vez mais acessível. A BlueTruck leva tomografia e consultório até onde você precisa.
          </p>
        </section>

        <!-- 3D Viewer -->
        <section class="viewer-section">
          <div class="viewer-container" id="viewer-3d">
            <div class="viewer-hint" id="viewer-hint">
              Arraste para rotacionar • Clique nas bolinhas pulsantes para ver cada item • Ctrl + scroll para zoom
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
            <div class="stat-value">${EXAMES_POR_DIA}</div>
            <div class="stat-label">Exames por dia</div>
            <div class="stat-note">${EXAMES_TOMOGRAFIA} tomografia + ${EXAMES_ULTRASSOM} ultrassom · ${HORAS_UTEIS} h úteis</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1</div>
            <div class="stat-label">Ultrassom</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1</div>
            <div class="stat-label">Tomografia</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1</div>
            <div class="stat-label">Banheiro</div>
          </div>
        </div>

        <!-- Quick Access -->
        <section class="quick-access">
          <h2 class="section-title">Acesso Rápido</h2>
          <p class="section-subtitle">Navegue pelas seções do manual interativo</p>
          <div class="quick-cards">
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

  // Zoom pelos botões: aproxima/afasta da área em foco, respeitando os limites da câmera
  const zoom = (fator) => {
    if (!scene3D) return;
    const { camera, controls } = scene3D;
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(THREE.MathUtils.clamp(offset.length() * fator, controls.minDistance, controls.maxDistance));
    camera.position.copy(controls.target).add(offset);
    scene3D.userMoved = true;
  };
  document.getElementById('btn-zoom-in')?.addEventListener('click', () => zoom(0.8));
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => zoom(1.25));
}

async function initScene(router) {
  const viewerEl = document.getElementById('viewer-3d');
  if (!viewerEl) return;

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
    // Vista própria de cada item (de frente); sem vista definida, aproxima por cima
    scene3D.flyTo(data.camera || {
      position: [data.position.x + 2, data.position.y + 2, data.position.z - 6],
      target: [data.position.x, data.position.y, data.position.z],
    });
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
