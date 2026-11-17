import { ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/validation';

export function HeroSection() {
  const whatsappHref = buildWhatsAppUrl(
    'Olá, equipe da lh7 agência! Gostaria de saber mais sobre criação de sites e SEO local.'
  );

  const pillars = [
    {
      index: '01.',
      title: 'Sites de Alta Conversão',
      detail: 'Estrutura clara para transformar visitas em pedidos no WhatsApp.',
    },
    {
      index: '02.',
      title: 'SEO Local Estratégico',
      detail: 'Posicionamento técnico para quem busca seu serviço na sua região.',
    },
    {
      index: '03.',
      title: 'Design Mobile-First',
      detail: 'Navegação rápida e legível em celulares, tablets e computadores.',
    },
    {
      index: '04.',
      title: 'Atendimento Direto',
      detail: 'Acompanhamento transparente do planejamento à publicação final.',
    },
  ];

  return (
    <section id="inicio" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Core Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-semibold tracking-wide text-[#046A38] mb-3">
              lh7 agência · Sua empresa, nossos cuidados
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-slate-900 leading-[1.08] mb-6">
              Sites profissionais e SEO local para atrair clientes todos os dias.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
              Desenvolvemos páginas rápidas, sob medida para o seu negócio e estruturadas para conquistar as primeiras posições nas buscas locais, transformando acessos em contatos reais.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#agendamento"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
              >
                Agendar Diagnóstico Gratuito
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#046A38] border border-slate-200 bg-slate-50 rounded-lg hover:bg-emerald-50/60 hover:border-[#046A38]/40 transition-colors whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Dominant 16:9 Visual Asset */}
          <div className="lg:col-span-6">
            <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-[#0B3D91] to-[#046A38]">
              <img
                src="/src/assets/images/hero_agency_studio_clean_1794938784354.jpg"
                alt="Equipe da lh7 agência analisando arquitetura de sites e estratégia de SEO local em estúdio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Pillar Strip Below Hero Split */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.index} className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono-tabular text-xs font-semibold text-[#046A38]">
                  {pillar.index}
                </span>
                <h2 className="font-display text-base font-semibold text-slate-900">
                  {pillar.title}
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {pillar.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
