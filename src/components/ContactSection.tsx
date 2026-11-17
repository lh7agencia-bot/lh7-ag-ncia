import { FormEvent, useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { submitContactMessage } from '../lib/firestoreService';
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  BUSINESS_PHONE_DISPLAY,
  validateContactMessageInput,
} from '../utils/validation';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentData, setSentData] = useState<{
    name: string;
    email: string;
    message: string;
    channel: 'whatsapp' | 'email';
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateContactMessageInput({
      name,
      email,
      phone,
      message,
      channel,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name,
        email,
        phone,
        message,
        channel,
      });
      setSentData({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        channel,
      });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setSubmitError(
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'Não foi possível enviar sua mensagem agora. Tente pelo WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Contact Details Column (No invented address, no map) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-semibold text-[#046A38] mb-2">
                Contato direto
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Pronto para colocar sua empresa em destaque?
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Envie sua mensagem pelo formulário ou inicie uma conversa imediata no WhatsApp. Respondemos com clareza e foco no que traz retorno para o seu negócio.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  Agência
                </p>
                <p className="font-display text-lg font-bold text-[#0B3D91]">
                  lh7 agência
                </p>
                <p className="text-sm text-slate-600">
                  Sua empresa, nossos cuidados
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <a
                  href={buildWhatsAppUrl('Olá lh7 agência! Gostaria de solicitar um orçamento.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-slate-800 hover:text-[#046A38] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#046A38] shrink-0" />
                  <span className="font-mono-tabular">{BUSINESS_PHONE_DISPLAY}</span>
                  <span className="text-xs font-normal text-slate-500">
                    (Telefone / WhatsApp)
                  </span>
                </a>
                <p className="text-xs text-slate-500">
                  Atendimento digital para criação de sites e SEO local.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            {sentData ? (
              <div className="space-y-5" role="status">
                <div className="flex items-center gap-3 text-[#046A38]">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Mensagem enviada para a lh7 agência
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Recebemos seu contato, <strong className="text-slate-900">{sentData.name}</strong>. Se quiser agilizar ainda mais o atendimento, você também pode abrir sua mensagem diretamente no canal escolhido abaixo:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={buildWhatsAppUrl(
                      `Olá lh7 agência! Meu nome é ${sentData.name} (${sentData.email}). Mensagem: ${sentData.message}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Abrir no WhatsApp
                  </a>
                  <a
                    href={buildMailtoUrl(
                      `Contato pelo site - ${sentData.name}`,
                      `Nome: ${sentData.name}\nE-mail: ${sentData.email}\n\nMensagem:\n${sentData.message}`
                    )}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0B3D91] border border-slate-200 rounded-lg hover:border-[#0B3D91] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Enviar também por e-mail
                  </a>
                  <button
                    type="button"
                    onClick={() => setSentData(null)}
                    className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Enviar nova mensagem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Nome
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:bg-white"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-700">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      E-mail
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@suaempresa.com.br"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:bg-white"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-700">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Telefone / WhatsApp (opcional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(62) 99999-9999"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:bg-white"
                    />
                  </div>

                  <div>
                    <span className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Preferência de retorno
                    </span>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setChannel('whatsapp')}
                        aria-pressed={channel === 'whatsapp'}
                        className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                          channel === 'whatsapp'
                            ? 'bg-white text-[#046A38] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setChannel('email')}
                        aria-pressed={channel === 'email'}
                        className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                          channel === 'email'
                            ? 'bg-white text-[#0B3D91] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        E-mail
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva o que sua empresa precisa em criação de site ou SEO local."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:bg-white"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-700">{errors.message}</p>
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
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] disabled:opacity-60 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Enviando mensagem...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
