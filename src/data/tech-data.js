export const techSpecs = {
  carreta: {
    title: 'Carreta (Semi-reboque)',
    icon: '🚛',
    color: '#FF6B35',
    specs: [
      { label: 'Tipo', value: 'Semi-reboque Baú Especial' },
      { label: 'Comprimento Total', value: '14.80 m' },
      { label: 'Largura', value: '2.60 m' },
      { label: 'Altura', value: '4.40 m' },
      { label: 'Tara', value: '8.500 kg' },
      { label: 'PBT (Peso Bruto Total)', value: '18.000 kg' },
      { label: 'Eixos', value: '3 eixos com suspensão pneumática' },
      { label: 'Pneus', value: '275/80 R22.5 (12 unidades)' },
      { label: 'Material do Baú', value: 'Alumínio reforçado com isolamento térmico' },
      { label: 'Piso', value: 'Anti-derrapante com reforço estrutural' },
      { label: 'Isolamento', value: 'Poliuretano expandido 80mm' },
      { label: 'Portas', value: '1 porta lateral + 1 porta traseira' },
      { label: 'Estabilizadores', value: '4 macacos hidráulicos' },
      { label: 'Blindagem', value: 'Chumbo 2mm (sala do tomógrafo)' }
    ]
  },
  gerador: {
    title: 'Gerador de Energia',
    icon: '⚡',
    color: '#FFD60A',
    specs: [
      { label: 'Tipo', value: 'Diesel Silenciado' },
      { label: 'Potência', value: '60 kVA' },
      { label: 'Tensão de Saída', value: '220/380V Trifásico' },
      { label: 'Frequência', value: '60 Hz' },
      { label: 'Motor', value: 'Diesel 6 cilindros turbo' },
      { label: 'Cilindrada', value: '6.700 cm³' },
      { label: 'Consumo', value: '28 L/h (carga plena)' },
      { label: 'Tanque', value: '400 litros' },
      { label: 'Autonomia', value: '~14 horas' },
      { label: 'Nível de Ruído', value: '72 dB(A) a 7m' },
      { label: 'Peso', value: '2.800 kg' },
      { label: 'Regulação de Tensão', value: '±1%' },
      { label: 'Partida', value: 'Elétrica 24V' }
    ]
  },
  climatizacao: {
    title: 'Sistema de Climatização',
    icon: '❄️',
    color: '#5AC8FA',
    specs: [
      { label: 'Tipo', value: 'Casset e Hi-Wall' },
      { label: 'Capacidade', value: '36.000 BTU (Casset), 9k/12k BTU (Hi-Wall)' },
      { label: 'Gás Refrigerante', value: 'R-410A' },
      { label: 'Faixa de Temperatura', value: '16°C - 30°C' },
      { label: 'Alimentação', value: '220V / 60Hz' },
      { label: 'Potência', value: '5.200 W' },
      { label: 'Filtros', value: 'HEPA + Carvão ativado' },
      { label: 'Vazão de Ar', value: '1.800 m³/h' }
    ]
  },
  hidraulica: {
    title: 'Sistema Hidráulico',
    icon: '💧',
    color: '#30D158',
    specs: [
      { label: 'Bomba', value: 'Engrenagens 12 cm³/rot' },
      { label: 'Pressão de Trabalho', value: '200 bar' },
      { label: 'Reservatório', value: '40 litros' },
      { label: 'Fluido', value: 'ISO VG 46' },
      { label: 'Estabilizadores', value: '4x macaco hidráulico' },
      { label: 'Curso dos Macacos', value: '600 mm' },
      { label: 'Capacidade por Macaco', value: '12 toneladas' },
      { label: 'Acionamento', value: 'Elétrico 24V + Controle remoto' },
      { label: 'Nível Digital', value: 'Precisão 0.1°' }
    ]
  },
  documentos: {
    title: 'Documentos Técnicos e Checklists',
    icon: '📄',
    color: '#8E8E93',
    specs: [
      { label: 'Diagrama Geral de Entrada 1', value: '<a href="/docs/BLUE_HEALTH Diagrama Geral de Entrada 1.pdf" target="_blank" class="download-link">Baixar PDF</a>' },
      { label: 'Diagrama Geral de Entrada 2', value: '<a href="/docs/BLUE_HEALTH Diagrama Geral de Entrada 2.pdf" target="_blank" class="download-link">Baixar PDF</a>' },
      { label: 'Check List Malero', value: '<a href="/docs/CHECK LIST MALERO.pdf" target="_blank" class="download-link">Baixar PDF</a>' },
      { label: 'Planilha de Carga 1', value: '<a href="/docs/PLANILHA DE CARGA 1 - BLUE HEALTH_REV.pdf" target="_blank" class="download-link">Baixar PDF</a>' },
      { label: 'Planilha de Carga 2', value: '<a href="/docs/PLANILHA DE CARGA 2 - BLUE HEALTH_REV.pdf" target="_blank" class="download-link">Baixar PDF</a>' }
    ]
  }
};

export const hotspotData = [
  {
    id: 'gerador',
    name: 'Gerador 60 kVA',
    description: 'Gerador diesel silenciado para alimentação independente de toda a unidade.',
    position: { x: -6.5, y: 1.5, z: 0 },
    color: '#FFD60A',
    specs: techSpecs.gerador.specs.slice(0, 6),
    status: 'Operacional',
    manualLink: 'eletrica'
  },
  {
    id: 'painel',
    name: 'Painel de Controle',
    description: 'QDG - Quadro de Distribuição Geral com todos os disjuntores e medidores.',
    position: { x: 0, y: 2.0, z: -1.3 }, // Inside command area
    color: '#FF6B35',
    specs: [
      { label: 'Tipo', value: 'QDG / QDF (Baixa Tensão)' },
      { label: 'Disjuntor Geral', value: '63A' },
      { label: 'Disjuntores', value: '22 circuitos' },
      { label: 'Medição', value: 'V, A, Hz, kW, cos φ' },
      { label: 'Proteção', value: 'DR + DPS' }
    ],
    status: 'Operacional',
    manualLink: 'eletrica'
  },
  {
    id: 'estabilizador-d',
    name: 'Estabilizadores Dianteiros (Patolas)',
    description: 'Macacos hidráulicos para nivelamento e estabilização da carreta.',
    position: { x: -5, y: 0.5, z: 1.5 },
    color: '#30D158',
    specs: techSpecs.hidraulica.specs.slice(4, 8),
    status: 'Operacional',
    manualLink: 'hidraulica'
  },
  {
    id: 'estabilizador-t',
    name: 'Estabilizadores Traseiros (Patolas)',
    description: 'Macacos hidráulicos traseiros para suporte e nivelamento.',
    position: { x: 5, y: 0.5, z: 1.5 },
    color: '#30D158',
    specs: techSpecs.hidraulica.specs.slice(4, 8),
    status: 'Operacional',
    manualLink: 'hidraulica'
  },
  {
    id: 'climatizacao',
    name: 'Ar-condicionado',
    description: 'Sistema de climatização para manter temperatura ideal do tomógrafo.',
    position: { x: 0, y: 4.2, z: 0 },
    color: '#5AC8FA',
    specs: techSpecs.climatizacao.specs.slice(0, 5),
    status: 'Operacional',
    manualLink: 'eletrica'
  }
];
