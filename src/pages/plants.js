let currentPlant = 'layout';
let canvasState = { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, startX: 0, startY: 0 };

const plantTypes = [
  { id: 'layout', name: 'Layout Interno', icon: '🏗️' },
  { id: 'eletrica', name: 'Planta Elétrica', icon: '⚡' }
];

const plantLegends = {
  layout: [
    { color: '#0A84FF', label: 'Sala do Tomógrafo' },
    { color: '#FFD60A', label: 'Área de Controle' },
    { color: '#30D158', label: 'Gerador' },
    { color: '#FF6B35', label: 'Painel Elétrico' },
    { color: '#5AC8FA', label: 'Climatização' },
    { color: '#8E8E93', label: 'Área de Circulação' },
    { color: '#FF453A', label: 'Blindagem de Chumbo' },
  ],
  eletrica: [
    { color: '#FF453A', label: 'Fase R (220V)' },
    { color: '#FFD60A', label: 'Fase S (220V)' },
    { color: '#0A84FF', label: 'Fase T (220V)' },
    { color: '#30D158', label: 'Terra (PE)' },
    { color: '#8E8E93', label: 'Neutro (N)' },
    { color: '#FF6B35', label: 'Disjuntores' },
  ]
};

export function renderPlants(container) {
  container.innerHTML = `
    <div class="page plants-page">
      <div class="container">
        <section class="hero" style="padding-bottom: var(--space-lg);">
          <div class="hero-badge">
            <span class="pulse"></span>
            Documentação Técnica
          </div>
          <h1 class="hero-title" style="font-size: var(--font-4xl);">
            <span class="gradient-text">Plantas Técnicas</span>
          </h1>
          <p class="hero-subtitle">
            Diagramas e plantas técnicas da carreta com tomógrafo. Arraste para mover e use o scroll para zoom.
          </p>
        </section>

        <!-- Plant Tabs -->
        <div class="plant-tabs" id="plant-tabs">
          ${plantTypes.map(type => `
            <button class="plant-tab-btn ${type.id === currentPlant ? 'active' : ''}" data-plant="${type.id}">
              ${type.icon} ${type.name}
            </button>
          `).join('')}
        </div>

        <!-- Plant Viewer -->
        <div class="plant-viewer">
          <div class="plant-canvas-container" id="plant-canvas-container">
            <canvas id="plant-canvas"></canvas>
          </div>
          <div class="plant-controls">
            <button class="plant-control-btn" id="plant-zoom-in" title="Zoom in">+</button>
            <button class="plant-control-btn" id="plant-zoom-out" title="Zoom out">−</button>
            <button class="plant-control-btn" id="plant-reset" title="Resetar">⟳</button>
            <a id="plant-download" href="#" target="_blank" class="plant-control-btn" title="Baixar PDF" style="text-decoration: none; padding-top: 6px; font-size: 14px;">PDF</a>
          </div>
          <div class="plant-legend" id="plant-legend">
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="container">
          BlueTruck © 2026 — Sistema Interativo de Manuseio de Carreta com Tomógrafo
        </div>
      </footer>
    </div>
  `;

  setupPlantTabs();
  setupPlantControls();
  drawPlant(currentPlant);
}

function setupPlantTabs() {
  document.getElementById('plant-tabs')?.querySelectorAll('.plant-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.plant-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlant = btn.dataset.plant;
      canvasState = { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, startX: 0, startY: 0 };
      drawPlant(currentPlant);
    });
  });
}

function setupPlantControls() {
  const container = document.getElementById('plant-canvas-container');
  if (!container) return;

  // Zoom buttons
  document.getElementById('plant-zoom-in')?.addEventListener('click', () => {
    canvasState.scale = Math.min(canvasState.scale * 1.2, 4);
    drawPlant(currentPlant);
  });

  document.getElementById('plant-zoom-out')?.addEventListener('click', () => {
    canvasState.scale = Math.max(canvasState.scale / 1.2, 0.5);
    drawPlant(currentPlant);
  });

  document.getElementById('plant-reset')?.addEventListener('click', () => {
    canvasState = { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, startX: 0, startY: 0 };
    drawPlant(currentPlant);
  });

  // Drag to pan
  container.addEventListener('mousedown', (e) => {
    canvasState.isDragging = true;
    canvasState.startX = e.clientX - canvasState.offsetX;
    canvasState.startY = e.clientY - canvasState.offsetY;
  });

  container.addEventListener('mousemove', (e) => {
    if (canvasState.isDragging) {
      canvasState.offsetX = e.clientX - canvasState.startX;
      canvasState.offsetY = e.clientY - canvasState.startY;
      drawPlant(currentPlant);
    }
  });

  container.addEventListener('mouseup', () => {
    canvasState.isDragging = false;
  });

  container.addEventListener('mouseleave', () => {
    canvasState.isDragging = false;
  });

  // Scroll to zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    canvasState.scale = Math.max(0.5, Math.min(4, canvasState.scale * delta));
    drawPlant(currentPlant);
  });
}

function drawPlant(type) {
  const canvas = document.getElementById('plant-canvas');
  const container = document.getElementById('plant-canvas-container');
  if (!canvas || !container) return;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply transforms
  ctx.save();
  ctx.translate(canvas.width / 2 + canvasState.offsetX, canvas.height / 2 + canvasState.offsetY);
  ctx.scale(canvasState.scale, canvasState.scale);

  // Background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);

  // Grid
  drawGrid(ctx, canvas.width, canvas.height);

  switch (type) {
    case 'layout': drawLayoutPlant(ctx); break;
    case 'eletrica': drawElectricalPlant(ctx); break;
  }

  ctx.restore();

  // Update download link
  const downloadLink = document.getElementById('plant-download');
  if (downloadLink) {
    if (type === 'layout') {
      downloadLink.href = '/docs/PE -15741-R00.pdf';
    } else if (type === 'eletrica') {
      downloadLink.href = '/docs/Diagramas-BLUE_HEALTH QD01.pdf';
    }
  }

  // Update legend
  updateLegend(type);
}

function drawGrid(ctx, w, h) {
  ctx.strokeStyle = '#1a2236';
  ctx.lineWidth = 0.5;

  for (let x = -500; x <= 500; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, -300);
    ctx.lineTo(x, 300);
    ctx.stroke();
  }

  for (let y = -300; y <= 300; y += 20) {
    ctx.beginPath();
    ctx.moveTo(-500, y);
    ctx.lineTo(500, y);
    ctx.stroke();
  }
}

function drawLayoutPlant(ctx) {
  // Scale: 1mm = 0.09px (larger for readability)
  const S = 0.09;
  const mm = (v) => v * S;

  const totalW = mm(14800);
  const bodyH  = mm(2600);
  const ox = -totalW / 2;
  const oy = -bodyH  / 2;

  // Section X positions (from left)
  const secW = [1338, 4264, 2375, 379, 5002, 1392].map(v => mm(v));
  let sx = [ox];
  secW.forEach(w => sx.push(sx[sx.length - 1] + w));

  // Title
  ctx.fillStyle = '#ccc';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PLANTA BAIXA — BLUE HEALTH', 0, oy - mm(3200));
  ctx.font = '13px Inter';
  ctx.fillStyle = '#8E8E93';
  ctx.fillText('Dimensões em milímetros (mm)', 0, oy - mm(2800));

  // ═══════════════════════════════════════
  //  ROOM FILLS
  // ═══════════════════════════════════════
  ctx.fillStyle = '#30D15818';
  ctx.fillRect(ox, oy, secW[0], bodyH);

  ctx.fillStyle = '#FFD60A10';
  ctx.fillRect(sx[1], oy, secW[1], bodyH);

  ctx.fillStyle = '#FF6B3510';
  ctx.fillRect(sx[2], oy, secW[2], bodyH);

  ctx.fillStyle = '#8E8E930A';
  ctx.fillRect(sx[3], oy, secW[3], bodyH);

  ctx.fillStyle = '#0A84FF10';
  ctx.fillRect(sx[4], oy, secW[4], bodyH);

  ctx.fillStyle = '#FF453A10';
  ctx.fillRect(sx[5], oy, secW[5], bodyH);

  // ═══════════════════════════════════════
  //  MAIN WALLS
  // ═══════════════════════════════════════
  ctx.strokeStyle = '#E5E5EA';
  ctx.lineWidth = 3;
  ctx.strokeRect(ox, oy, totalW, bodyH);

  ctx.lineWidth = 2;
  for (let i = 1; i < sx.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(sx[i], oy);
    ctx.lineTo(sx[i], oy + bodyH);
    ctx.stroke();
  }

  // ═══════════════════════════════════════
  //  SLIDE-OUTS
  // ═══════════════════════════════════════
  const slideH = mm(1200);

  // Top slide-out 1: Consultório 02
  const ts1x = ox + mm(1072);
  const ts1w = mm(4500);
  ctx.fillStyle = '#FFD60A08';
  ctx.fillRect(ts1x, oy - slideH, ts1w, slideH);
  ctx.strokeStyle = '#FFD60A66';
  ctx.lineWidth = 2;
  ctx.strokeRect(ts1x, oy - slideH, ts1w, slideH);

  // PCD Platform (dashed)
  const pcdx = ts1x + ts1w + mm(616);
  const pcdw = mm(1426);
  ctx.strokeStyle = '#8E8E9388';
  ctx.setLineDash([6, 5]);
  ctx.strokeRect(pcdx, oy - slideH, pcdw, slideH);
  ctx.setLineDash([]);

  // Top slide-out 2: Avanço 01
  const ts2x = pcdx + pcdw + mm(1484);
  const ts2w = mm(5002);
  ctx.fillStyle = '#0A84FF08';
  ctx.fillRect(ts2x, oy - slideH, ts2w, slideH);
  ctx.strokeStyle = '#0A84FF66';
  ctx.strokeRect(ts2x, oy - slideH, ts2w, slideH);

  // Bottom slide-out: Avanço 02
  ctx.fillStyle = '#0A84FF08';
  ctx.fillRect(sx[4], oy + bodyH, mm(5002), slideH);
  ctx.strokeStyle = '#0A84FF66';
  ctx.strokeRect(sx[4], oy + bodyH, mm(5002), slideH);

  // ═══════════════════════════════════════
  //  CABIN
  // ═══════════════════════════════════════
  ctx.save();
  ctx.translate(ox - mm(300), oy + bodyH / 2);
  ctx.rotate(-Math.PI / 8);
  ctx.fillStyle = '#1a223666';
  ctx.fillRect(-mm(1600), -mm(1000), mm(1600), mm(2000));
  ctx.strokeStyle = '#E5E5EA';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(-mm(1600), -mm(1000), mm(1600), mm(2000));
  ctx.fillStyle = '#8E8E93';
  ctx.font = 'bold 14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('GABINETE', -mm(800), 0);
  ctx.restore();

  // ═══════════════════════════════════════
  //  FURNITURE & EQUIPMENT
  // ═══════════════════════════════════════
  ctx.lineWidth = 1.2;

  // --- Room 1: Gerador ---
  ctx.strokeStyle = '#30D158';
  ctx.fillStyle = '#30D15822';
  ctx.fillRect(ox + mm(100), oy + mm(400), mm(1100), mm(1600));
  ctx.strokeRect(ox + mm(100), oy + mm(400), mm(1100), mm(1600));
  ctx.beginPath();
  ctx.arc(ox + mm(650), oy + mm(500), mm(250), 0, Math.PI * 2);
  ctx.stroke();

  // --- Room 2: Consultório 01 ---
  ctx.strokeStyle = '#FFD60A';
  // WC PCD
  ctx.fillStyle = '#FFD60A14';
  ctx.fillRect(sx[1] + mm(50), oy + bodyH - mm(900), mm(900), mm(850));
  ctx.strokeRect(sx[1] + mm(50), oy + bodyH - mm(900), mm(900), mm(850));
  ctx.beginPath();
  ctx.arc(sx[1] + mm(350), oy + bodyH - mm(500), mm(150), 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(sx[1] + mm(650), oy + bodyH - mm(850), mm(250), mm(250));

  // Maca / Ultrassom
  ctx.strokeRect(sx[1] + mm(1600), oy + mm(900), mm(2000), mm(900));
  // Console desk
  ctx.strokeRect(sx[1] + mm(600), oy + mm(300), mm(1000), mm(500));
  ctx.beginPath();
  ctx.arc(sx[1] + mm(850), oy + mm(200), mm(120), 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx[1] + mm(1300), oy + mm(200), mm(120), 0, Math.PI * 2);
  ctx.stroke();
  // Impressora
  ctx.strokeRect(sx[1] + mm(2800), oy + bodyH - mm(550), mm(500), mm(350));

  // --- Consultório 02 (top slide-out) ---
  ctx.strokeStyle = '#FFD60A';
  ctx.strokeRect(ts1x + mm(200), oy - slideH + mm(150), mm(1600), mm(350));
  ctx.strokeRect(ts1x + mm(200), oy - slideH + mm(600), mm(700), mm(450));
  ctx.strokeRect(ts1x + mm(2700), oy - slideH + mm(200), mm(1400), mm(700));
  ctx.beginPath();
  ctx.arc(ts1x + mm(3400), oy - slideH + mm(400), mm(120), 0, Math.PI * 2);
  ctx.stroke();

  // --- PCD door arc ---
  ctx.strokeStyle = '#8E8E9366';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(pcdx + pcdw / 2, oy, mm(500), 0, Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- Room 3: Disparo ---
  ctx.strokeStyle = '#FF6B35';
  ctx.fillStyle = '#FF6B3514';
  ctx.fillRect(sx[2] + mm(300), oy + bodyH - mm(700), mm(600), mm(500));
  ctx.strokeRect(sx[2] + mm(300), oy + bodyH - mm(700), mm(600), mm(500));
  ctx.strokeRect(sx[2] + mm(1000), oy + bodyH - mm(900), mm(1100), mm(700));
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(sx[2] + mm(100), oy + mm(1200));
  ctx.lineTo(sx[2] + secW[2] - mm(100), oy + mm(1200));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeRect(sx[2] + mm(1200), oy + mm(200), mm(700), mm(500));
  ctx.strokeRect(sx[2] + mm(300), oy + mm(200), mm(500), mm(400));

  // --- Room 5: Tomografia ---
  ctx.strokeStyle = '#0A84FF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(sx[4] + mm(3200), oy + bodyH / 2, mm(550), 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx[4] + mm(3200), oy + bodyH / 2, mm(420), 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.2;
  ctx.fillStyle = '#0A84FF14';
  ctx.fillRect(sx[4] + mm(800), oy + bodyH / 2 - mm(250), mm(2400), mm(500));
  ctx.strokeRect(sx[4] + mm(800), oy + bodyH / 2 - mm(250), mm(2400), mm(500));
  // Avanço 01 equipment
  ctx.strokeRect(ts2x + mm(300), oy - slideH + mm(150), mm(2000), mm(700));
  ctx.strokeRect(ts2x + mm(2800), oy - slideH + mm(150), mm(1800), mm(700));

  // --- Room 6: Nobreak/QDF ---
  ctx.strokeStyle = '#FF453A';
  ctx.fillStyle = '#FF453A14';
  ctx.fillRect(sx[5] + mm(80), oy + mm(100), mm(900), mm(650));
  ctx.strokeRect(sx[5] + mm(80), oy + mm(100), mm(900), mm(650));
  ctx.strokeRect(sx[5] + mm(80), oy + mm(900), mm(600), mm(700));
  ctx.strokeRect(sx[5] + mm(750), oy + mm(1100), mm(550), mm(1400));
  ctx.fillStyle = '#FF453A1A';
  ctx.fillRect(sx[5] + secW[5] - mm(350), oy + bodyH - mm(900), mm(250), mm(700));
  ctx.strokeRect(sx[5] + secW[5] - mm(350), oy + bodyH - mm(900), mm(250), mm(700));

  // ═══════════════════════════════════════
  //  ROOM LABELS (well spaced)
  // ═══════════════════════════════════════
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Gerador
  ctx.fillStyle = '#30D158';
  ctx.font = 'bold 13px Inter';
  ctx.fillText('GERADOR', ox + secW[0] / 2, oy + bodyH / 2 + mm(100));
  ctx.font = '11px Inter';
  ctx.fillText('60kVA', ox + secW[0] / 2, oy + bodyH / 2 + mm(400));
  ctx.font = '10px Inter';
  ctx.fillText('STARLINK', ox + mm(650), oy + mm(250));

  // Consultório 01
  ctx.fillStyle = '#FFD60A';
  ctx.font = 'bold 14px Inter';
  ctx.fillText('CONSULTÓRIO 01', sx[1] + secW[1] / 2, oy + mm(700));
  ctx.font = '10px Inter';
  ctx.fillText('MACA / ULTRASSOM', sx[1] + mm(2600), oy + mm(1500));
  ctx.fillText('W.C PCD', sx[1] + mm(500), oy + bodyH - mm(500));
  ctx.fillText('IMPRESSORA', sx[1] + mm(3050), oy + bodyH - mm(380));
  ctx.fillText('MESA / CADEIRAS', sx[1] + mm(1100), oy + mm(200));

  // Consultório 02 (top slide-out)
  ctx.fillStyle = '#FFD60A';
  ctx.font = 'bold 13px Inter';
  ctx.fillText('CONSULTÓRIO 02', ts1x + ts1w / 2, oy - slideH + mm(100));
  ctx.font = '10px Inter';
  ctx.fillText('PAINEL LED 3x2', ts1x + mm(1000), oy - slideH + mm(350));
  ctx.fillText('CADEIRAS', ts1x + mm(550), oy - slideH + mm(850));
  ctx.fillText('MESA ATENDIMENTO', ts1x + mm(3400), oy - slideH + mm(650));

  // PCD
  ctx.fillStyle = '#8E8E93';
  ctx.font = 'bold 11px Inter';
  ctx.fillText('PLATAFORMA', pcdx + pcdw / 2, oy - slideH / 2 - mm(200));
  ctx.fillText('PCD', pcdx + pcdw / 2, oy - slideH / 2 + mm(100));
  ctx.font = '10px Inter';
  ctx.fillText('PORTA LATERAL', pcdx + pcdw / 2, oy - slideH / 2 + mm(400));

  // Disparo
  ctx.fillStyle = '#FF6B35';
  ctx.font = 'bold 13px Inter';
  ctx.fillText('DISPARO', sx[2] + secW[2] / 2, oy + mm(500));
  ctx.font = '10px Inter';
  ctx.fillText('CORTINA', sx[2] + secW[2] / 2, oy + mm(1100));
  ctx.fillText('BANCADA', sx[2] + mm(1550), oy + bodyH - mm(600));
  ctx.fillText('CONSOLE', sx[2] + mm(1550), oy + bodyH - mm(400));
  ctx.fillText('MINI RACK', sx[2] + mm(600), oy + bodyH - mm(450));
  ctx.fillText('NAVIBOX', sx[2] + mm(550), oy + mm(350));
  ctx.fillText('MONITOR', sx[2] + mm(1550), oy + mm(400));

  // Tomografia
  ctx.fillStyle = '#0A84FF';
  ctx.font = 'bold 14px Inter';
  ctx.fillText('TOMOGRAFIA', sx[4] + secW[4] / 2, oy + mm(350));
  ctx.font = '11px Inter';
  ctx.fillText('CT SCANNER', sx[4] + mm(3200), oy + bodyH / 2 + mm(700));
  ctx.fillText('MESA PACIENTE', sx[4] + mm(2000), oy + bodyH / 2 + mm(400));

  // Avanço 01
  ctx.fillStyle = '#0A84FF';
  ctx.font = 'bold 13px Inter';
  ctx.fillText('AVANÇO 01', ts2x + ts2w / 2, oy - slideH + mm(100));
  ctx.font = '10px Inter';
  ctx.fillText('CARRO MACA', ts2x + mm(1300), oy - slideH + mm(550));
  ctx.fillText('PLATAFORMA MACA', ts2x + mm(3700), oy - slideH + mm(450));
  ctx.fillText('C/ SUPORTE SORO', ts2x + mm(3700), oy - slideH + mm(700));

  // Avanço 02
  ctx.fillStyle = '#0A84FF';
  ctx.font = 'bold 13px Inter';
  ctx.fillText('AVANÇO 02', sx[4] + mm(2500), oy + bodyH + slideH / 2);

  // Nobreak / QDF
  ctx.fillStyle = '#FF453A';
  ctx.font = 'bold 12px Inter';
  ctx.fillText('NOBREAK', sx[5] + mm(530), oy + mm(420));
  ctx.font = '10px Inter';
  ctx.fillText('TOMÓGRAFO', sx[5] + mm(380), oy + mm(1250));
  ctx.fillText('CABINE', sx[5] + mm(1025), oy + mm(1600));
  ctx.fillText('TROCADOR', sx[5] + mm(1025), oy + mm(1900));
  ctx.font = 'bold 11px Inter';
  ctx.fillText('QDF', sx[5] + secW[5] - mm(225), oy + bodyH - mm(550));
  ctx.font = '10px Inter';
  ctx.fillText('ESTAB.', sx[5] + mm(400), oy + bodyH - mm(250));

  // ═══════════════════════════════════════
  //  DIMENSION LINES (Red)
  // ═══════════════════════════════════════
  function drawDim(xa, ya, xb, yb, text, offsetDir = 1) {
    ctx.strokeStyle = '#FF453A';
    ctx.fillStyle = '#FF453A';
    ctx.lineWidth = 1;
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.beginPath();
    ctx.moveTo(xa, ya); ctx.lineTo(xb, yb);
    ctx.stroke();

    const tk = 6;
    if (Math.abs(ya - yb) < 1) {
      ctx.beginPath();
      ctx.moveTo(xa, ya - tk); ctx.lineTo(xa, ya + tk);
      ctx.moveTo(xb, yb - tk); ctx.lineTo(xb, yb + tk);
      ctx.stroke();
      ctx.fillText(text, (xa + xb) / 2, ya - 12 * offsetDir);
    } else {
      ctx.beginPath();
      ctx.moveTo(xa - tk, ya); ctx.lineTo(xa + tk, ya);
      ctx.moveTo(xb - tk, yb); ctx.lineTo(xb + tk, yb);
      ctx.stroke();
      ctx.save();
      ctx.translate(xa + 16 * offsetDir, (ya + yb) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }

  // Top dimensions
  const dyt = oy - slideH - mm(800);
  drawDim(ox, dyt, ox + mm(1072), dyt, '1072');
  drawDim(ox + mm(1072), dyt, ox + mm(5572), dyt, '4500');
  drawDim(ox + mm(5572), dyt, ox + mm(6188), dyt, '616');
  drawDim(ox + mm(6188), dyt, ox + mm(7614), dyt, '1426');
  drawDim(ox + mm(7614), dyt, ox + mm(9098), dyt, '1484');
  drawDim(ox + mm(9098), dyt, ox + mm(14100), dyt, '5002');
  drawDim(ox + mm(14100), dyt, ox + totalW, dyt, '1117');

  // Bottom dimensions
  const dyb = oy + bodyH + slideH + mm(800);
  drawDim(ox, dyb, sx[1], dyb, '1338', -1);
  drawDim(sx[1], dyb, sx[2], dyb, '4264', -1);
  drawDim(sx[2], dyb, sx[3], dyb, '2375', -1);
  drawDim(sx[3], dyb, sx[4], dyb, '379', -1);
  drawDim(sx[4], dyb, sx[5], dyb, '5002', -1);
  drawDim(sx[5], dyb, ox + totalW, dyb, '1392', -1);

  // Right vertical dimensions
  const dxr = ox + totalW + mm(1200);
  drawDim(dxr, oy - slideH, dxr, oy, '1200');
  drawDim(dxr, oy, dxr, oy + bodyH, '2600');
  drawDim(dxr, oy + bodyH, dxr, oy + bodyH + slideH, '1200');

  // Internal dims
  ctx.lineWidth = 0.8;
  drawDim(sx[1] + mm(850), oy + bodyH, sx[1] + mm(850), oy + bodyH - mm(1316), '1316', -1);
  drawDim(sx[2] + mm(1200), oy, sx[2] + mm(1200), oy + mm(1120), '1120', -1);
  drawDim(sx[1], oy + mm(426), sx[1] + mm(426), oy + mm(426), '426');
  drawDim(sx[1] + mm(500), oy + mm(850), sx[1] + mm(500 + 2351), oy + mm(850), '2351');
  drawDim(sx[1] + mm(400), oy + bodyH, sx[1] + mm(400), oy + bodyH - mm(850), '850');

  // ═══════════════════════════════════════
  //  SCALE BAR
  // ═══════════════════════════════════════
  ctx.strokeStyle = '#636366';
  ctx.fillStyle = '#636366';
  ctx.lineWidth = 1.5;
  ctx.font = '12px Inter';
  ctx.textAlign = 'center';
  const sbY = oy + bodyH + slideH + mm(1800);
  const sbW = mm(5000);
  ctx.beginPath();
  ctx.moveTo(-sbW / 2, sbY); ctx.lineTo(sbW / 2, sbY);
  ctx.moveTo(-sbW / 2, sbY - 4); ctx.lineTo(-sbW / 2, sbY + 4);
  ctx.moveTo(sbW / 2, sbY - 4); ctx.lineTo(sbW / 2, sbY + 4);
  ctx.stroke();
  ctx.fillText('5.000 mm', 0, sbY + 18);
  ctx.font = '11px Inter';
  ctx.fillText('PLANTA LAYOUT  —  Escala 1:35', 0, sbY + 36);
}

function drawElectricalPlant(ctx) {
  ctx.fillStyle = '#8E8E93';
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIAGRAMA UNIFILAR — QDF (BAIXA TENSÃO)', 0, -320);

  // Phases on top
  drawWire(ctx, -15, -280, -15, -200, '#FF453A', 2); // R
  drawWire(ctx, 0, -280, 0, -200, '#FF453A', 2);  // S
  drawWire(ctx, 15, -280, 15, -200, '#FF453A', 2); // T
  drawWire(ctx, 30, -280, 30, -200, '#0A84FF', 2); // N
  
  ctx.fillStyle = '#8E8E93';
  ctx.font = 'bold 12px Inter';
  ctx.fillText('R', -15, -290);
  ctx.fillText('S', 0, -290);
  ctx.fillText('T', 15, -290);
  ctx.fillStyle = '#0A84FF';
  ctx.fillText('N', 30, -290);

  // Main Breaker
  ctx.fillStyle = '#fff';
  ctx.fillRect(-30, -200, 75, 60);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(-30, -200, 75, 60);
  
  // Switch
  ctx.fillStyle = '#333';
  ctx.fillRect(-10, -180, 20, 10);
  ctx.fillStyle = '#30D158';
  ctx.font = 'bold 9px Inter';
  ctx.fillText('ON', 0, -185);
  ctx.fillStyle = '#FF453A';
  ctx.fillText('OFF', 0, -165);
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Inter';
  ctx.fillText('63A', 7.5, -145);

  // Main vertical bus
  drawWire(ctx, -15, -140, -15, 280, '#0A84FF', 2); // Left bar
  drawWire(ctx, 0, -140, 0, 280, '#0A84FF', 2);   // Center bar
  drawWire(ctx, 15, -140, 15, 280, '#0A84FF', 2);  // Right bar
  
  // N bar
  drawWire(ctx, 30, -140, 220, -140, '#0A84FF', 2);
  drawWire(ctx, 220, -140, 220, -220, '#0A84FF', 2);
  
  // PE bar
  drawWire(ctx, -220, -140, -220, -220, '#30D158', 2);
  
  // PE Block
  ctx.fillStyle = '#30D15822';
  ctx.fillRect(-230, -220, 20, 140);
  ctx.strokeStyle = '#30D158';
  ctx.strokeRect(-230, -220, 20, 140);
  ctx.fillStyle = '#30D158';
  ctx.fillText('PE', -220, -230);
  for(let i=0; i<10; i++) {
    ctx.beginPath();
    ctx.arc(-220, -210 + i*13, 3, 0, Math.PI*2);
    ctx.fill();
  }

  // N Block
  ctx.fillStyle = '#0A84FF22';
  ctx.fillRect(210, -220, 20, 140);
  ctx.strokeStyle = '#0A84FF';
  ctx.strokeRect(210, -220, 20, 140);
  ctx.fillStyle = '#0A84FF';
  ctx.fillText('N', 220, -230);
  for(let i=0; i<10; i++) {
    ctx.beginPath();
    ctx.arc(220, -210 + i*13, 3, 0, Math.PI*2);
    ctx.fill();
  }

  // Circuits Data
  const leftCircuits = [
    { num: 1, label: 'ILUMINAÇÃO', a: '10A' },
    { num: 3, label: 'AR CONDICIONADO 2', a: '20A' },
    { num: 5, label: 'AR CONDICIONADO 4', a: '25A' },
    { num: 7, label: "TUG'S(ESPERA/USG2)", a: '20A' },
    { num: 9, label: "BOMBA D'ÁGUA", a: '16A' },
    { num: 11, label: 'PAINEL DE LED', a: '25A' },
    { num: 13, label: "TUG'S SALA ESPERA", a: '20A' },
    { num: 15, label: 'RESERVA', a: '10A' },
    { num: 17, label: 'RESERVA', a: '10A' },
    { num: 19, label: "TUG'S (PATOLAS/ENT.)", a: '20A' },
    { num: 21, label: 'RESERVA', a: '10A' }
  ];

  const rightCircuits = [
    { num: 2, label: 'AR CONDICIONADO 1', a: '20A' },
    { num: 4, label: 'AR CONDICIONADO 3', a: '25A' },
    { num: 6, label: 'RACK TI', a: '10A' },
    { num: 8, label: "TUG'S(USG1/SALA COM)", a: '20A' },
    { num: 10, label: 'CARREGADOR BATERIA', a: '20A' },
    { num: 12, label: 'RESERVA', a: '10A' },
    { num: 14, label: 'PORTA PCD', a: '10A' },
    { num: 16, label: 'RESERVA', a: '10A' },
    { num: 18, label: 'RESERVA', a: '10A' },
    { num: 20, label: "TUG'S (SALA EXAME)", a: '20A' },
    { num: 22, label: 'RESERVA', a: '10A' }
  ];

  function drawBreaker(x, y, circ, isRight, phaseIndex) {
    const w = 70;
    const h = 20;
    const startX = isRight ? x : x - w;
    
    // Wire to bus
    const busX = -15 + phaseIndex * 15;
    drawWire(ctx, isRight ? busX : startX + w, y + h/2, isRight ? startX : busX, y + h/2, '#0A84FF', 2);
    // Node dot
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(busX, y + h/2, 3, 0, Math.PI*2);
    ctx.fill();

    // Box
    ctx.fillStyle = '#fff';
    ctx.fillRect(startX, y, w, h);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, y, w, h);

    // Switch
    ctx.fillStyle = '#555';
    ctx.fillRect(startX + (isRight ? 10 : 40), y + 5, 15, 10);
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 9px Inter';
    ctx.fillText(`CIRC.${circ.num.toString().padStart(2, '0')}`, startX + w/2, y + 14);
    
    // Amp rating
    ctx.save();
    ctx.translate(startX + (isRight ? w + 10 : -10), y + h/2);
    ctx.rotate(-Math.PI/2);
    ctx.font = '9px Inter';
    ctx.fillText(circ.a, 0, 0);
    ctx.restore();

    // Output Wire
    drawWire(ctx, isRight ? startX + w + 20 : startX - 20, y + h/2, isRight ? startX + 160 : startX - 160, y + h/2, '#FF9900', 1);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 9px Inter';
    ctx.textAlign = isRight ? 'left' : 'right';
    ctx.fillText(circ.label, isRight ? startX + w + 25 : startX - 25, y + h/2 + 3);
    ctx.textAlign = 'center';
  }

  let startY = -80;
  leftCircuits.forEach((circ, i) => {
    drawBreaker(-30, startY + i * 32, circ, false, i % 3);
  });
  
  rightCircuits.forEach((circ, i) => {
    drawBreaker(30, startY + i * 32, circ, true, i % 3);
  });
}

function drawHydraulicPlant(ctx) {
  ctx.fillStyle = '#8E8E93';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIAGRAMA HIDRÁULICO — SISTEMA DE NIVELAMENTO', 0, -230);

  // Reservoir
  drawComponent(ctx, -60, -180, 120, 60, '#8E8E93', 'RESERVATÓRIO', '40 Litros');

  // Pump
  ctx.beginPath();
  ctx.arc(0, -90, 25, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFD60A';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#FFD60A';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillText('P', 0, -86);
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('BOMBA', 0, -55);

  // Pressure line from pump
  drawWire(ctx, 0, -65, 0, -30, '#FF453A', 3);

  // Pressure gauge
  ctx.beginPath();
  ctx.arc(30, -30, 12, 0, Math.PI * 2);
  ctx.strokeStyle = '#FF453A';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawWire(ctx, 18, -30, 0, -30, '#FF453A', 1);
  ctx.fillStyle = '#FF453A';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('200', 30, -27);
  ctx.fillText('bar', 30, -18);

  // Main manifold
  drawWire(ctx, 0, -30, 0, 20, '#FF453A', 3);
  drawWire(ctx, -200, 20, 200, 20, '#FF453A', 3);

  // Stabilizer circuits
  const stabilizers = [
    { x: -180, label: 'EST. TRAS. ESQ.' },
    { x: -60, label: 'EST. TRAS. DIR.' },
    { x: 60, label: 'EST. DIANT. ESQ.' },
    { x: 180, label: 'EST. DIANT. DIR.' },
  ];

  stabilizers.forEach(stab => {
    // Pressure line down
    drawWire(ctx, stab.x, 20, stab.x, 60, '#FF453A', 2);

    // Valve
    ctx.fillStyle = '#30D15844';
    ctx.fillRect(stab.x - 15, 60, 30, 20);
    ctx.strokeStyle = '#30D158';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(stab.x - 15, 60, 30, 20);
    ctx.fillStyle = '#30D158';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText('V', stab.x, 74);

    // Line to cylinder
    drawWire(ctx, stab.x, 80, stab.x, 110, '#FF453A', 2);

    // Cylinder
    ctx.fillStyle = '#FF6B3522';
    ctx.fillRect(stab.x - 20, 110, 40, 60);
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    ctx.strokeRect(stab.x - 20, 110, 40, 60);

    // Piston
    ctx.fillStyle = '#8E8E93';
    ctx.fillRect(stab.x - 8, 140, 16, 35);

    // Return line
    drawWire(ctx, stab.x + 15, 130, stab.x + 40, 130, '#0A84FF', 1.5);
    drawWire(ctx, stab.x + 40, 130, stab.x + 40, 200, '#0A84FF', 1.5);

    // Label
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillText(stab.label, stab.x, 185);
  });

  // Return manifold
  drawWire(ctx, -140, 200, 220, 200, '#0A84FF', 2);
  drawWire(ctx, 0, 200, 0, 230, '#0A84FF', 2);

  // Filter
  ctx.strokeStyle = '#8E8E93';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-15, 230, 30, 20);
  ctx.fillStyle = '#8E8E93';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('FILTRO', 0, 244);

  // Return to tank
  drawWire(ctx, 0, 250, 0, 270, '#0A84FF', 2);
  ctx.fillStyle = '#0A84FF';
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('→ RESERVATÓRIO', 0, 285);
}

function drawClimPlant(ctx) {
  ctx.fillStyle = '#8E8E93';
  ctx.font = 'bold 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIAGRAMA — SISTEMA DE CLIMATIZAÇÃO', 0, -220);

  // Condensing unit (outside)
  drawComponent(ctx, -250, -160, 140, 80, '#30D158', 'CONDENSADORA', '60.000 BTU');

  // Fan icon
  ctx.beginPath();
  ctx.arc(-180, -110, 20, 0, Math.PI * 2);
  ctx.strokeStyle = '#30D158';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Refrigerant lines
  drawWire(ctx, -180, -80, -180, -20, '#FF6B35', 2);
  ctx.fillStyle = '#FF6B35';
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('LINHA LÍQUIDO', -120, -50);

  drawWire(ctx, -200, -80, -200, -20, '#5AC8FA', 2);
  ctx.fillStyle = '#5AC8FA';
  ctx.fillText('LINHA SUCÇÃO', -260, -50);

  // Expansion valve
  ctx.fillStyle = '#FFD60A44';
  ctx.fillRect(-205, -25, 30, 20);
  ctx.strokeStyle = '#FFD60A';
  ctx.strokeRect(-205, -25, 30, 20);
  ctx.fillStyle = '#FFD60A';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('VEE', -190, -12);

  // Evaporator unit (inside truck)
  drawComponent(ctx, -250, 10, 140, 80, '#0A84FF', 'EVAPORADORA', 'Split Inverter');

  // Truck interior representation
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(-50, -50, 350, 250);
  ctx.setLineDash([]);
  ctx.fillStyle = '#636366';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('INTERIOR DA CARRETA', 125, -35);

  // Ducts
  drawWire(ctx, -110, 50, 50, 50, '#FFD60A', 3);
  drawWire(ctx, 50, 50, 50, 150, '#FFD60A', 3);
  drawWire(ctx, 50, 50, 250, 50, '#FFD60A', 3);

  // Supply vents (cold air)
  const vents = [
    { x: 50, y: 150 },
    { x: 150, y: 50 },
    { x: 250, y: 50 },
  ];

  vents.forEach(vent => {
    ctx.fillStyle = '#5AC8FA44';
    ctx.fillRect(vent.x - 20, vent.y - 5, 40, 20);
    ctx.strokeStyle = '#5AC8FA';
    ctx.lineWidth = 1;
    ctx.strokeRect(vent.x - 20, vent.y - 5, 40, 20);

    // Air flow arrows
    ctx.fillStyle = '#5AC8FA';
    ctx.beginPath();
    ctx.moveTo(vent.x, vent.y + 20);
    ctx.lineTo(vent.x - 5, vent.y + 15);
    ctx.lineTo(vent.x + 5, vent.y + 15);
    ctx.fill();
  });

  // HEPA Filter
  drawComponent(ctx, -250, 110, 100, 40, '#8E8E93', 'FILTRO HEPA', '');

  // Return air
  drawWire(ctx, -200, 150, -200, 180, '#FF6B35', 2);
  ctx.fillStyle = '#FF6B35';
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('RETORNO', -200, 195);

  // Temperature zones
  ctx.fillStyle = '#5AC8FA';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('ZONA: 18°C - 24°C', 150, 130);

  // Sensor
  ctx.beginPath();
  ctx.arc(150, 150, 8, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFD60A';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#FFD60A';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('T', 150, 153);
  ctx.fillText('SENSOR TEMP.', 150, 168);
}

function drawComponent(ctx, x, y, w, h, color, label, sublabel) {
  ctx.fillStyle = color + '18';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = color;
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + h / 2 - (sublabel ? 5 : 0));

  if (sublabel) {
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText(sublabel, x + w / 2, y + h / 2 + 10);
  }
}

function drawWire(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function updateLegend(type) {
  const legendEl = document.getElementById('plant-legend');
  if (!legendEl) return;

  const items = plantLegends[type] || [];

  legendEl.innerHTML = `
    <h4 class="plant-legend-title">Legenda — ${plantTypes.find(t => t.id === type)?.name || ''}</h4>
    <div class="plant-legend-items">
      ${items.map(item => `
        <div class="plant-legend-item">
          <div class="plant-legend-color" style="background: ${item.color};"></div>
          <span>${item.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}
