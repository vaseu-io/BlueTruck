// Passo a passo oficial (fonte: OneNote "Ativação/Desligamento")
// Cada modo tem sua própria sequência de etapas na barra do manual.

const step = (id, title, description, extra = {}) => ({ id, title, description, ...extra });

// Vídeos do passo a passo (public/videos/passo-a-passo). Passos sem 'video' mostram "Vídeo em breve".
const VIDEO_ATIVACAO = '/videos/passo-a-passo/ativacao/';
const vid = (slug) => VIDEO_ATIVACAO + slug + '.mp4';

// Fotos de apoio (public/images/manual)
const FOTOS_CABO = [
  { src: '/images/manual/cabo.jpg', caption: 'Cabo' },
  { src: '/images/manual/entrada-cabo.jpg', caption: 'Entrada do cabo' },
];
const FOTOS_MANGUEIRA = [
  { src: '/images/manual/mangueira.jpg', caption: 'Mangueira e engates' },
];
const FOTOS_TETO_BANHEIRO = [
  { src: '/images/manual/teto-banheiro.jpg', caption: 'Teto do banheiro' },
];
const FOTOS_PAREDE_BANHEIRO = [
  { src: '/images/manual/parede-banheiro.jpg', caption: 'Parede do banheiro' },
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
  step(`${prefix}-ligar`, 'Motores: como ligar',
    '3.1 Pino 1 para trás<br>3.2 Pino 2 para frente<br>3.3 Pino 3 para trás<br>' +
    'Após posicionar os pinos corretamente, puxe a corda ou gire a chave.<br>' +
    '3.4 Quando o motor der partida, volte o Pino 2 para trás.',
    {
      icon: '🔑',
      group,
      video: videos.ligar,
      warning: 'Se o motor estiver sem combustível, faça a manobra de bombeamento com duas pessoas: encaixe a alavanca no tubo de saída do motor e bombeie para cima e para baixo.'
    }),
];

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
            { icon: '🛞', noVideo: true }),
          ...motorSteps('m', 'Motores', { oleo: vid('nivel-de-oleo'), ligar: vid('ligar-motores') }),
          step('m-suporte', 'Montar suporte da Sala 1 — Nivelar',
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
          step('m-alav5', 'Alavanca 5 — Abertura da sala 2',
            'Empurre a alavanca para a saída da porta.',
            { icon: '🕹️', group: EXT_ESQUERDO, video: vid('alavanca-5-abertura-sala-tomografo-esquerdo') }),
          step('m-motores-off', 'Desligar motores', '', { icon: '⏹️', group: EXT_ESQUERDO, noVideo: true }),
          step('m-escada', 'Montagem da escada de acesso', '', { icon: '🪜', group: INTERNA, video: vid('montar-desmontar-escada') }),
          step('m-cabos', 'Cabos Sala 1 e 2', '', { icon: '🔌', group: INTERNA, images: FOTOS_CABO, video: vid('colocar-remover-cabo-de-energia') }),
          step('m-mangueiras', 'Mangueiras Sala 2', '', { icon: '🧵', group: INTERNA, images: FOTOS_MANGUEIRA }),
          step('m-parede', 'Acoplar teto do banheiro', '', { icon: '🚿', group: INTERNA, video: vid('teto-do-banheiro') }),
          step('m-piso-esq', 'Montar pisos do lado esquerdo da sala do tomógrafo', '', { icon: '🧱', group: INTERNA }),
          step('m-pisos2', 'Colocar pisos da Sala do Tomógrafo', '', { icon: '🧱', group: INTERNA, video: vid('colocar-pisos-sala-2') }),
          step('m-penier', 'Montar Penier', '', { icon: '🏗️', group: INTERNA, video: vid('montar-penier'), warning: 'IMPORTANTE: a montagem e a desmontagem são obrigatoriamente feitas por duas pessoas.' }),
          step('m-piso-dir', 'Montar pisos do lado direito da sala do tomógrafo', '', { icon: '🧱', group: INTERNA }),
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
            'Execute a montagem hidráulica seguindo o passo a passo do vídeo (aba Vídeo-Aulas).',
            { icon: '🎬' }),
        ]
      },
      {
        id: 'eletrica',
        title: 'Elétrica',
        icon: '⚡',
        color: '#FFD60A',
        description: 'Ligação da energia e dos quadros de força (QDF).',
        steps: [
          step('me-tomada', 'Ligar na tomada de energia',
            'Ligue na tomada de energia, no acesso das alavancas do lado direito.',
            { icon: '🔌' }),
          step('me-qdf-ext', 'Ligar QDF externo', '', { icon: '🎛️' }),
          step('me-qdf-int', 'Ligar QDF interno', '', { icon: '🎛️' }),
          step('me-qdf-tomo', 'Ligar QDF do Tomógrafo', '', { icon: '🎛️' }),
        ]
      }
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
          step('d-cabo1', 'Remover cabo da Sala 1', '', { icon: '🔌', group: DES_INTERNA, images: FOTOS_CABO, video: vid('colocar-remover-cabo-de-energia') }),
          step('d-cabo-tomo', 'Remover cabo da Sala do Tomógrafo', '', { icon: '🔌', group: DES_INTERNA, images: FOTOS_CABO, video: vid('colocar-remover-cabo-de-energia') }),
          step('d-mangueira', 'Remover mangueira da Sala do Tomógrafo', '', { icon: '🧵', group: DES_INTERNA, images: FOTOS_MANGUEIRA }),
          step('d-teto-banheiro', 'Desacoplar teto do banheiro', '', { icon: '🚿', group: DES_INTERNA, images: FOTOS_TETO_BANHEIRO }),
          step('d-parede-banheiro', 'Posicionar parede do banheiro para fechamento da sala', '', { icon: '🚿', group: DES_INTERNA, images: FOTOS_PAREDE_BANHEIRO, video: '/videos/passo-a-passo/ativacao/parede-do-banheiro.mp4' }),
          step('d-pisos-chao', 'Remover pisos do chão da Sala do Tomógrafo', '', { icon: '🧱', group: DES_INTERNA }),
          step('d-pisos-acoplar', 'Levantar e acoplar pisos da Sala do Tomógrafo', '', { icon: '🧱', group: DES_INTERNA }),
          step('d-penier', 'Fechar Penier', '', { icon: '🏗️', group: DES_INTERNA, warning: 'IMPORTANTE: a montagem e a desmontagem são obrigatoriamente feitas por duas pessoas.' }),
          step('d-mover', 'Mover todos os itens da Sala 1 para o Consultório 1', '', { icon: '📦', group: DES_INTERNA }),
          step('d-trilhos', 'Limpar trilhos', '', { icon: '🧹', group: DES_INTERNA }),
          ...motorSteps('d', 'Após a confirmação do nivelamento do caminhão'),
          step('d-alav5', 'Alavanca 5 — Fechar sala 2',
            'Puxe a alavanca para o fechamento da porta.',
            { icon: '🕹️', group: DES_ESQUERDO }),
          step('d-chave-esq', 'Desligar com a chave', '', { icon: '🔑', group: DES_ESQUERDO }),
          step('d-pinos-esq', 'Voltar pinos à posição inicial', '', { icon: '↩️', group: DES_ESQUERDO }),
          step('d-alav3', 'Alavanca 3 — Recolher Sala 01',
            'Puxe a alavanca para recolher a sala.',
            { icon: '🕹️', group: DES_DIREITO }),
          step('d-alav4', 'Alavanca 4 — Recolher sala do Tomógrafo',
            'Puxe para recolher a sala.',
            { icon: '🕹️', group: DES_DIREITO }),
          step('d-suporte', 'Recolher suporte da Sala 1 e guardar no maleiro', '', { icon: '🏗️', group: DES_DIREITO }),
          step('d-escada', 'Recolher escada de acesso e guardar no maleiro', '', { icon: '🪜', group: DES_DIREITO, video: vid('montar-desmontar-escada') }),
          step('d-alav2', 'Alavanca 2 — Recolha para subir a porta',
            'Puxe para recolher a porta.',
            { icon: '🕹️', group: DES_DIREITO }),
          step('d-alav1', 'Alavanca 1 — Trava da porta',
            'Puxe a alavanca para fazer o travamento das portas.',
            { icon: '🕹️', group: DES_DIREITO }),
          step('d-chave', 'Desligar com a chave', '', { icon: '🔑', group: 'Finalização' }),
          step('d-pinos', 'Voltar pinos à posição inicial', '', { icon: '↩️', group: 'Finalização' }),
          step('d-motores-off', 'Desligar motores', '', { icon: '⏹️', group: 'Finalização', noVideo: true }),
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
          step('de-qdf-tomo', 'Desligar QDF do Tomógrafo', '', { icon: '🎛️' }),
          step('de-qdf-int', 'Desligar QDF interno', '', { icon: '🎛️' }),
          step('de-qdf-ext', 'Desligar QDF externo', '', { icon: '🎛️' }),
        ]
      },
      {
        id: 'hidraulica',
        title: 'Hidráulica',
        icon: '💧',
        color: '#30D158',
        description: 'Remoção de dejetos e conferência do maleiro.',
        steps: [
          step('dh-dejetos', 'Remover dejetos', '', { icon: '🚰' }),
          step('dh-checklist', 'Conferir itens do maleiro no checklist', '', { icon: '✅' }),
        ]
      }
    ]
  }
};
