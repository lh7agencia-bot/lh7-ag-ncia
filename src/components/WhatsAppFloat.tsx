import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/validation';

export function WhatsAppFloat() {
  const href = buildWhatsAppUrl(
    'Olá, equipe da lh7 agência! Vim pelo site e gostaria de conversar.'
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com lh7 agência pelo WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#046A38] text-white text-sm font-semibold shadow-lg hover:bg-[#03502A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#046A38]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
