import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

type BlogCategory = 'todos' | 'SEO Local' | 'Criação de Sites' | 'Marketing Digital';

interface BlogPost {
  id: string;
  title: string;
  category: Exclude<BlogCategory, 'todos'>;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  keyTakeaways: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'seo-local-pequenas-empresas',
    title: 'Como o SEO Local coloca pequenas empresas na frente dos concorrentes nas buscas',
    category: 'SEO Local',
    publishedAt: '14 de novembro de 2026',
    readTime: '5 min de leitura',
    excerpt:
      'Entenda por que estruturar páginas regionais, títulos semânticos e dados locais gera contatos diários de clientes que já estão procurando pelo seu serviço.',
    image: '/src/assets/images/blog_seo_local_guide_1794939059978.jpg',
    imageAlt:
      'Tablet exibindo evolução de posicionamento em buscas regionais sobre mesa de madeira clara',
    paragraphs: [
      'Quando um cliente precisa de um serviço próximo, a primeira atitude quase sempre acontece no celular: pesquisar pelo nome da solução seguido da cidade ou do bairro. Empresas que possuem apenas redes sociais acabam ficando invisíveis para quem tem urgência e busca diretamente nos motores de pesquisa.',
      'O SEO Local resolve exatamente essa lacuna. Ele combina arquitetura de conteúdo clara no site com sinais técnicos que ajudam os buscadores a compreenderem o que sua empresa faz, onde atende e por que ela é uma referência confiável na região.',
      'Na prática, isso começa com páginas rápidas no celular, títulos H1 e H2 objetivos contendo o serviço principal, descrições que estimulam o clique e marcação estruturada Schema.org. Quando cada elemento trabalha junto, o tráfego orgânico cresce de forma previsível mês após mês.',
    ],
    keyTakeaways: [
      'Estruture uma seção ou página clara para cada serviço principal que sua empresa oferece.',
      'Garanta carregamento rápido em redes móveis, pois a maioria das buscas locais vem do celular.',
      'Facilite o próximo passo com botões diretos para agendamento e WhatsApp visíveis na dobra inicial.',
    ],
  },
  {
    id: 'elementos-site-alta-conversao',
    title: '7 elementos essenciais em um site profissional para gerar contatos pelo WhatsApp',
    category: 'Criação de Sites',
    publishedAt: '08 de novembro de 2026',
    readTime: '4 min de leitura',
    excerpt:
      'Um site bonito não basta se o visitante não entende o que você faz em cinco segundos. Veja a estrutura usada pela lh7 agência para aumentar conversões.',
    image: '/src/assets/images/blog_site_conversao_1794939061297.jpg',
    imageAlt:
      'Designer analisando wireframe mobile-first e estrutura de grid em notebook',
    paragraphs: [
      'Muitas empresas investem em páginas cheias de efeitos visuais pesados que demoram para abrir e escondem a informação principal. O resultado é um visitante impaciente que fecha a aba antes mesmo de conhecer a oferta.',
      'Um site orientado à conversão precisa responder três perguntas logo na primeira tela: o que sua empresa resolve, para quem o serviço é indicado e qual botão o cliente deve clicar para falar com você agora.',
      'Além disso, provas reais como depoimentos moderados, portfólio com contexto de entrega, perguntas frequentes (FAQ) que quebram objeções e formulário simples de agendamento transformam curiosos em oportunidades comerciais reais.',
    ],
    keyTakeaways: [
      'Headline objetiva logo no topo explicando benefício e nicho de atuação.',
      'Chamada para ação única e contrastante conduzindo ao agendamento ou WhatsApp.',
      'FAQ claro para eliminar dúvidas sobre prazo, funcionamento e atendimento antes do contato.',
    ],
  },
  {
    id: 'marketing-digital-enxuto-pequenas-empresas',
    title: 'Marketing digital para pequenas empresas: como construir presença sólida sem desperdício',
    category: 'Marketing Digital',
    publishedAt: '02 de novembro de 2026',
    readTime: '6 min de leitura',
    excerpt:
      'Antes de investir verba alta em anúncios, pequenas empresas precisam de uma base própria que converta visitas em reuniões e vendas.',
    image: '/src/assets/images/blog_marketing_pequenas_empresas_1794939061709.jpg',
    imageAlt:
      'Empreendedora analisando indicadores de marketing digital local em notebook no escritório',
    paragraphs: [
      'Um erro comum de pequenos negócios é direcionar tráfego pago direto para perfis desorganizados ou links genéricos, pagando caro por cliques que não viram orçamentos. Sem uma casa digital estruturada, o custo por cliente sobe rapidamente.',
      'Ao construir um site próprio com SEO local bem configurado, sua empresa passa a ser dona do próprio canal de aquisição. Mesmo quando você decide impulsionar campanhas, a página de destino recebe os visitantes com clareza e multiplica o retorno de cada clique.',
      'Com acompanhamento próximo e atualização contínua de depoimentos e conteúdos úteis, o marketing digital deixa de ser um custo imprevisível e se torna um ativo permanente da sua empresa.',
    ],
    keyTakeaways: [
      'Construa sua base própria (site rápido + SEO local) antes de escalar anúncios.',
      'Acompanhe quais perguntas seus clientes mais fazem e transforme-as em conteúdo no blog e no FAQ.',
      'Mantenha o atendimento ágil integrando formulários do site diretamente ao WhatsApp.',
    ],
  },
];

const CATEGORIES: BlogCategory[] = [
  'todos',
  'SEO Local',
  'Criação de Sites',
  'Marketing Digital',
];

export function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('todos');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const visiblePosts = useMemo(() => {
    if (selectedCategory === 'todos') return BLOG_POSTS;
    return BLOG_POSTS.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="blog" className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#046A38] mb-2">
              Blog &amp; Conteúdo Estratégico
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Dicas práticas de sites, SEO local e crescimento digital
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Artigos diretos ao ponto para ajudar pequenas e médias empresas a atraírem mais clientes pela internet.
            </p>
          </div>

          {!activePost && (
            <div
              role="group"
              aria-label="Filtrar artigos do blog"
              className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit shrink-0"
            >
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white text-[#0B3D91] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {category === 'todos' ? 'Todos os Artigos' : category}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {activePost ? (
          /* Individual Article Reader View */
          <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B3D91] hover:text-[#046A38] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para todos os artigos
              </button>
              <div className="text-xs text-slate-500 font-medium">
                <span className="text-[#046A38] font-semibold">{activePost.category}</span>
                <span aria-hidden="true"> · </span>
                <span>{activePost.publishedAt}</span>
                <span aria-hidden="true"> · </span>
                <span>{activePost.readTime}</span>
              </div>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
              <img
                src={activePost.image}
                alt={activePost.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {activePost.title}
              </h3>

              <div className="space-y-4 text-base text-slate-700 leading-relaxed">
                {activePost.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
                <h4 className="font-display text-base font-bold text-[#0B3D91]">
                  Pontos práticos para aplicar na sua empresa
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                  {activePost.keyTakeaways.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-600">
                  Quer aplicar essas estratégias no site do seu negócio?
                </p>
                <a
                  href="#agendamento"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A] transition-colors"
                >
                  Agendar diagnóstico com a lh7 agência
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </article>
        ) : (
          /* Blog Post Listing Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#0B3D91] to-[#046A38] border-b border-slate-200">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#046A38]">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.publishedAt}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{post.readTime}</span>
                  <button
                    type="button"
                    onClick={() => setActivePost(post)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B3D91] hover:text-[#046A38] transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    Ler artigo
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
