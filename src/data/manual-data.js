// Passo a passo oficial (fonte: OneNote "Ativação/Desligamento")
// Cada modo tem sua própria sequência de etapas na barra do manual.

const step = (id, title, description, extra = {}) => ({ id, title, description, ...extra });

const EXT_DIREITO = 'Ativação Externa — Lado Direito';
const EXT_ESQUERDO = 'Ativação Externa — Lado Esquerdo';
const INTERNA = 'Ativação Interna';
const DES_INTERNA = 'Desligamento Interno';
const DES_ESQUERDO = 'Desligamento Externo — Lado Esquerdo';
const DES_DIREITO = 'Desligamento Externo — Lado Direito';

const motorSteps = (prefix, group) => [
  step(`${prefix}-oleo`, 'Motores: verificar o nível de óleo',
    'Se o indicador estiver amarelo, o nível está cheio; se estiver branco, está vazio.',
    { icon: '🛢️', group }),
  step(`${prefix}-volt`, 'Motores: conferir o voltímetro',
    'O voltímetro deve estar em 100 VA. Acima disso o motor desliga sozinho.',
    { icon: '📊', group }),
  step(`${prefix}-ligar`, 'Motores: como ligar',
    '3.1 Pino 1 para trás<br>3.2 Pino 2 para frente<br>3.3 Pino 3 para trás<br>' +
    'Após posicionar os pinos corretamente, puxe a corda ou gire a chave.<br>' +
    '3.4 Quando o motor der partida, volte o Pino 2 para trás.',
    {
      icon: '🔑',
      group,
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
            { icon: '📐', warning: 'Não montar nem desmontar a carreta sem estar nivelada.' }),
          step('m-freio', 'Freio manual',
            'Após a confirmação do nivelamento, utilize o freio manual que está dentro do maleiro.',
            { icon: '🛞' }),
          ...motorSteps('m', 'Motores'),
          step('m-suporte', 'Montar suporte da Sala 1 — Nivelar',
            'Deixe levemente inclinado contra o caminhão, para que em caso de chuva a água não escorra para dentro do caminhão.',
            { icon: '🏗️', group: EXT_DIREITO }),
          step('m-alav1', 'Alavanca 1 — Trava na porta',
            'Empurre a alavanca para fazer a liberação da porta.',
            { icon: '🕹️', group: EXT_DIREITO }),
          step('m-alav2', 'Alavanca 2 — Descer porta',
            'Empurre a alavanca para a porta descer.',
            { icon: '🕹️', group: EXT_DIREITO }),
          step('m-alav3', 'Alavanca 3 — Saída da sala',
            'Empurre para a saída da sala assim que a porta 2 estiver 100% montada.',
            { icon: '🕹️', group: EXT_DIREITO }),
          step('m-alav4', 'Alavanca 4 — Abertura da sala do Tomógrafo',
            'Empurre a alavanca para a saída da porta.',
            { icon: '🕹️', group: EXT_DIREITO }),
          step('m-alav5', 'Alavanca 5 — Abertura da sala 2',
            'Empurre a alavanca para a saída da porta.',
            { icon: '🕹️', group: EXT_ESQUERDO }),
          step('m-motores-off', 'Desligar motores', '', { icon: '⏹️', group: EXT_ESQUERDO }),
          step('m-escada', 'Montagem da escada de acesso', '', { icon: '🪜', group: INTERNA }),
          step('m-pisos2', 'Colocar pisos da Sala 2', '', { icon: '🧱', group: INTERNA }),
          step('m-cabos', 'Cabos Sala 1 e 2', '', { icon: '🔌', group: INTERNA }),
          step('m-mangueiras', 'Mangueiras Sala 2', '', { icon: '🧵', group: INTERNA }),
          step('m-desacoplar', 'Desacoplar teto do banheiro', '', { icon: '🚿', group: INTERNA }),
          step('m-teto', 'Levantar teto do banheiro', '', { icon: '🚿', group: INTERNA }),
          step('m-parede', 'Montar parede do banheiro', '', { icon: '🚿', group: INTERNA }),
          step('m-piso-esq', 'Montar pisos do lado esquerdo da sala do tomógrafo', '', { icon: '🧱', group: INTERNA }),
          step('m-penier', 'Montar Penier', '', { icon: '🏗️', group: INTERNA }),
          step('m-piso-dir', 'Montar pisos do lado direito da sala do tomógrafo', '', { icon: '🧱', group: INTERNA }),
          step('m-endireitar', 'Endireitar parede do banheiro', '', { icon: '🚿', group: INTERNA }),
          step('m-trilhos', 'Limpar todos os trilhos das salas', '', { icon: '🧹', group: INTERNA }),
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
          step('d-cabo1', 'Remover cabo da Sala 1', '', { icon: '🔌', group: DES_INTERNA }),
          step('d-cabo-tomo', 'Remover cabo da Sala do Tomógrafo', '', { icon: '🔌', group: DES_INTERNA }),
          step('d-mangueira', 'Remover mangueira da Sala do Tomógrafo', '', { icon: '🧵', group: DES_INTERNA }),
          step('d-pisos-chao', 'Remover pisos do chão da Sala do Tomógrafo', '', { icon: '🧱', group: DES_INTERNA }),
          step('d-pisos-acoplar', 'Levantar e acoplar pisos da Sala do Tomógrafo', '', { icon: '🧱', group: DES_INTERNA }),
          step('d-penier', 'Fechar Penier', '', { icon: '🏗️', group: DES_INTERNA }),
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
          step('d-escada', 'Recolher escada de acesso e guardar no maleiro', '', { icon: '🪜', group: DES_DIREITO }),
          step('d-alav2', 'Alavanca 2 — Recolha para subir a porta',
            'Puxe para recolher a porta.',
            { icon: '🕹️', group: DES_DIREITO }),
          step('d-alav1', 'Alavanca 1 — Trava da porta',
            'Puxe a alavanca para fazer o travamento das portas.',
            { icon: '🕹️', group: DES_DIREITO }),
          step('d-chave', 'Desligar com a chave', '', { icon: '🔑', group: 'Finalização' }),
          step('d-pinos', 'Voltar pinos à posição inicial', '', { icon: '↩️', group: 'Finalização' }),
          step('d-motores-off', 'Desligar motores', '', { icon: '⏹️', group: 'Finalização' }),
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
