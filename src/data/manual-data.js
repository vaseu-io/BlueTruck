export const manualStages = [
  {
    id: 'desmontagem',
    number: 1,
    title: 'Desmontagem',
    icon: '🔧',
    color: '#0A84FF',
    description: 'Procedimentos de montagem e desmontagem física da carreta e posicionamento do tomógrafo.',
    activation: {
      title: 'Ativação — Desmontagem',
      steps: [
        {
          id: 'a1-1',
          title: 'Posicionar a carreta',
          description: 'Estacione a carreta em superfície plana e nivelada. Certifique-se de que o terreno suporta o peso total (aprox. 18 toneladas).',
          warning: 'Nunca posicionar em terreno inclinado ou instável.',
          icon: '📍'
        },
        {
          id: 'a1-2',
          title: 'Travar o veículo',
          description: 'Acione o freio de estacionamento e posicione calços nas rodas traseiras e dianteiras.',
          icon: '🛞'
        },
        {
          id: 'a1-3',
          title: 'Desacoplar o cavalo mecânico',
          description: 'Desconecte as mangueiras pneumáticas e elétricas do cavalo mecânico. Solte a quinta roda e retire o cavalo.',
          icon: '🚛'
        },
        {
          id: 'a1-4',
          title: 'Abrir compartimentos laterais',
          description: 'Destrave e abra os compartimentos laterais de acesso aos sistemas internos. Use a chave T fornecida no kit.',
          icon: '🔓'
        },
        {
          id: 'a1-5',
          title: 'Montar a escada de acesso',
          description: 'Instale a escada de acesso na porta principal. Verifique os travas de segurança antes de subir.',
          warning: 'Use sempre EPI: capacete, luvas e botas de segurança.',
          icon: '🪜'
        },
        {
          id: 'a1-6',
          title: 'Verificação visual interna',
          description: 'Realize inspeção visual do interior: verifique se não há objetos soltos, danos visíveis ou vazamentos.',
          icon: '👁️'
        }
      ]
    },
    shutdown: {
      title: 'Desligamento — Desmontagem',
      steps: [
        {
          id: 'd1-1',
          title: 'Fechar compartimentos internos',
          description: 'Verifique se todos os equipamentos internos estão fixados e seguros. Feche e trave as portas internas.',
          icon: '🔒'
        },
        {
          id: 'd1-2',
          title: 'Recolher a escada',
          description: 'Desmonte a escada de acesso e armazene no compartimento designado.',
          icon: '🪜'
        },
        {
          id: 'd1-3',
          title: 'Fechar compartimentos laterais',
          description: 'Trave todos os compartimentos laterais com a chave T. Verifique se estão firmemente fechados.',
          icon: '🔐'
        },
        {
          id: 'd1-4',
          title: 'Acoplar o cavalo mecânico',
          description: 'Reconecte o cavalo mecânico à quinta roda. Conecte mangueiras pneumáticas e elétricas.',
          icon: '🚛'
        },
        {
          id: 'd1-5',
          title: 'Remover calços e destravar',
          description: 'Retire os calços das rodas e desacione o freio de estacionamento quando pronto para movimentação.',
          icon: '🛞'
        }
      ]
    }
  },
  {
    id: 'eletrica',
    number: 2,
    title: 'Elétrica',
    icon: '⚡',
    color: '#FFD60A',
    description: 'Conexões elétricas, ativação do gerador e configuração do painel de controle.',
    activation: {
      title: 'Ativação — Elétrica',
      steps: [
        {
          id: 'a2-1',
          title: 'Verificar nível de combustível',
          description: 'Confira o nível de diesel do gerador. O tanque deve estar com mínimo de 50% para início de operação.',
          warning: 'Nunca opere o gerador com menos de 20% de combustível.',
          icon: '⛽'
        },
        {
          id: 'a2-2',
          title: 'Inspeção do gerador',
          description: 'Verifique nível de óleo, líquido de arrefecimento e estado das correias do gerador.',
          icon: '🔍'
        },
        {
          id: 'a2-3',
          title: 'Conectar cabos de aterramento',
          description: 'Instale a haste de aterramento a no mínimo 1m de profundidade. Conecte o cabo de cobre ao barramento de terra.',
          warning: 'O aterramento é OBRIGATÓRIO para operação segura do tomógrafo.',
          icon: '⏚'
        },
        {
          id: 'a2-4',
          title: 'Ligar o gerador',
          description: 'Gire a chave para posição ON. Aguarde o pré-aquecimento (30 segundos). Pressione START.',
          icon: '🔑'
        },
        {
          id: 'a2-5',
          title: 'Verificar tensão e frequência',
          description: 'No painel do gerador, confirme: Tensão 220V (±10%), Frequência 60Hz (±0.5Hz).',
          icon: '📊'
        },
        {
          id: 'a2-6',
          title: 'Ativar painel de controle principal',
          description: 'Ligue a chave geral no QDG (Quadro de Distribuição Geral). Verifique se todos os disjuntores estão na posição correta.',
          icon: '🎛️'
        },
        {
          id: 'a2-7',
          title: 'Ligar o sistema de climatização',
          description: 'Ative o ar-condicionado e ajuste para 22°C. Aguarde estabilização (15 min) antes de ligar o tomógrafo.',
          warning: 'O tomógrafo requer temperatura entre 18°C e 24°C para operar.',
          icon: '❄️'
        },
        {
          id: 'a2-8',
          title: 'Ativar o tomógrafo',
          description: 'No console do tomógrafo, siga a sequência de boot: Chave → Power → System Check. Aguarde o auto-teste (aprox. 5 min).',
          icon: '🖥️'
        }
      ]
    },
    shutdown: {
      title: 'Desligamento — Elétrica',
      steps: [
        {
          id: 'd2-1',
          title: 'Desligar o tomógrafo',
          description: 'No console, execute o shutdown seguro: Menu → Sistema → Desligar. Aguarde desligamento completo.',
          warning: 'NUNCA desligue o tomógrafo pelo disjuntor. Sempre use o shutdown do sistema.',
          icon: '🖥️'
        },
        {
          id: 'd2-2',
          title: 'Desligar climatização',
          description: 'Desligue o ar-condicionado após 10 minutos do shutdown do tomógrafo.',
          icon: '❄️'
        },
        {
          id: 'd2-3',
          title: 'Desativar painel de controle',
          description: 'Desligue todos os disjuntores do QDG em ordem reversa. Desligue a chave geral.',
          icon: '🎛️'
        },
        {
          id: 'd2-4',
          title: 'Desligar o gerador',
          description: 'Deixe o gerador em marcha lenta por 5 minutos antes de desligar. Gire a chave para OFF.',
          icon: '🔑'
        },
        {
          id: 'd2-5',
          title: 'Desconectar aterramento',
          description: 'Desconecte o cabo de aterramento e recolha a haste. Armazene no compartimento apropriado.',
          icon: '⏚'
        }
      ]
    }
  },
  {
    id: 'hidraulica',
    number: 3,
    title: 'Hidráulica',
    icon: '💧',
    color: '#30D158',
    description: 'Sistema de nivelamento, estabilizadores hidráulicos e macaco de apoio.',
    activation: {
      title: 'Ativação — Hidráulica',
      steps: [
        {
          id: 'a3-1',
          title: 'Verificar nível do fluido hidráulico',
          description: 'Confira o reservatório de fluido hidráulico. O nível deve estar entre as marcas MIN e MAX.',
          warning: 'Use apenas fluido hidráulico ISO VG 46. Outros fluidos podem danificar o sistema.',
          icon: '🛢️'
        },
        {
          id: 'a3-2',
          title: 'Inspecionar mangueiras',
          description: 'Verifique visualmente todas as mangueiras hidráulicas. Procure por rachaduras, vazamentos ou desgaste.',
          icon: '🔍'
        },
        {
          id: 'a3-3',
          title: 'Acionar bomba hidráulica',
          description: 'Ligue a bomba hidráulica no painel de controle lateral. Aguarde pressurização (pressão de trabalho: 200 bar).',
          icon: '⚙️'
        },
        {
          id: 'a3-4',
          title: 'Baixar estabilizadores dianteiros',
          description: 'Use o controle remoto para baixar os dois estabilizadores dianteiros. Pare quando tocarem o solo firmemente.',
          icon: '🔽'
        },
        {
          id: 'a3-5',
          title: 'Baixar estabilizadores traseiros',
          description: 'Repita o procedimento para os estabilizadores traseiros. Certifique-se de contato firme com o solo.',
          icon: '🔽'
        },
        {
          id: 'a3-6',
          title: 'Nivelar a carreta',
          description: 'Use o nível digital no painel para ajustar a carreta. Tolerância máxima: 0.5° em ambos os eixos.',
          warning: 'O tomógrafo NÃO pode operar se a carreta estiver fora de nível.',
          icon: '📐'
        },
        {
          id: 'a3-7',
          title: 'Travar sistema hidráulico',
          description: 'Feche as válvulas de bloqueio dos estabilizadores. Isso impede movimentação acidental.',
          icon: '🔒'
        }
      ]
    },
    shutdown: {
      title: 'Desligamento — Hidráulica',
      steps: [
        {
          id: 'd3-1',
          title: 'Destravar válvulas de bloqueio',
          description: 'Abra as válvulas de bloqueio de todos os estabilizadores.',
          icon: '🔓'
        },
        {
          id: 'd3-2',
          title: 'Recolher estabilizadores traseiros',
          description: 'Use o controle remoto para recolher os estabilizadores traseiros completamente.',
          icon: '🔼'
        },
        {
          id: 'd3-3',
          title: 'Recolher estabilizadores dianteiros',
          description: 'Recolha os estabilizadores dianteiros completamente até a posição de transporte.',
          icon: '🔼'
        },
        {
          id: 'd3-4',
          title: 'Desligar bomba hidráulica',
          description: 'Desligue a bomba hidráulica no painel lateral. Aguarde despressurização completa.',
          icon: '⚙️'
        },
        {
          id: 'd3-5',
          title: 'Verificação final',
          description: 'Confirme que todos os estabilizadores estão recolhidos e travados na posição de transporte.',
          warning: 'Mover a carreta com estabilizadores baixados causa danos graves ao sistema.',
          icon: '✅'
        }
      ]
    }
  }
];
