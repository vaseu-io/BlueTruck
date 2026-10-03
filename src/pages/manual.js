import { manualStages } from '../data/manual-data.js';

let currentStage = 0;
let currentMode = 'activation'; // 'activation' or 'shutdown'
let checkedSteps = {};

export function renderManual(container) {
  // Reset state
  checkedSteps = {};

  container.innerHTML = `
    <div class="page manual-page">
      <div class="container">
        <section class="hero" style="padding-bottom: var(--space-lg);">
          <div class="hero-badge">
            <span class="pulse"></span>
            Procedimentos Operacionais
          </div>
          <h1 class="hero-title" style="font-size: var(--font-4xl);">
            <span class="gradient-text">Manual de Operação</span>
          </h1>
          <p class="hero-subtitle">
            Siga os procedimentos de ativação e desligamento da carreta em 3 etapas.
          </p>
        </section>

        <!-- Mode Toggle -->
        <div style="display: flex; justify-content: center; margin-bottom: var(--space-xl);">
          <div class="manual-mode-toggle" id="mode-toggle">
            <button class="manual-mode-btn active" data-mode="activation">
              🟢 Ativação
            </button>
            <button class="manual-mode-btn" data-mode="shutdown">
              🔴 Desligamento
            </button>
          </div>
        </div>

        <!-- Stepper -->
        <div class="stepper" id="stepper">
        </div>

        <!-- Manual Content -->
        <div class="manual-content" id="manual-content">
        </div>
      </div>

      <footer class="footer">
        <div class="container">
          BlueTruck © 2026 — Sistema Interativo de Manuseio de Carreta com Tomógrafo
        </div>
      </footer>
    </div>
  `;

  renderStepper();
  renderManualContent();
  setupModeToggle();
}

function renderStepper() {
  const stepperEl = document.getElementById('stepper');
  if (!stepperEl) return;

  let html = '';
  manualStages.forEach((stage, i) => {
    const isActive = i === currentStage;
    const isCompleted = i < currentStage;

    html += `
      <div class="stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-stage="${i}">
        <div class="stepper-circle">${isCompleted ? '✓' : stage.icon}</div>
        <span class="stepper-label">${stage.title}</span>
      </div>
    `;

    if (i < manualStages.length - 1) {
      html += `<div class="stepper-line ${isCompleted ? 'completed' : ''}"></div>`;
    }
  });

  stepperEl.innerHTML = html;

  // Click handlers
  stepperEl.querySelectorAll('.stepper-step').forEach(step => {
    step.addEventListener('click', () => {
      currentStage = parseInt(step.dataset.stage);
      renderStepper();
      renderManualContent();
    });
  });
}

function renderManualContent() {
  const contentEl = document.getElementById('manual-content');
  if (!contentEl) return;

  const stage = manualStages[currentStage];
  const modeData = currentMode === 'activation' ? stage.activation : stage.shutdown;
  const steps = modeData.steps;

  // Count checked for this stage
  const stageKey = `${currentMode}-${stage.id}`;
  const checkedCount = steps.filter(s => checkedSteps[`${stageKey}-${s.id}`]).length;
  const progress = Math.round((checkedCount / steps.length) * 100);

  contentEl.innerHTML = `
    <div class="manual-stage-header" style="animation: pageIn 0.4s ease;">
      <div class="manual-stage-icon" style="color: ${stage.color};">${stage.icon}</div>
      <h2 class="manual-stage-title">${modeData.title}</h2>
      <p class="manual-stage-desc">${stage.description}</p>
    </div>

    <div class="manual-steps">
      ${steps.map((step, i) => {
        const isChecked = checkedSteps[`${stageKey}-${step.id}`];
        return `
          <div class="manual-step ${isChecked ? 'checked' : ''}" data-step-id="${step.id}" style="animation: pageIn 0.4s ease ${i * 0.05}s both;">
            <div class="manual-step-header">
              <div class="manual-step-checkbox" data-step="${step.id}">${isChecked ? '✓' : ''}</div>
              <span class="manual-step-icon">${step.icon}</span>
              <h3 class="manual-step-title">${step.title}</h3>
              <span class="manual-step-number">Passo ${i + 1}</span>
            </div>
            <p class="manual-step-desc">${step.description}</p>
            ${step.warning ? `
              <div class="manual-step-warning">
                ⚠️ ${step.warning}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <div class="manual-progress">
      <div class="manual-progress-header">
        <span class="manual-progress-label">Progresso da Etapa</span>
        <span class="manual-progress-value">${checkedCount}/${steps.length} (${progress}%)</span>
      </div>
      <div class="manual-progress-bar">
        <div class="manual-progress-fill" style="width: ${progress}%;"></div>
      </div>
    </div>

    ${currentStage < manualStages.length - 1 ? `
      <div style="text-align: center; margin-top: var(--space-xl);">
        <button class="detail-panel-link" id="next-stage-btn" style="max-width: 300px; margin: 0 auto;">
          Próxima Etapa: ${manualStages[currentStage + 1].title} →
        </button>
      </div>
    ` : `
      <div style="text-align: center; margin-top: var(--space-xl);">
        <button class="detail-panel-link" id="finish-btn" style="max-width: 300px; margin: 0 auto; background: linear-gradient(135deg, var(--accent-green), #1a9940);">
          ✅ Procedimento Completo
        </button>
      </div>
    `}
  `;

  // Checkbox handlers
  contentEl.querySelectorAll('.manual-step-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      const stepId = checkbox.dataset.step;
      const key = `${stageKey}-${stepId}`;
      checkedSteps[key] = !checkedSteps[key];
      renderManualContent();
    });
  });

  // Also allow clicking the whole step row
  contentEl.querySelectorAll('.manual-step').forEach(stepEl => {
    stepEl.addEventListener('click', () => {
      const stepId = stepEl.dataset.stepId;
      const key = `${stageKey}-${stepId}`;
      checkedSteps[key] = !checkedSteps[key];
      renderManualContent();
    });
  });

  // Next stage button
  document.getElementById('next-stage-btn')?.addEventListener('click', () => {
    if (currentStage < manualStages.length - 1) {
      currentStage++;
      renderStepper();
      renderManualContent();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function setupModeToggle() {
  const toggle = document.getElementById('mode-toggle');
  if (!toggle) return;

  toggle.querySelectorAll('.manual-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggle.querySelectorAll('.manual-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentMode = btn.dataset.mode;
      renderManualContent();
    });
  });
}
