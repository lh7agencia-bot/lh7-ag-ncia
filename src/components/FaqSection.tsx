import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DEFAULT_FAQS } from '../data/defaultFaqs';
import { FaqRecord, fetchPublishedFaqs } from '../lib/firestoreService';

export function FaqSection() {
  const [faqs, setFaqs] = useState<Array<{ id: string; question: string; answer: string }>>(
    DEFAULT_FAQS
  );
  const [openId, setOpenId] = useState<string | null>(DEFAULT_FAQS[0]?.id ?? null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const remoteFaqs: FaqRecord[] = await fetchPublishedFaqs();
        if (active && remoteFaqs.length > 0) {
          setFaqs(
            remoteFaqs.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
            }))
          );
          setOpenId(remoteFaqs[0].id);
        }
      } catch {
        // Keep default agency FAQs if database has not been seeded yet
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="faq" className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <p className="text-sm font-semibold text-[#046A38] mb-2">
            Dúvidas frequentes
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Perguntas comuns sobre criação de sites e SEO local
          </h2>
          <p className="text-base text-slate-600">
            Respostas diretas sobre prazos, tecnologia, posicionamento nas buscas e suporte da lh7 agência.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left hover:text-[#0B3D91] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-slate-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#0B3D91]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-5 pr-8 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
