import { ArrowUpRight, Check } from 'lucide-react';

export function ServicesSection() {
  const deliverables = [
    {
      step: '01',
      title: 'Diagnóstico e Arquitetura de Conteúdo',
      description:
        'Mapeamos o que o seu cliente pesquisa antes de comprar e organizamos cada seção para responder objeções e conduzir ao contato.',
    },
    {
      step: '02',
      title: 'Criação Visual Exclusiva e Responsiva',
      description:
        'Layout construído sob medida para sua marca, com leitura confortável em smartphones e foco na velocidade de carregamento.',
    },
    {
      step: '03',
      title: 'SEO Local e Estrutura Técnica para Buscadores',
      description:
        'Configuração de títulos, meta descrições, marcação Schema.org, URLs semânticas e otimização para buscas na sua cidade e região.',
    },
    {
      step: '04',
      title: 'Integração com WhatsApp e Painel Gerenciável',
      description:
        'Formulários conectados ao seu atendimento, agendamento online e autonomia para atualizar depoimentos e perguntas frequentes.',
    },
  ];

  return (
    <section id="servicos" className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-[#046A38] mb-2">
            Soluções especializadas
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Estrutura digital completa para destacar sua empresa nas buscas locais
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Unimos design focado em conversão e engenharia de SEO local para que clientes encontrem sua empresa no momento exato em que precisam do seu serviço.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14">
          {/* Card 1: Creation of Websites (7 cols) */}
          <article className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
              <img
                src="/src/assets/images/service_web_design_clean_1794938738445.jpg"
                alt="Projeto de criação de site responsivo em laptop e tablet desenvolvido pela lh7 agência"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="font-mono-tabular text-xs font-medium text-[#046A38] mb-2">
                  01 · Criação de Sites Profissionais
                </p>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                  Páginas pensadas para gerar confiança e pedidos de orçamento
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  Desenvolvemos landing pages e sites institucionais sob medida, sem modelos engessados. Cada bloco é projetado para apresentar seus diferenciais com clareza e facilitar o contato imediato pelo WhatsApp ou agendamento online.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-700 pt-4 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#046A38] shrink-0" />
                  <span>Layout mobile-first de carregamento rápido</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#046A38] shrink-0" />
                  <span>Copywriting claro orientado à conversão</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#046A38] shrink-0" />
                  <span>Botões estratégicos para WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#046A38] shrink-0" />
                  <span>Segurança SSL e código limpo</span>
                </li>
              </ul>
            </div>
          </article>

          {/* Card 2: Local SEO (5 cols) */}
          <article className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
              <img
                src="/src/assets/images/service_local_seo_1794938724448.jpg"
                alt="Painel de métricas de visibilidade e posicionamento em SEO local"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="font-mono-tabular text-xs font-medium text-[#046A38] mb-2">
                  02 · SEO Local e Autoridade Regional
                </p>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                  Visibilidade real quando pesquisam pelo seu serviço
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  Estruturamos dados locais, palavras-chave regionais e arquitetura técnica para posicionar sua empresa nas buscas orgânicas da sua área de atuação, reduzindo a dependência exclusiva de anúncios pagos.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Indexação técnica · Dados estruturados
                </span>
                <a
                  href="#agendamento"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B3D91] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  Solicitar análise
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>

          {/* Card 3: Full-width Consultation & Strategy Strip (12 cols) */}
          <article className="lg:col-span-12 bg-[#0B3D91] text-white rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
              <p className="font-mono-tabular text-xs font-medium text-emerald-300 mb-2">
                03 · Acompanhamento Próximo · Sua empresa, nossos cuidados
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
                Da primeira conversa à publicação, cuidamos de cada detalhe técnico
              </h3>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl mb-6">
                Você não precisa lidar com termos técnicos complexos ou configurações demoradas. Conduzimos o briefing, criamos o design, estruturamos o SEO local e entregamos tudo pronto para captar clientes.
              </p>
              <div>
                <a
                  href="#agendamento"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-[#0B3D91] bg-white rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                >
                  Agendar conversa estratégica
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 min-h-[240px] bg-[#072963]">
              <img
                src="/src/assets/images/consultation_strategy_1794938724570.jpg"
                alt="Reunião estratégica de planejamento digital na lh7 agência"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </article>
        </div>

        {/* Clean Numbered Process Strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-8">
            Como conduzimos seu projeto na lh7 agência
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {deliverables.map((item) => (
              <div key={item.step} className="space-y-2">
                <span className="font-mono-tabular text-sm font-semibold text-[#046A38]">
                  Etapa {item.step}
                </span>
                <h4 className="font-display text-lg font-semibold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
