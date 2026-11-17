import { FormEvent, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import {
  AVAILABLE_TIME_SLOTS,
  buildWhatsAppUrl,
  getAvailableDateOptions,
  validateAppointmentInput,
} from '../utils/validation';
import { createPublicAppointment } from '../lib/firestoreService';

const SERVICE_OPTIONS = [
  'Criação de Site Profissional',
  'SEO Local e Posicionamento',
  'Site Completo + SEO Local',
  'Reestruturação de Site Existente',
];

export function BookingSection() {
  const dateOptions = useMemo(() => getAvailableDateOptions(new Date(), 8), []);
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [serviceInterest, setServiceInterest] = useState(SERVICE_OPTIONS[2]);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.value ?? '');
  const [selectedTime, setSelectedTime] = useState<string>(AVAILABLE_TIME_SLOTS[1]);
  const [notes, setNotes] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    clientName: string;
    date: string;
    time: string;
    serviceInterest: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateAppointmentInput({
      clientName,
      contact,
      serviceInterest,
      date: selectedDate,
      time: selectedTime,
      notes,
    });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const id = await createPublicAppointment({
        clientName,
        contact,
        serviceInterest,
        date: selectedDate,
        time: selectedTime,
        notes,
      });
      setConfirmedBooking({
        id,
        clientName: clientName.trim(),
        date: selectedDate,
        time: selectedTime,
        serviceInterest,
      });
      setClientName('');
      setContact('');
      setNotes('');
    } catch (err) {
      setSubmitError(
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'Não foi possível concluir o agendamento agora. Tente novamente ou chame no WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="agendamento" className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Explanatory Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-sm font-semibold text-[#046A38] mb-2">
                Agendamento online
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Reserve um horário para avaliarmos o seu projeto
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Escolha o melhor dia e horário para conversar diretamente com a equipe da lh7 agência. Analisamos sua presença atual e indicamos o caminho mais eficiente em criação de site e SEO local.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#0B3D91] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Diagnóstico objetivo e sem compromisso
                  </h3>
                  <p className="text-sm text-slate-600">
                    Reunião focada em entender seus objetivos comerciais, público da região e prazos.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#046A38] mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Horários flexíveis de segunda a sábado
                  </h3>
                  <p className="text-sm text-slate-600">
                    Atendimento online prático, direto ao ponto, com confirmação rápida pelo WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Booking Form */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
            {confirmedBooking ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5" role="status">
                <div className="flex items-center gap-3 text-[#046A38]">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Agendamento recebido com sucesso
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Obrigado, <strong className="text-slate-900">{confirmedBooking.clientName}</strong>. Seu pedido para{' '}
                  <strong className="text-slate-900">{confirmedBooking.serviceInterest}</strong> em{' '}
                  <span className="font-mono-tabular font-semibold text-[#0B3D91]">
                    {confirmedBooking.date}
                  </span>{' '}
                  às{' '}
                  <span className="font-mono-tabular font-semibold text-[#0B3D91]">
                    {confirmedBooking.time}
                  </span>{' '}
                  foi registrado e está aguardando confirmação.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      `Olá lh7 agência! Acabei de agendar um horário para ${confirmedBooking.date} às ${confirmedBooking.time} (${confirmedBooking.serviceInterest}). Meu nome é ${confirmedBooking.clientName}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Confirmar pelo WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setConfirmedBooking(null)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Fazer novo agendamento
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="booking-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Seu nome completo
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex.: Mariana Souza"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15"
                    />
                    {fieldErrors.clientName && (
                      <p className="mt-1 text-xs text-red-700">{fieldErrors.clientName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-contact" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      WhatsApp ou E-mail
                    </label>
                    <input
                      id="booking-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="(62) 99999-9999"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15"
                    />
                    {fieldErrors.contact && (
                      <p className="mt-1 text-xs text-red-700">{fieldErrors.contact}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="booking-service" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    O que você busca para sua empresa?
                  </label>
                  <select
                    id="booking-service"
                    value={serviceInterest}
                    onChange={(e) => setServiceInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-sm font-semibold text-slate-800">
                      Escolha a data
                    </span>
                    <label className="text-xs text-slate-600 flex items-center gap-2">
                      <span>Outra data:</span>
                      <input
                        aria-label="Selecionar outra data"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-2 py-1 text-xs font-mono-tabular bg-white border border-slate-300 rounded text-slate-800"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {dateOptions.map((d) => {
                      const active = selectedDate === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setSelectedDate(d.value)}
                          aria-pressed={active}
                          className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                            active
                              ? 'bg-[#0B3D91] text-white border-[#0B3D91]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-[#0B3D91]/50'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.date && (
                    <p className="mt-1 text-xs text-red-700">{fieldErrors.date}</p>
                  )}
                </div>

                {/* Time Slot Selection */}
                <div>
                  <span className="block text-sm font-semibold text-slate-800 mb-2">
                    Escolha o horário
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {AVAILABLE_TIME_SLOTS.map((slot) => {
                      const active = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          aria-pressed={active}
                          className={`py-2.5 px-3 text-sm font-mono-tabular font-medium rounded-lg border transition-colors ${
                            active
                              ? 'bg-[#046A38] text-white border-[#046A38]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-[#046A38]/50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErrors.time && (
                    <p className="mt-1 text-xs text-red-700">{fieldErrors.time}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Detalhes sobre o negócio (opcional)
                  </label>
                  <textarea
                    id="booking-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Conte brevemente seu segmento ou se já possui um site no ar."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3D91] focus:ring-2 focus:ring-[#0B3D91]/15"
                  />
                  {fieldErrors.notes && (
                    <p className="mt-1 text-xs text-red-700">{fieldErrors.notes}</p>
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
                  className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? 'Registrando agendamento...' : 'Confirmar Agendamento'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
