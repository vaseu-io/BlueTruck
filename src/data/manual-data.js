// Passo a passo oficial (fonte: OneNote "Ativação/Desligamento")
// Cada modo tem sua própria sequência de etapas na barra do manual.

import { asset } from '../utils/asset.js';

const step = (id, title, description, extra = {}) => ({ id, title, description, ...extra });

// Vídeos do passo a passo (public/videos/passo-a-passo). Passos sem vídeo ficam sem botão.
const VIDEO_ATIVACAO = asset('videos/passo-a-passo/ativacao/');
const vid = (slug) => VIDEO_ATIVACAO + slug + '.mp4';
const vidDes = (slug) => asset('videos/passo-a-passo/desmontagem/' + slug + '.mp4');

// Fotos de apoio (public/images/manual)
const FOTOS_CABO = [
  { src: asset('images/manual/cabo.jpg'), caption: 'Cabo' },
  { src: asset('images/manual/entrada-cabo.jpg'), caption: 'Entrada do cabo' },
];
const FOTOS_MANGUEIRA = [
  { src: asset('images/manual/mangueira.jpg'), caption: 'Mangueira e engates' },
];
const FOTOS_TETO_BANHEIRO = [
  { src: asset('images/manual/teto-banheiro.jpg'), caption: 'Teto do banheiro' },
];
const FOTOS_PAREDE_BANHEIRO = [
  { src: asset('images/manual/parede-banheiro.jpg'), caption: 'Parede do banheiro' },
];

const EXT_DIREITO = 'Ativação Externa — Lado Direito';
const EXT_ESQUERDO = 'Ativação Externa — Lado Esquerdo';
const INTERNA = 'Ativação Interna';
const DES_INTERNA = 'Desligamento Interno';
const DES_ESQUERDO = 'Desligamento Externo — Lado Esquerdo';
const DES_DIREITO = 'Desligamento Externo — Lado Direito';

const motorSteps = (prefix, group, videos = {}) => [
  // Óleo e voltímetro são um passo só (o vídeo cobre os dois)
  step(`${prefix}-oleo`, 'Motores: verificar o nível de óleo e o voltímetro',
    'Nível de óleo: se o indicador estiver amarelo, o nível está cheio; se estiver branco, está vazio.<br>' +
    'Voltímetro: deve estar em 100 VA. Acima disso o motor desliga sozinho.',
    { icon: '🛢️', group, video: videos.oleo }),
  step(`${prefix}-ligar`, 'Motores: como ativar e desligar',
    '1. Pino 1 para trás<br>2. Pino 2 para frente<br>3. Pino 3 para trás<br>' +
    'Após posicionar os pinos corretamente, puxe a corda ou gire a chave.<br>' +
    '4. Quando o motor der partida, volte o Pino 2 para trás.',
    {
      icon: '🔑',
      group,
      video: videos.ligar,
      warning: 'Se o motor estiver sem combustível, faça a manobra de bombeamento com duas pessoas: encaixe a alavanca no tubo de saída do motor e bombeie para cima e para baixo.'
    }),
];

// Módulo final (igual na Ativação e no Desligamento)
const elevadorAcessibilidade = {
  id: 'elevador',
  title: 'Acessibilidade',
  icon: '♿',
  color: '#BF5AF2',
  description: 'Elevador de acessibilidade da unidade.',
  steps: [
    step('el-montar', 'Como montar o elevador de acessibilidade?', '', { icon: '♿', video: vid('elevador-acessibilidade') }),
  ]
};

export const manualModes = {
  activation: {
    label: 'Ativação',
    stages: [
      {
        id: 'montagem',
        title: 'Montagem',
        icon: '🔧',
        color: '#0A84FF',
        description: 'Nivelamento, ligação dos motores e montagem externa e interna da carreta.',
        steps: [
          step('m-nivel', 'Nivelamento',
            'Confirme o nivelamento da carreta: frente do caminhão e atrás do caminhão, no peito da carreta.',
            { icon: '📐', video: vid('nivelamento'), warning: 'Não montar nem desmontar a carreta sem estar nivelada.' }),
          step('m-freio', 'Freio manual',
            'Após a confirmação do nivelamento, utilize o freio manual que está dentro do maleiro.',
            { icon: '🛞' }),
          ...motorSteps('m', 'Motores', { oleo: vid('nivel-de-oleo'), ligar: vid('ligar-motores') }),
          step('m-suporte', 'Montar suporte do Consultório 2 — Nivelar',
            'Deixe levemente inclinado contra o caminhão, para que em caso de chuva a água não escorra para dentro do caminhão.',
            { icon: '🏗️', group: EXT_DIREITO, video: vid('montar-suporte-sala-1') }),
          step('m-alav1', 'Alavanca 1 — Trava na porta',
            'Empurre a alavanca para fazer a liberação da porta.',
            { icon: '🕹️', group: EXT_DIREITO, video: vid('alavanca-1-trava-da-porta') }),
          step('m-alav2', 'Alavanca 2 — Descer porta',
            'Empurre a alavanca para a porta descer.',
            { icon: '🕹️', group: EXT_DIREITO, video: vid('alavanca-2-descer-a-porta') }),
          step('m-alav3', 'Alavanca 3 — Saída da sala',
            'Empurre para a saída da sala assim que a porta 2 estiver 100% montada.',
            { icon: '🕹️', group: EXT_DIREITO, video: vid('alavanca-3-liberar-do-consultorio') }),
          step('m-alav4', 'Alavanca 4 — Abertura da sala do Tomógrafo',
            'Empurre a alavanca para a saída da porta.',
            { icon: '🕹️', group: EXT_DIREITO, video: vid('alavanca-4-abertura-sala-tomografo-direito') }),
          step('m-alav5', 'Alavanca 5 — Sala do Tomógrafo',
            'Empurre a alavanca para a saída da porta.',
            { icon: '🕹️', group: EXT_ESQUERDO, video: vid('alavanca-5-abertura-sala-tomografo-esquerdo') }),
          step('m-motores-off', 'Desligar motores', '', { icon: '⏹️', group: EXT_ESQUERDO }),
          step('m-escada', 'Montagem da escada de acesso', '', { icon: '🪜', group: INTERNA, video: vid('montar-desmontar-escada') }),
          step('m-cabos', 'Cabos Consultório 2 e Sala 2', '', { icon: '🔌', group: INTERNA, images: FOTOS_CABO, video: vid('colocar-remover-cabo-de-energia') }),
          step('m-mangueiras', 'Mangueiras Sala 2', '', { icon: '🧵', group: INTERNA, images: FOTOS_MANGUEIRA, video: vid('mangueira-sala-2') }),
          step('m-parede', 'Acoplar teto do banheiro', '', { icon: '🚿', group: INTERNA, video: vid('teto-do-banheiro') }),
          step('m-pisos2', 'Acoplar Pisos', '', { icon: '🧱', group: INTERNA, videos: [vid('pisos-sala-do-tomografo-1'), vid('colocar-pisos-sala-2')] }),
          step('m-penier', 'Montar Penier', '', { icon: '🏗️', group: INTERNA, video: vid('montar-penier'), warning: 'IMPORTANTE: a montagem e a desmontagem são obrigatoriamente feitas por duas pessoas.' }),
          step('m-piso-dir', 'Montar Pisos ao Lado do Penier', '', { icon: '🧱', group: INTERNA }),
        ]
      },
      {
        id: 'hidraulica',
        title: 'Hidráulica',
        icon: '💧',
        color: '#30D158',
        description: 'Montagem do sistema hidráulico.',
        steps: [
          step('mh-video', 'Seguir o passo a passo do vídeo',
            'Execute a montagem hidráulica seguindo o passo a passo do vídeo.',
            { icon: '🎬', video: vid('hidraulica-montagem') }),
        ]
      },
      {
        id: 'eletrica',
        title: 'Elétrica',
        icon: '⚡',
        color: '#FFD60A',
        description: 'Ligação da energia e dos quadros de força (QDF).',
        steps: [
          step('me-tomada', 'Conectar tomada de energia',
            'Ligue na tomada de energia, no acesso das alavancas do lado direito.',
            { icon: '🔌' }),
          step('me-gerador', 'Como utilizar o gerador (opcional)',
            'Etapa opcional: siga o vídeo para utilizar o gerador.',
            { icon: '⚡', video: vid('como-utilizar-gerador') }),
          step('me-qdf-ext', 'Ligar QDF externo', '', {
            icon: '🎛️',
            video: vid('quadro-de-forca'),
            warning: 'IMPORTANTE: entenda a explicação para ativar o quadro corretamente e prevenir riscos!'
          }),
          step('me-qdf-int', 'Ligar QDF interno', '', { icon: '🎛️', video: vid('qdf-interno') }),
          step('me-qdf-tomo', 'Ligar QDF do Tomógrafo', '', { icon: '🎛️', video: vid('qdf-sala-do-tomografo') }),
        ]
      },
      elevadorAcessibilidade
    ]
  },

  shutdown: {
    label: 'Desligamento',
    stages: [
      {
        id: 'desmontagem',
        title: 'Desmontagem',
        icon: '🔧',
        color: '#0A84FF',
        description: 'Desmontagem interna, ligação dos motores e recolhimento das salas.',
        steps: [
          step('d-cabo1', 'Remover cabo do Consultório 2', '', { icon: '🔌', group: DES_INTERNA, images: FOTOS_CABO, video: vid('colocar-remover-cabo-de-energia') }),
          step('d-cabo-tomo', 'Remover cabo da Sala do Tomógrafo', '', { icon: '🔌', group: DES_INTERNA, images: FOTOS_CABO, video: vid('colocar-remover-cabo-de-energia') }),
          step('d-mangueira', 'Remover mangueira da Sala do Tomógrafo', '', { icon: '🧵', group: DES_INTERNA, images: FOTOS_MANGUEIRA }),
          step('d-teto-banheiro', 'Desacoplar teto do banheiro', '', { icon: '🚿', group: DES_INTERNA, images: FOTOS_TETO_BANHEIRO }),
          step('d-parede-banheiro', 'Posicionar parede do banheiro para fechamento da sala', '', { icon: '🚿', group: DES_INTERNA, images: FOTOS_PAREDE_BANHEIRO, video: vid('parede-do-banheiro') }),
          step('d-pisos-chao', 'Remover pisos do chão da Sala do Tomógrafo', '', { icon: '🧱', group: DES_INTERNA, video: vid('pisos-sala-do-tomografo-1') }),
          step('d-pisos-acoplar', 'Desacoplar pisos da sala do Tomógrafo', '', { icon: '🧱', group: DES_INTERNA, video: vidDes('desacoplar-pisos') }),
          step('d-penier', 'Desligar Penier', '', { icon: '🏗️', group: DES_INTERNA, video: vidDes('desligar-penier'), warning: 'IMPORTANTE: a montagem e a desmontagem são obrigatoriamente feitas por duas pessoas.' }),
          step('d-mover', 'Mover todos os itens do Consultório 2 para o Consultório 1', '', { icon: '📦', group: DES_INTERNA }),
          step('d-trilhos', 'Limpar trilhos', '', { icon: '🧹', group: DES_INTERNA }),
          ...motorSteps('d', 'Após a confirmação do nivelamento do caminhão', { oleo: vid('nivel-de-oleo') }),
          step('d-alav5', 'Alavanca 5 — Fechar sala 2',
            'Puxe a alavanca para o fechamento da porta.',
            { icon: '🕹️', group: DES_ESQUERDO, video: vid('alavanca-5-abertura-sala-tomografo-esquerdo') }),
          step('d-alav3', 'Alavanca 3 — Recolher Consultório 2',
            'Puxe a alavanca para recolher a sala.',
            { icon: '🕹️', group: DES_DIREITO, video: vid('alavanca-3-liberar-do-consultorio') }),
          step('d-alav4', 'Alavanca 4 — Recolher sala do Tomógrafo',
            'Puxe para recolher a sala.',
            { icon: '🕹️', group: DES_DIREITO, video: vid('alavanca-4-abertura-sala-tomografo-direito') }),
          step('d-alav2', 'Alavanca 2 — Recolha para subir a porta',
            'Puxe para recolher a porta.',
            { icon: '🕹️', group: DES_DIREITO, video: vid('alavanca-2-descer-a-porta') }),
          step('d-alav1', 'Alavanca 1 — Trava da porta',
            'Puxe a alavanca para fazer o travamento das portas.',
            { icon: '🕹️', group: DES_DIREITO, video: vid('alavanca-1-trava-da-porta') }),
          step('d-escada', 'Recolher escada de acesso e guardar no maleiro', '', { icon: '🪜', group: DES_DIREITO, video: vid('montar-desmontar-escada') }),
          step('d-suporte', 'Desmontar suporte consultório 2', '',
            { icon: '🏗️', group: DES_DIREITO, video: vid('montar-suporte-sala-1') }),
          step('d-chave', 'Desligar Motores', '', { icon: '🔑', group: 'Finalização' }),
        ]
      },
      {
        id: 'eletrica',
        title: 'Elétrica',
        icon: '⚡',
        color: '#FFD60A',
        description: 'Desligamento do tomógrafo, do ar condicionado e dos quadros de força (QDF).',
        steps: [
          step('de-tomo', 'Desligar Tomógrafo', '', { icon: '🖥️' }),
          step('de-ar', 'Desligar ar condicionado', '', { icon: '❄️' }),
          step('de-qdf-tomo', 'Desligar QDF do Tomógrafo', '', { icon: '🎛️', video: vid('qdf-sala-do-tomografo') }),
          step('de-qdf-int', 'Desligar QDF interno', '', { icon: '🎛️', video: vid('qdf-interno') }),
          step('de-qdf-ext', 'Desligar QDF externo', '', {
            icon: '🎛️',
            video: vid('quadro-de-forca'),
            warning: 'IMPORTANTE: entenda a explicação para desligar o quadro corretamente e prevenir riscos!'
          }),
        ]
      },
      {
        id: 'hidraulica',
        title: 'Hidráulica',
        icon: '💧',
        color: '#30D158',
        description: 'Remoção de dejetos e conferência do maleiro.',
        steps: [
          step('dh-dejetos', 'Remover dejetos e água suja', '', { icon: '🚰' }),
          step('dh-checklist', 'Conferir itens do maleiro no checklist', '', {
            icon: '✅',
            links: [{ label: 'Abrir o checklist do maleiro (PDF)', href: asset('docs/CHECK LIST MALERO.pdf') }]
          }),
        ]
      },
      elevadorAcessibilidade
    ]
  }
};
