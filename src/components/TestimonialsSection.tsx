import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, MessageSquarePlus, Star } from 'lucide-react';
import {
  fetchApprovedTestimonials,
  submitPublicTestimonial,
  TestimonialRecord,
} from '../lib/firestoreService';
import { validateTestimonialInput } from '../utils/validation';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [segment, setSegment] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await fetchApprovedTestimonials();
        if (active) {
          setTestimonials(items);
        }
      } catch {
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const validation = validateTestimonialInput({
      clientName,
      segment,
      text,
      rating,
    });
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      await submitPublicTestimonial({
        clientName,
        segment,
        text,
        rating,
      });
      setSubmittedSuccess(true);
      setClientName('');
      setSegment('');
      setText('');
      setRating(5);
    } catch (err) {
      setSubmitError(
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'Não foi possível enviar seu depoimento no momento.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="depoimentos" className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#046A38] mb-2">
              Experiências reais
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Depoimentos de quem confia na lh7 agência
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Avaliações publicadas somente após verificação pela nossa equipe. Se você já trabalha conosco, compartilhe sua experiência.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm((prev) => !prev);
              setSubmittedSuccess(false);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0B3D91] bg-white border border-slate-200 rounded-lg hover:border-[#0B3D91] transition-colors whitespace-nowrap shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            {showForm ? 'Fechar formulário' : 'Enviar depoimento'}
          </button>
        </div>

        {/* Public Testimonial Submission Drawer */}
        {showForm && (
          <div className="mb-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-2xl">
            {submittedSuccess ? (
              <div className="space-y-3" role="status">
                <div className="flex items-center gap-2 text-[#046A38]">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Depoimento enviado para moderação
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  Obrigado por avaliar a lh7 agência! Assim que for aprovado no painel administrativo, seu depoimento ficará visível nesta página.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Compartilhe sua avaliação
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="testimonial-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Seu nome
                    </label>
                    <input
                      id="testimonial-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex.: Fernanda Alves"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B3D91]"
                    />
                    {formErrors.clientName && (
                      <p className="mt-1 text-xs text-red-700">{formErrors.clientName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="testimonial-segment" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Segmento de atuação (opcional)
                    </label>
                    <input
                      id="testimonial-segment"
                      type="text"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      placeholder="Ex.: Clínica, Escritório, Comércio"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B3D91]"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-slate-800 mb-2">
                    Sua nota
                  </span>
                  <div className="flex items-center gap-1.5" role="group" aria-label="Nota de 1 a 5 estrelas">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`${value} ${value === 1 ? 'estrela' : 'estrelas'}`}
                        aria-pressed={rating >= value}
                        className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            value <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-mono-tabular text-slate-600">
                      {rating}/5
                    </span>
                  </div>
                  {formErrors.rating && (
                    <p className="mt-1 text-xs text-red-700">{formErrors.rating}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="testimonial-text" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Seu depoimento
                  </label>
                  <textarea
                    id="testimonial-text"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Conte como foi o atendimento e os resultados obtidos com o seu site ou SEO local."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B3D91]"
                  />
                  {formErrors.text && (
                    <p className="mt-1 text-xs text-red-700">{formErrors.text}</p>
                  )}
                </div>

                {submitError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800" role="alert">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar para aprovação'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 h-48 animate-pulse"
              >
                <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
                <div className="h-3 w-full bg-slate-100 rounded mb-2" />
                <div className="h-3 w-5/6 bg-slate-100 rounded mb-6" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-sm text-slate-600">
              Não foi possível carregar os depoimentos no momento.
            </p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
            <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
              Ainda não há depoimentos publicados
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              Os depoimentos enviados por clientes aparecem aqui assim que são aprovados pelo administrador da lh7 agência.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A] transition-colors"
            >
              Seja o primeiro a avaliar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="flex items-center gap-1 mb-4"
                    aria-label={`${item.rating} de 5 estrelas`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= item.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                    “{item.text}”
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-900">
                    {item.clientName}
                  </p>
                  {item.segment && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.segment}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
