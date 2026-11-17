export interface DefaultFaqSeed {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export const DEFAULT_FAQS: DefaultFaqSeed[] = [
  {
    id: 'faq-prazo-criacao-site',
    question: 'Qual é o prazo médio para criação de um site profissional?',
    answer:
      'Para landing pages e sites institucionais completos, o prazo varia de 10 a 20 dias úteis após o envio das informações do negócio. Todo o projeto passa por etapas claras de arquitetura, design exclusivo, revisão de conteúdo e configuração técnica de SEO.',
    order: 1,
    published: true,
  },
  {
    id: 'faq-como-funciona-seo-local',
    question: 'Como funciona o SEO Local e por que ele traz clientes mais rápido?',
    answer:
      'O SEO Local estrutura seu site e sua presença nas buscas regionais para que sua empresa apareça quando clientes da sua cidade pesquisam exatamente pelo serviço que você oferece. Trabalhamos palavras-chave locais, dados estruturados, velocidade mobile e otimização de conversão para transformar buscas em contatos no WhatsApp.',
    order: 2,
    published: true,
  },
  {
    id: 'faq-site-responsivo-velocidade',
    question: 'O site já vem adaptado para celulares e otimizado para o Google?',
    answer:
      'Sim. Todos os sites desenvolvidos pela lh7 agência seguem abordagem mobile-first, com carregamento rápido, código semântico, meta tags configuradas, HTTPS e integração direta com WhatsApp e formulários de captação.',
    order: 3,
    published: true,
  },
  {
    id: 'faq-atualizacoes-suporte',
    question: 'Preciso saber programar para atualizar textos ou gerenciar contatos?',
    answer:
      'Não. Entregamos o projeto pronto para uso e com autonomia para você acompanhar agendamentos, mensagens, depoimentos e perguntas frequentes diretamente pelo navegador, além de contar com suporte próximo pelo WhatsApp.',
    order: 4,
    published: true,
  },
  {
    id: 'faq-dominio-hospedagem',
    question: 'Vocês orientam na escolha do domínio e publicação do site?',
    answer:
      'Sim. Acompanhamos todo o processo desde o registro do domínio (.com.br ou .com), apontamento de DNS, certificado SSL e publicação final, garantindo que sua empresa esteja no ar com estabilidade e segurança.',
    order: 5,
    published: true,
  },
];
