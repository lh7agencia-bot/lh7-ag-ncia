import { Lock } from 'lucide-react';
import { buildWhatsAppUrl, BUSINESS_PHONE_DISPLAY } from '../utils/validation';

interface FooterProps {
  onOpenAdmin: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#072963] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/15">
          <div className="md:col-span-5 space-y-2">
            <p className="font-display text-xl font-bold tracking-tight text-white">
              lh7 agência
            </p>
            <p className="text-sm text-emerald-300 font-medium">
              Sua empresa, nossos cuidados
            </p>
            <p className="text-sm text-blue-100 max-w-sm leading-relaxed pt-1">
              Criação de sites profissionais e estratégias de SEO local para posicionar negócios nas buscas e gerar oportunidades reais.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <p className="text-xs font-semibold text-blue-200 mb-3">
              Navegação
            </p>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  Portfólio
                </a>
              </li>
              <li>
                <a href="#agendamento" className="hover:text-white transition-colors">
                  Agendamento Online
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-semibold text-blue-200">
              Atendimento
            </p>
            <a
              href={buildWhatsAppUrl('Olá lh7 agência! Gostaria de falar com a equipe.')}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-mono-tabular text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
            >
              WhatsApp: {BUSINESS_PHONE_DISPLAY}
            </a>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-200 hover:text-white transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                Painel Administrativo
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <p>© {new Date().getFullYear()} lh7 agência. Todos os direitos reservados.</p>
          <p>Criação de Sites &amp; SEO Local</p>
        </div>
      </div>
    </footer>
  );
}
