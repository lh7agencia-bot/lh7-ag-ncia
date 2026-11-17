import { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';

type PortfolioCategory = 'todos' | 'site' | 'seo' | 'completo';

interface PortfolioProject {
  id: string;
  name: string;
  segment: string;
  category: Exclude<PortfolioCategory, 'todos'>;
  servicesLabel: string;
  summary: string;
  resultsSummary: string;
  metrics: Array<{ label: string; value: string }>;
  deliverables: string[];
  image: string;
  imageAlt: string;
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'clinica-saude-integrada',
    name: 'Portal Clínica & Saúde Integrada',
    segment: 'Projeto Modelo · Área da Saúde',
    category: 'completo',
    servicesLabel: 'Criação de Site · SEO Local · Agendamento',
    summary:
      'Desenvolvimento de site institucional responsivo com páginas individuais por especialidade, velocidade otimizada para smartphones e fluxo direto de marcação de consultas.',
    resultsSummary:
      'Estrutura pensada para ranquear termos locais de especialidades médicas e reduzir o atrito até o agendamento no WhatsApp.',
    metrics: [
      { label: 'Tráfego orgânico local (6 meses)', value: '+185%' },
      { label: 'Carregamento mobile (LCP)', value: '1,1s' },
      { label: 'Posição média em buscas da cidade', value: 'Top 3' },
    ],
    deliverables: [
      'Arquitetura de páginas otimizada por especialidade e bairro',
      'Schema.org MedicalClinic & FAQ estruturado para buscas locais',
      'Botões de agendamento integrados ao WhatsApp e formulário rápido',
    ],
    image: '/src/assets/images/portfolio_clinic_pt_1794939534798.jpg',
    imageAlt:
      'Mockup responsivo em notebook e celular de site para clínica desenvolvido pela lh7 agência',
  },
  {
    id: 'consultoria-juridica-corporativa',
    name: 'Plataforma Consultoria & Advocacia',
    segment: 'Projeto Modelo · Serviços Profissionais',
    category: 'site',
    servicesLabel: 'Criação de Site · Arquitetura de Autoridade',
    summary:
      'Criação de portal institucional sob medida com foco em credibilidade, leitura clara de áreas de atuação e captação qualificada para reuniões de diagnóstico.',
    resultsSummary:
      'Organização editorial que transmite confiança imediata e facilita a solicitação de contato direto por empresas e clientes finais.',
    metrics: [
      { label: 'Conversão de visitantes em leads', value: '+140%' },
      { label: 'Pontuação Core Web Vitals', value: '98/100' },
      { label: 'Redução na taxa de rejeição', value: '-42%' },
    ],
    deliverables: [
      'Identidade digital estruturada em Azul Marinho e Verde Esmeralda',
      'Páginas dedicadas para cada frente de atuação consultiva',
      'Formulário validado com direcionamento rápido para atendimento',
    ],
    image: '/src/assets/images/portfolio_legal_pt_1794939535557.jpg',
    imageAlt:
      'Mockup em monitor desktop e tablet de site institucional para consultoria jurídica',
  },
  {
    id: 'servicos-locais-atendimento',
    name: 'Landing Page Serviços Locais & Agenda',
    segment: 'Projeto Modelo · Comércio e Serviços',
    category: 'seo',
    servicesLabel: 'SEO Local · Landing Page de Conversão',
    summary:
      'Página de alta velocidade projetada para prestadores de serviços regionais aparecerem nas pesquisas com intenção de compra imediata na cidade.',
    resultsSummary:
      'Crescimento consistente de ligações e mensagens vindas diretamente das buscas orgânicas locais sem depender apenas de mídia paga.',
    metrics: [
      { label: 'Cliques orgânicos em 90 dias', value: '+210%' },
      { label: 'Solicitações via WhatsApp', value: '3,2x' },
      { label: 'Compatibilidade Mobile-First', value: '100%' },
    ],
    deliverables: [
      'Pesquisa de palavras-chave com intenção comercial regional',
      'Otimização técnica de títulos, meta descrições e URLs locais',
      'Bloco de agendamento online com escolha de data e horário',
    ],
    image: '/src/assets/images/portfolio_local_pt_1794939535538.jpg',
    imageAlt:
      'Mockup em laptop e smartphone mostrando landing page de serviços locais e curva de crescimento em SEO',
  },
];

const FILTERS: Array<{ id: PortfolioCategory; label: string }> = [
  { id: 'todos', label: 'Todos os Projetos' },
  { id: 'completo', label: 'Site + SEO Local' },
  { id: 'site', label: 'Criação de Sites' },
  { id: 'seo', label: 'SEO Local' },
];

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('todos');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const visibleProjects = useMemo(() => {
    if (activeFilter === 'todos') return PORTFOLIO_PROJECTS;
    return PORTFOLIO_PROJECTS.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section id="portfolio" className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#046A38] mb-2">
              Portfólio &amp; Projetos Modelo
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Arquitetura visual e SEO aplicados a resultados mensuráveis
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Conheça exemplos representativos de como estruturamos sites rápidos e estratégias de SEO local para diferentes segmentos gerarem mais contatos qualificados.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div
            role="group"
            aria-label="Filtrar projetos por serviço"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit shrink-0"
          >
            {FILTERS.map((filter) => {
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={active}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#0B3D91] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#0B3D91] to-[#046A38] border-b border-slate-200">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#046A38]">
                      {project.segment} · {project.servicesLabel}
                    </p>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {project.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="font-mono-tabular text-base sm:text-lg font-bold text-[#0B3D91]">
                          {metric.value}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500 truncate">
                  {project.resultsSummary}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3D91] hover:text-[#046A38] transition-colors whitespace-nowrap shrink-0"
                >
                  Ver detalhes
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200 relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Fechar detalhes do projeto"
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 text-slate-800 border border-slate-200 flex items-center justify-center hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold text-[#046A38] mb-1">
                  {selectedProject.segment} · {selectedProject.servicesLabel}
                </p>
                <h3
                  id="portfolio-modal-title"
                  className="font-display text-2xl font-bold text-slate-900"
                >
                  {selectedProject.name}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {selectedProject.summary} {selectedProject.resultsSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                {selectedProject.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="font-mono-tabular text-xl font-bold text-[#0B3D91]">
                      {metric.value}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Entregas aplicadas neste modelo de projeto
                </h4>
                <ul className="space-y-2">
                  {selectedProject.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#046A38] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <a
                  href="#agendamento"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] transition-colors"
                >
                  Quero um projeto nesse nível
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
