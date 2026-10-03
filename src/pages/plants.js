let currentPlant = 'layout';
let canvasState = { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, startX: 0, startY: 0 };
let resizeBound = false;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 8;

const plantTypes = [
  { id: 'layout', name: 'Layout Interno', icon: '🏗️' },
  { id: 'eletrica', name: 'Quadro de Força', icon: '⚡' }
];

const GREEN = '#30D158';
const YELLOW = '#FFD60A';
const ORANGE = '#FF6B35';
const BLUE = '#0A84FF';
const RED = '#FF453A';
const GRAY = '#8E8E93';

// Itens numerados da planta baixa (os números aparecem no desenho)
const layoutLegend = [
  { color: GREEN, title: 'Gerador', items: [[1, 'Gerador interno 60 kVA'], [2, 'Starlink']] },
  { color: YELLOW, title: 'Consultório 01', items: [[3, 'W.C. PCD'], [4, 'Sistema de ultrassom / Maca'], [5, 'Mesa de atendimento / Cadeiras'], [6, 'Impressora']] },
  { color: YELLOW, title: 'Consultório 02', items: [[7, 'Painel LED 3x2'], [8, 'Cadeiras empilháveis'], [9, 'Mesa de atendimento']] },
  { color: ORANGE, title: 'Disparo', items: [[10, 'Navibox'], [11, 'Monitor'], [12, 'Mini rack de parede 6U'], [13, 'Bancada para console'], [14, 'Cortina']] },
  { color: BLUE, title: 'Tomografia e Avanço 01', items: [[15, 'CT Scanner'], [16, 'Mesa do paciente'], [17, 'Carro maca (padiola) c/ suporte de soro'], [18, 'Plataforma para maca']] },
  { color: RED, title: 'Nobreak / QDF', items: [[19, 'Nobreak'], [20, 'Tomógrafo'], [21, 'Cabine trocador'], [22, 'Quadro de comando'], [23, 'Estabilizador']] },
];

const plantLegends = {
  eletrica: [
    { color: RED, label: 'Fase R (220V)' },
    { color: YELLOW, label: 'Fase S (220V)' },
    { color: BLUE, label: 'Fase T (220V)' },
    { color: GREEN, label: 'Terra (PE)' },
    { color: '#C7C7CC', label: 'Neutro (N)' },
    { color: ORANGE, label: 'Disjuntores' },
  ]
};

// Dimensões do desenho (unidades do canvas) para ajustar o zoom inicial à tela
const mm = (v) => v * 0.09;
const PLANT_BOUNDS = {
  layout: { minX: -mm(14800) / 2 - mm(1900), maxX: mm(14800) / 2 + mm(1200) + 50, minY: -400, maxY: 400 },
  eletrica: { minX: -440, maxX: 440, minY: -395, maxY: 400 },
};

const font = (size, weight = 'bold') => `${weight} ${size}px Inter, "Segoe UI", sans-serif`;

function drawText(ctx, str, x, y, size, color, weight = 'bold', align = 'center') {
  ctx.font = font(size, weight);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

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
            Diagramas e plantas técnicas da carreta com tomógrafo. Arraste para mover e use Ctrl + scroll (ou os botões +/−) para zoom.
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

function resetView() {
  canvasState = { scale: 1, offsetX: 0, offsetY: 0, isDragging: false, startX: 0, startY: 0 };
}

function setupPlantTabs() {
  document.getElementById('plant-tabs')?.querySelectorAll('.plant-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.plant-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlant = btn.dataset.plant;
      resetView();
      drawPlant(currentPlant);
    });
  });
}

// Zoom mantendo fixo o ponto (px, py), medido a partir do centro do canvas
function zoomBy(factor, px = 0, py = 0) {
  const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, canvasState.scale * factor));
  const ratio = next / canvasState.scale;
  canvasState.offsetX = px - (px - canvasState.offsetX) * ratio;
  canvasState.offsetY = py - (py - canvasState.offsetY) * ratio;
  canvasState.scale = next;
  drawPlant(currentPlant);
}

function setupPlantControls() {
  const container = document.getElementById('plant-canvas-container');
  if (!container) return;

  document.getElementById('plant-zoom-in')?.addEventListener('click', () => zoomBy(1.25));
  document.getElementById('plant-zoom-out')?.addEventListener('click', () => zoomBy(1 / 1.25));
  document.getElementById('plant-reset')?.addEventListener('click', () => {
    resetView();
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

  // Ctrl + scroll (ou pinça no trackpad) dá zoom em direção ao cursor;
  // o scroll normal continua rolando a página
  container.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    zoomBy(e.deltaY > 0 ? 0.9 : 1.1, px, py);
  }, { passive: false });

  if (!resizeBound) {
    resizeBound = true;
    window.addEventListener('resize', () => {
      if (document.getElementById('plant-canvas')) drawPlant(currentPlant);
    });
  }
}

function drawPlant(type) {
  const canvas = document.getElementById('plant-canvas');
  const container = document.getElementById('plant-canvas-container');
  if (!canvas || !container) return;

  // Canvas nítido em telas HiDPI
  const dpr = window.devicePixelRatio || 1;
  const bounds = PLANT_BOUNDS[type];
  const cw = container.clientWidth;
  // Altura acompanha a proporção do desenho (sem sobrar área vazia)
  const aspect = (bounds.maxY - bounds.minY + 40) / (bounds.maxX - bounds.minX + 60);
  container.style.height = `${Math.round(Math.min(680, Math.max(360, cw * aspect)))}px`;
  const ch = container.clientHeight;
  canvas.width = cw * dpr;
  canvas.height = ch * dpr;
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, cw, ch);

  // Zoom inicial: o desenho inteiro cabe na tela
  const b = bounds;
  const fit = Math.min(cw / (b.maxX - b.minX + 60), ch / (b.maxY - b.minY + 40));
  const k = fit * canvasState.scale;
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;

  ctx.save();
  ctx.translate(cw / 2 + canvasState.offsetX, ch / 2 + canvasState.offsetY);
  ctx.scale(k, k);
  ctx.translate(-cx, -cy);

  const worldX = (sx) => (sx - cw / 2 - canvasState.offsetX) / k + cx;
  const worldY = (sy) => (sy - ch / 2 - canvasState.offsetY) / k + cy;
  drawGrid(ctx, worldX(0), worldX(cw), worldY(0), worldY(ch), k);

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

  updateLegend(type);
}

function drawGrid(ctx, x0, x1, y0, y1, k) {
  const step = 40;
  ctx.strokeStyle = '#161d2e';
  ctx.lineWidth = 1 / k;
  ctx.beginPath();
  for (let x = Math.floor(x0 / step) * step; x <= x1; x += step) {
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y1);
  }
  for (let y = Math.floor(y0 / step) * step; y <= y1; y += step) {
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
  }
  ctx.stroke();
}

function drawLayoutPlant(ctx) {
  const totalW = mm(14800);
  const bodyH = mm(2600);
  const ox = -totalW / 2;
  const oy = -bodyH / 2;

  // Section X positions (from left)
  const secW = [1338, 4264, 2375, 379, 5002, 1392].map(v => mm(v));
  const sx = [ox];
  secW.forEach(w => sx.push(sx[sx.length - 1] + w));

  const slideH = mm(1200);
  const ts1x = ox + mm(1072);
  const ts1w = mm(4500);
  const pcdx = ts1x + ts1w + mm(616);
  const pcdw = mm(1426);
  const ts2x = pcdx + pcdw + mm(1484);
  const ts2w = mm(5002);

  const txt = (s, x, y, size, color, weight = 'bold') => drawText(ctx, s, x, y, size, color, weight);

  const box = (x, y, w, h, color) => {
    ctx.fillStyle = color + '2E';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  };

  const ring = (x, y, r, color, lw = 2) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
  };

  // Número do item (ver legenda abaixo do desenho)
  const badge = (n, x, y, color) => {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#0d1117';
    ctx.lineWidth = 2;
    ctx.stroke();
    txt(String(n), x, y + 1, 18, '#0d1117');
  };

  // Title
  const cx = ox + totalW / 2;
  txt('PLANTA BAIXA — BLUE HEALTH', cx, -388, 30, '#F2F2F7');
  txt('Dimensões em milímetros (mm)', cx, -356, 17, '#AEAEB2', 'normal');

  // ── Room fills
  const fills = [GREEN, YELLOW, ORANGE, GRAY, BLUE, RED];
  fills.forEach((c, i) => {
    ctx.fillStyle = c + (i === 3 ? '14' : '1F');
    ctx.fillRect(sx[i], oy, secW[i], bodyH);
  });

  // ── Main walls
  ctx.strokeStyle = '#E5E5EA';
  ctx.lineWidth = 4;
  ctx.strokeRect(ox, oy, totalW, bodyH);
  ctx.lineWidth = 3;
  for (let i = 1; i < sx.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(sx[i], oy);
    ctx.lineTo(sx[i], oy + bodyH);
    ctx.stroke();
  }

  // ── Slide-outs
  const slide = (x, y, w, color, dashed = false) => {
    ctx.fillStyle = color + '1A';
    ctx.fillRect(x, y, w, slideH);
    ctx.strokeStyle = color + 'CC';
    ctx.lineWidth = 2.5;
    if (dashed) ctx.setLineDash([8, 6]);
    ctx.strokeRect(x, y, w, slideH);
    ctx.setLineDash([]);
  };
  slide(ts1x, oy - slideH, ts1w, YELLOW);
  slide(pcdx, oy - slideH, pcdw, '#C7C7CC', true);
  slide(ts2x, oy - slideH, ts2w, BLUE);
  slide(sx[4], oy + bodyH, mm(5002), BLUE);

  // PCD door arc
  ctx.strokeStyle = '#C7C7CC99';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(pcdx + pcdw / 2, oy, mm(500), 0, Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);

  // ── Cabin
  ctx.save();
  ctx.translate(ox - mm(300), oy + bodyH / 2);
  ctx.rotate(-Math.PI / 8);
  ctx.fillStyle = '#1a223699';
  ctx.fillRect(-mm(1600), -mm(1000), mm(1600), mm(2000));
  ctx.strokeStyle = '#E5E5EA';
  ctx.lineWidth = 3;
  ctx.strokeRect(-mm(1600), -mm(1000), mm(1600), mm(2000));
  txt('GABINETE', -mm(800), 0, 21, '#C7C7CC');
  ctx.restore();

  // ── Gerador (1, 2)
  box(ox + mm(100), oy + mm(400), mm(1100), mm(1600), GREEN);
  ring(ox + mm(650), oy + mm(500), mm(250), GREEN);
  badge(1, ox + mm(650), oy + mm(1250), GREEN);
  badge(2, ox + mm(650), oy + mm(500), GREEN);

  // ── Consultório 01 (3–6)
  box(sx[1] + mm(50), oy + bodyH - mm(900), mm(900), mm(850), YELLOW);
  ring(sx[1] + mm(350), oy + bodyH - mm(500), mm(150), YELLOW);
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 2;
  ctx.strokeRect(sx[1] + mm(650), oy + bodyH - mm(850), mm(250), mm(250));
  badge(3, sx[1] + mm(800), oy + bodyH - mm(280), YELLOW);

  box(sx[1] + mm(1600), oy + mm(900), mm(2000), mm(900), YELLOW);
  badge(4, sx[1] + mm(2600), oy + mm(1350), YELLOW);

  box(sx[1] + mm(600), oy + mm(300), mm(1000), mm(500), YELLOW);
  ring(sx[1] + mm(850), oy + mm(200), mm(120), YELLOW);
  ring(sx[1] + mm(1300), oy + mm(200), mm(120), YELLOW);
  badge(5, sx[1] + mm(1100), oy + mm(550), YELLOW);

  box(sx[1] + mm(2800), oy + bodyH - mm(550), mm(500), mm(350), YELLOW);
  badge(6, sx[1] + mm(3050), oy + bodyH - mm(375), YELLOW);

  txt('CONSULTÓRIO 01', sx[1] + mm(2900), oy + mm(450), 26, YELLOW);

  // ── Consultório 02 (7–9)
  const y2 = oy - slideH;
  box(ts1x + mm(200), y2 + mm(150), mm(1600), mm(350), YELLOW);
  badge(7, ts1x + mm(1000), y2 + mm(325), YELLOW);
  box(ts1x + mm(200), y2 + mm(600), mm(700), mm(450), YELLOW);
  badge(8, ts1x + mm(550), y2 + mm(825), YELLOW);
  box(ts1x + mm(2700), y2 + mm(200), mm(1400), mm(700), YELLOW);
  ring(ts1x + mm(3400), y2 + mm(350), mm(100), YELLOW);
  badge(9, ts1x + mm(3400), y2 + mm(650), YELLOW);
  txt('CONSULTÓRIO 02', ts1x + ts1w / 2, y2 - 18, 26, YELLOW);

  // ── Plataforma PCD
  txt('PLATAFORMA', pcdx + pcdw / 2, y2 + slideH / 2 - 26, 19, '#E5E5EA');
  txt('PCD', pcdx + pcdw / 2, y2 + slideH / 2, 19, '#E5E5EA');
  txt('PORTA LATERAL', pcdx + pcdw / 2, y2 + slideH / 2 + 28, 15, '#AEAEB2', 'normal');

  // ── Disparo (10–14)
  box(sx[2] + mm(300), oy + mm(200), mm(500), mm(400), ORANGE);
  badge(10, sx[2] + mm(550), oy + mm(400), ORANGE);
  box(sx[2] + mm(1200), oy + mm(200), mm(700), mm(500), ORANGE);
  badge(11, sx[2] + mm(1550), oy + mm(450), ORANGE);
  box(sx[2] + mm(300), oy + bodyH - mm(700), mm(600), mm(500), ORANGE);
  badge(12, sx[2] + mm(600), oy + bodyH - mm(450), ORANGE);
  box(sx[2] + mm(1000), oy + bodyH - mm(900), mm(1100), mm(700), ORANGE);
  badge(13, sx[2] + mm(1550), oy + bodyH - mm(550), ORANGE);
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(sx[2] + mm(100), oy + mm(1200));
  ctx.lineTo(sx[2] + secW[2] - mm(100), oy + mm(1200));
  ctx.stroke();
  ctx.setLineDash([]);
  badge(14, sx[2] + mm(2000), oy + mm(1200), ORANGE);
  txt('DISPARO', sx[2] + mm(1000), oy + mm(1470), 26, ORANGE);

  // ── Tomografia (15, 16) + Avanço 01 (17, 18)
  const ctX = sx[4] + mm(3200);
  const midY = oy + bodyH / 2;
  box(sx[4] + mm(800), midY - mm(250), mm(2400), mm(500), BLUE);
  badge(16, sx[4] + mm(2000), midY, BLUE);
  ring(ctX, midY, mm(550), BLUE, 3);
  ring(ctX, midY, mm(420), BLUE, 3);
  badge(15, ctX, midY, BLUE);
  txt('TOMOGRAFIA', sx[4] + secW[4] / 2, oy + mm(350), 26, BLUE);

  box(ts2x + mm(300), y2 + mm(150), mm(2000), mm(700), BLUE);
  badge(17, ts2x + mm(1300), y2 + mm(500), BLUE);
  box(ts2x + mm(2800), y2 + mm(150), mm(1800), mm(700), BLUE);
  badge(18, ts2x + mm(3700), y2 + mm(500), BLUE);
  txt('AVANÇO 01', ts2x + ts2w / 2, y2 - 18, 26, BLUE);
  txt('AVANÇO 02', sx[4] + mm(2500), oy + bodyH + slideH + 20, 26, BLUE);

  // ── Nobreak / QDF (19–23)
  box(sx[5] + mm(80), oy + mm(100), mm(900), mm(650), RED);
  badge(19, sx[5] + mm(530), oy + mm(425), RED);
  box(sx[5] + mm(80), oy + mm(900), mm(600), mm(700), RED);
  badge(20, sx[5] + mm(380), oy + mm(1250), RED);
  box(sx[5] + mm(750), oy + mm(1100), mm(550), mm(1400), RED);
  badge(21, sx[5] + mm(1025), oy + mm(1800), RED);
  box(sx[5] + secW[5] - mm(350), oy + bodyH - mm(900), mm(250), mm(700), RED);
  badge(22, sx[5] + secW[5] - mm(225), oy + bodyH - mm(550), RED);
  badge(23, sx[5] + mm(400), oy + bodyH - mm(250), RED);

  // ── Dimension lines
  const DIM = '#FF6B6B';
  function drawDim(xa, ya, xb, yb, text, offsetDir = 1) {
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(xa, ya); ctx.lineTo(xb, yb);
    ctx.stroke();

    const tk = 8;
    if (Math.abs(ya - yb) < 1) {
      ctx.beginPath();
      ctx.moveTo(xa, ya - tk); ctx.lineTo(xa, ya + tk);
      ctx.moveTo(xb, yb - tk); ctx.lineTo(xb, yb + tk);
      ctx.stroke();
      drawText(ctx, text, (xa + xb) / 2, ya - 21 * offsetDir, 17, DIM, 'bold');
    } else {
      ctx.beginPath();
      ctx.moveTo(xa - tk, ya); ctx.lineTo(xa + tk, ya);
      ctx.moveTo(xb - tk, yb); ctx.lineTo(xb + tk, yb);
      ctx.stroke();
      ctx.save();
      ctx.translate(xa + 24 * offsetDir, (ya + yb) / 2);
      ctx.rotate(-Math.PI / 2);
      drawText(ctx, text, 0, 0, 17, DIM, 'bold');
      ctx.restore();
    }
  }

  const dyt = oy - slideH - mm(800);
  drawDim(ox, dyt, ox + mm(1072), dyt, '1072');
  drawDim(ox + mm(1072), dyt, ox + mm(5572), dyt, '4500');
  drawDim(ox + mm(5572), dyt, ox + mm(6188), dyt, '616');
  drawDim(ox + mm(6188), dyt, ox + mm(7614), dyt, '1426');
  drawDim(ox + mm(7614), dyt, ox + mm(9098), dyt, '1484');
  drawDim(ox + mm(9098), dyt, ox + mm(14100), dyt, '5002');
  drawDim(ox + mm(14100), dyt, ox + totalW, dyt, '1117');

  const dyb = oy + bodyH + slideH + mm(800);
  drawDim(ox, dyb, sx[1], dyb, '1338', -1);
  drawDim(sx[1], dyb, sx[2], dyb, '4264', -1);
  drawDim(sx[2], dyb, sx[3], dyb, '2375', -1);
  drawDim(sx[3], dyb, sx[4], dyb, '379', -1);
  drawDim(sx[4], dyb, sx[5], dyb, '5002', -1);
  drawDim(sx[5], dyb, ox + totalW, dyb, '1392', -1);

  const dxr = ox + totalW + mm(1200);
  drawDim(dxr, oy - slideH, dxr, oy, '1200');
  drawDim(dxr, oy, dxr, oy + bodyH, '2600');
  drawDim(dxr, oy + bodyH, dxr, oy + bodyH + slideH, '1200');

  // ── Scale bar
  ctx.strokeStyle = '#AEAEB2';
  ctx.lineWidth = 2;
  const sbY = dyb + 48;
  const sbW = mm(5000);
  ctx.beginPath();
  ctx.moveTo(cx - sbW / 2, sbY); ctx.lineTo(cx + sbW / 2, sbY);
  ctx.moveTo(cx - sbW / 2, sbY - 6); ctx.lineTo(cx - sbW / 2, sbY + 6);
  ctx.moveTo(cx + sbW / 2, sbY - 6); ctx.lineTo(cx + sbW / 2, sbY + 6);
  ctx.stroke();
  txt('5.000 mm  —  PLANTA LAYOUT, escala 1:35', cx, sbY + 22, 16, '#AEAEB2', 'normal');
}

function drawElectricalPlant(ctx) {
  const WIRE_N = '#C7C7CC';
  const PHASES = [RED, YELLOW, BLUE];
  const busX = [-24, 0, 24];
  const txt = (s, x, y, size, color, weight = 'bold', align = 'center') =>
    drawText(ctx, s, x, y, size, color, weight, align);

  txt('QUADRO DE FORÇA — QDF', 0, -370, 26, '#F2F2F7');
  txt('Diagrama unifilar · Baixa tensão', 0, -343, 15, '#AEAEB2', 'normal');

  // Entrada R, S, T, N
  const inX = [...busX, 48];
  const inColor = [...PHASES, WIRE_N];
  const inLabel = ['R', 'S', 'T', 'N'];
  inX.forEach((x, i) => {
    txt(inLabel[i], x, -312, 17, inColor[i]);
    ctx.strokeStyle = inColor[i];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, -300);
    ctx.lineTo(x, i === 3 ? -238 : -210);
    ctx.stroke();
  });

  // Barra N
  ctx.strokeStyle = WIRE_N;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(48, -238);
  ctx.lineTo(190, -238);
  ctx.stroke();
  ctx.fillStyle = WIRE_N + '33';
  ctx.fillRect(190, -252, 140, 28);
  ctx.strokeRect(190, -252, 140, 28);
  txt('BARRA N', 260, -238, 14, WIRE_N);

  // Barra PE
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 5]);
  ctx.beginPath();
  ctx.moveTo(-190, -238);
  ctx.lineTo(-84, -238);
  ctx.lineTo(-84, -180);
  ctx.lineTo(-60, -180);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = GREEN + '33';
  ctx.fillRect(-330, -252, 140, 28);
  ctx.strokeRect(-330, -252, 140, 28);
  txt('BARRA PE', -260, -238, 14, GREEN);

  // Disjuntor geral
  ctx.fillStyle = '#161b26';
  ctx.fillRect(-60, -210, 120, 60);
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 3;
  ctx.strokeRect(-60, -210, 120, 60);
  txt('63A', 0, -190, 24, '#F2F2F7');
  txt('DISJ. GERAL', 0, -166, 12, '#AEAEB2');

  const left = [
    ['ILUMINAÇÃO', '10A'], ['AR CONDICIONADO 2', '20A'], ['AR CONDICIONADO 4', '25A'],
    ["TUG'S (ESPERA/USG2)", '20A'], ["BOMBA D'ÁGUA", '16A'], ['PAINEL DE LED', '25A'],
    ["TUG'S SALA ESPERA", '20A'], ['RESERVA', '10A'], ['RESERVA', '10A'],
    ["TUG'S (PATOLAS/ENT.)", '20A'], ['RESERVA', '10A'],
  ];
  const right = [
    ['AR CONDICIONADO 1', '20A'], ['AR CONDICIONADO 3', '25A'], ['RACK TI', '10A'],
    ["TUG'S (USG1/SALA COM)", '20A'], ['CARREGADOR BATERIA', '20A'], ['RESERVA', '10A'],
    ['PORTA PCD', '10A'], ['RESERVA', '10A'], ['RESERVA', '10A'],
    ["TUG'S (SALA EXAME)", '20A'], ['RESERVA', '10A'],
  ];

  const y0 = -100;
  const step = 44;
  const busEnd = y0 + (left.length - 1) * step + 22;

  // Faixas alternadas para guiar o olhar
  for (let i = 0; i < left.length; i += 2) {
    ctx.fillStyle = '#ffffff09';
    ctx.fillRect(-430, y0 + i * step - step / 2, 860, step);
  }

  // Barramentos
  busX.forEach((x, p) => {
    ctx.strokeStyle = PHASES[p];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, -150);
    ctx.lineTo(x, busEnd);
    ctx.stroke();
    txt(inLabel[p], x, busEnd + 18, 15, PHASES[p]);
  });

  const breaker = (side, i, label, amps) => {
    const y = y0 + i * step;
    const p = i % 3;
    const bx = side < 0 ? -170 : 60;
    const edge = side < 0 ? -60 : 60;

    ctx.strokeStyle = PHASES[p];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(busX[p], y);
    ctx.lineTo(edge, y);
    ctx.stroke();

    ctx.fillStyle = '#161b26';
    ctx.fillRect(bx, y - 16, 110, 32);
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, y - 16, 110, 32);
    txt(`CIRC. ${String(2 * i + (side < 0 ? 1 : 2)).padStart(2, '0')}`, bx + 8, y, 14, '#F2F2F7', 'bold', 'left');
    txt(amps, bx + 102, y, 14, ORANGE, 'bold', 'right');

    txt(label, side < 0 ? -182 : 182, y, 17, '#E5E5EA', 'bold', side < 0 ? 'right' : 'left');
  };

  left.forEach(([label, amps], i) => breaker(-1, i, label, amps));
  right.forEach(([label, amps], i) => breaker(1, i, label, amps));

  // Pontos de derivação nos barramentos
  left.forEach((_, i) => {
    ctx.fillStyle = PHASES[i % 3];
    ctx.beginPath();
    ctx.arc(busX[i % 3], y0 + i * step, 5, 0, Math.PI * 2);
    ctx.fill();
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

  const title = plantTypes.find(t => t.id === type)?.name || '';

  if (type === 'layout') {
    legendEl.innerHTML = `
      <h4 class="plant-legend-title">Legenda — ${title}</h4>
      <div class="plant-legend-groups">
        ${layoutLegend.map(group => `
          <div class="plant-legend-group">
            <h5 style="color: ${group.color};">${group.title}</h5>
            ${group.items.map(([n, label]) => `
              <div class="plant-legend-item">
                <span class="plant-legend-num" style="background: ${group.color};">${n}</span>
                <span>${label}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  const items = plantLegends[type] || [];

  legendEl.innerHTML = `
    <h4 class="plant-legend-title">Legenda — ${title}</h4>
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
