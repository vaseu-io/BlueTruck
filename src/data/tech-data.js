// Dados técnicos conferidos com os documentos oficiais (public/docs):
//  PE   = PE -15741-R00.pdf (projeto/layout)
//  CL   = CHECK LIST MALERO.pdf
//  PC1/2 = Planilhas de Carga 1 e 2 (QD01 / QD02)
//  QD01 / Entrada 1 e 2 = diagramas unifilares
// Só entram aqui informações que constam nesses documentos.

const pdf = (label, file) => ({
  label,
  value: `<a href="/docs/${file}" target="_blank" class="download-link">Baixar PDF</a>`
});

export const techSpecs = {
  carreta: {
    title: 'Carreta (Semirreboque)',
    icon: '🚛',
    color: '#FF6B35',
    specs: [
      { label: 'Tipo', value: 'Semirreboque — Tomografia / USG' },
      { label: 'Comprimento Total', value: '15,00 m (15.000 mm)' },
      { label: 'Largura', value: '2,60 m' },
      { label: 'Altura', value: '≈ 4,25 m (baú 2.900 mm + 1.349 mm até o solo)' },
      { label: 'Pneus', value: '295/80 R22,5 radiais sem câmara — 8 unidades + 1 estepe' },
      { label: 'Rodas', value: 'Aço forjado 8,25 x 22,5" — 8 unidades' },
      { label: 'Revestimento Interno', value: 'Paredes em ACM branco 4 mm; forro em MDF branco' },
      { label: 'Piso', value: 'Vinílico Tarkett Cliff Oak Natural sobre compensado; base em chapa de aço 3 mm' },
      { label: 'Blindagem', value: 'Lençol de chumbo 3,0 mm + blindagem de radiofrequência (sala do tomógrafo)' },
      { label: 'Acessibilidade', value: 'Plataforma elevatória One Arm (PCD) e plataforma para maca' },
      { label: 'Toldo', value: 'Articulado, lona PVC 3,00 x 2,50 m' },
      { label: 'Janela do Banheiro', value: 'Basculante 1200 x 600 mm' },
      { label: 'Extintores', value: 'Água 10 L (2 un.) e CO₂ 6 kg (2 un.)' }
    ]
  },
  geradorExterno: {
    title: 'Gerador Externo (Diesel)',
    icon: '⚡',
    color: '#FFD60A',
    specs: [
      { label: 'Modelo', value: 'Generac PWY65' },
      { label: 'Potência', value: '84 kVA' },
      { label: 'Tipo', value: 'Diesel trifásico, refrigerado a água' },
      { label: 'Frequência', value: '60 Hz' },
      { label: 'Função', value: 'Fonte de energia para casos de emergência' }
    ]
  },
  geradorInterno: {
    title: 'Gerador Interno',
    icon: '🔋',
    color: '#FFD60A',
    specs: [
      { label: 'Potência', value: '60 kVA' },
      { label: 'Uso', value: 'Para quando a unidade é ligada na tomada (energia externa)' },
      { label: 'Seleção da fonte', value: 'Quadros de entrada com seletor de fase automático e contatoras (gerador interno/externo)' }
    ]
  },
  eletrica: {
    title: 'Quadros Elétricos (QD01 / QD02)',
    icon: '🎛️',
    color: '#FF9F0A',
    specs: [
      { label: 'Quadro de Entrada 1 (QD01)', value: 'Transformador 35 kVA (220/380 V → 380 V) · DG1 80 A · contatoras 220 V 115 A / 380 V 80 A' },
      { label: 'Quadro de Entrada 2 (QD02)', value: 'Transformador 70 kVA (220/380 V → 380 V) · DG1 200 A · contatoras 220 V 200 A / 380 V 150 A' },
      { label: 'QD01 — Distribuição', value: 'Disjuntor geral 63 A · DR 63 A · 22 circuitos' },
      { label: 'QD01 — Cabos', value: 'Entrada 4 × 16 mm² EPR · terra 16 mm²' },
      { label: 'QD02 — Tomógrafo', value: '56 kW · 380 V 3F+N · disjuntor 125 A · DR 125 A' },
      { label: 'QD02 — Cabos', value: 'Entrada 4 × 35 mm² EPR · terra 16 mm²' },
      { label: 'Extensão de Entrada', value: 'QD01: 4 × 25 mm² EPR, 40 m, camlock 150 A · QD02: 4 × 70 mm² EPR, 40 m, camlock 400 A' },
      { label: 'Cabo de Energia (Check List)', value: 'Trifásico, ~25 m, plug 125 A' },
      { label: 'Proteção', value: 'DPS (classe I e II) + DR' }
    ]
  },
  climatizacao: {
    title: 'Sistema de Climatização',
    icon: '❄️',
    color: '#5AC8FA',
    specs: [
      { label: 'Tipo', value: 'Split inverter LG — cassete e Hi-Wall' },
      { label: 'Cassete 36.000 BTU', value: '2 aparelhos (recepção / tomógrafo) · 3.770 W cada · disjuntor 25 A' },
      { label: 'Hi-Wall 12.000 BTU', value: '1 aparelho (tomógrafo) · 2.240 W · disjuntor 20 A' },
      { label: 'Hi-Wall 9.000 BTU', value: '1 aparelho (comando) · 1.500 W · disjuntor 20 A' },
      { label: 'Potência Total (4 aparelhos)', value: '11.280 W' },
      { label: 'Alimentação', value: '220 V monofásico / 60 Hz' }
    ]
  },
  documentos: {
    title: 'Documentos Técnicos e Checklists',
    icon: '📄',
    color: '#8E8E93',
    specs: [
      pdf('Projeto PE — Layout e Vistas', 'PE -15741-R00.pdf'),
      pdf('Diagrama QD01 (22 circuitos)', 'Diagramas-BLUE_HEALTH QD01.pdf'),
      pdf('Diagrama Geral de Entrada 1', 'BLUE_HEALTH Diagrama Geral de Entrada 1.pdf'),
      pdf('Diagrama Geral de Entrada 2', 'BLUE_HEALTH Diagrama Geral de Entrada 2.pdf'),
      pdf('Planilha de Carga 1', 'PLANILHA DE CARGA 1 - BLUE HEALTH_REV.pdf'),
      pdf('Planilha de Carga 2', 'PLANILHA DE CARGA 2 - BLUE HEALTH_REV.pdf'),
      pdf('Check List Maleiro', 'CHECK LIST MALERO.pdf')
    ]
  }
};

export const hotspotData = [
  {
    id: 'gerador',
    name: 'Geradores (84 kVA externo / 60 kVA interno)',
    description: 'Gerador externo diesel de 84 kVA (Generac PWY65) e gerador interno de 60 kVA, usado quando a unidade é ligada na tomada.',
    position: { x: -6.5, y: 1.5, z: 0 },
    color: '#FFD60A',
    specs: [
      { label: 'Externo', value: 'Generac PWY65 · 84 kVA · diesel' },
      { label: 'Externo — Rede', value: 'Trifásico · 60 Hz' },
      { label: 'Interno', value: '60 kVA' },
      { label: 'Uso do interno', value: 'Ligado na tomada' }
    ],
    manualLink: 'eletrica'
  },
  {
    id: 'painel',
    name: 'Quadros Elétricos (QD01 / QD02)',
    description: 'QD01 distribui a energia da unidade em 22 circuitos; o QD02 alimenta o tomógrafo.',
    position: { x: 0, y: 2.0, z: -1.3 }, // Inside command area
    color: '#FF6B35',
    specs: [
      { label: 'QD01 — Disjuntor Geral', value: '63 A' },
      { label: 'QD01 — Circuitos', value: '22' },
      { label: 'QD02 — Tomógrafo', value: '56 kW · 125 A · 380 V' },
      { label: 'Proteção', value: 'DR + DPS' }
    ],
    manualLink: 'eletrica'
  },
  {
    id: 'climatizacao',
    name: 'Ar-condicionado',
    description: 'Quatro aparelhos split inverter LG: dois cassetes de 36.000 BTU e dois Hi-Wall de 12.000 e 9.000 BTU.',
    position: { x: 0, y: 4.2, z: 0 },
    color: '#5AC8FA',
    specs: [
      { label: 'Cassete', value: '2 × 36.000 BTU' },
      { label: 'Hi-Wall', value: '12.000 e 9.000 BTU' },
      { label: 'Potência Total', value: '11.280 W' },
      { label: 'Alimentação', value: '220 V / 60 Hz' }
    ],
    manualLink: 'eletrica'
  }
];
