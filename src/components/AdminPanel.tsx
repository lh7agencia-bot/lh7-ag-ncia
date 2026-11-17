import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  ArrowLeft,
  Calendar,
  Check,
  Edit3,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { auth, googleAuthProvider } from '../lib/firebase';
import {
  adminCreateTestimonial,
  adminDeleteAppointment,
  adminDeleteFaq,
  adminDeleteMessage,
  adminDeleteTestimonial,
  adminFetchAppointments,
  adminFetchFaqs,
  adminFetchMessages,
  adminFetchTestimonials,
  adminSaveFaq,
  adminSeedDefaultFaqs,
  adminSetMessageRead,
  adminUpdateAppointmentStatus,
  adminUpdateTestimonialStatus,
  AppointmentRecord,
  AppointmentStatus,
  ContactMessageRecord,
  FaqRecord,
  TestimonialRecord,
  TestimonialStatus,
} from '../lib/firestoreService';
import { ADMIN_EMAIL, buildWhatsAppUrl } from '../utils/validation';

interface AdminPanelProps {
  onBackToSite: () => void;
}

type AdminTab = 'agendamentos' | 'depoimentos' | 'mensagens' | 'faq';

export function AdminPanel({ onBackToSite }: AdminPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('agendamentos');
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);

  const [apptFilter, setApptFilter] = useState<'todos' | AppointmentStatus>('todos');
  const [testFilter, setTestFilter] = useState<'todos' | TestimonialStatus>('todos');
  const [msgFilter, setMsgFilter] = useState<'todas' | 'nao_lidas' | 'lidas'>('todas');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New Testimonial modal/drawer state
  const [showNewTestimonial, setShowNewTestimonial] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestSegment, setNewTestSegment] = useState('');
  const [newTestText, setNewTestText] = useState('');
  const [newTestRating, setNewTestRating] = useState(5);

  // FAQ Editor state
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqOrder, setFaqOrder] = useState(1);
  const [faqPublished, setFaqPublished] = useState(true);
  const [faqFormError, setFaqFormError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const isAuthorizedAdmin = Boolean(
    user && user.email === ADMIN_EMAIL && user.emailVerified
  );

  const loadAllData = useCallback(async () => {
    if (!isAuthorizedAdmin) return;
    setLoadingData(true);
    setDataError(null);
    try {
      const [appts, tests, msgs, faqItems] = await Promise.all([
        adminFetchAppointments(),
        adminFetchTestimonials(),
        adminFetchMessages(),
        adminFetchFaqs(),
      ]);
      setAppointments(appts);
      setTestimonials(tests);
      setMessages(msgs);
      setFaqs(faqItems);
    } catch {
      setDataError(
        'Não foi possível carregar os dados do painel. Verifique sua conexão e permissões.'
      );
    } finally {
      setLoadingData(false);
    }
  }, [isAuthorizedAdmin]);

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadAllData();
    }
  }, [isAuthorizedAdmin, loadAllData]);

  const handleLogin = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Não foi possível autenticar com o Google.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const counts = useMemo(
    () => ({
      pendingAppointments: appointments.filter((a) => a.status === 'pendente').length,
      pendingTestimonials: testimonials.filter((t) => t.status === 'pendente').length,
      unreadMessages: messages.filter((m) => !m.read).length,
      publishedFaqs: faqs.filter((f) => f.published).length,
    }),
    [appointments, testimonials, messages, faqs]
  );

  const filteredAppointments = useMemo(
    () =>
      apptFilter === 'todos'
        ? appointments
        : appointments.filter((a) => a.status === apptFilter),
    [appointments, apptFilter]
  );

  const filteredTestimonials = useMemo(
    () =>
      testFilter === 'todos'
        ? testimonials
        : testimonials.filter((t) => t.status === testFilter),
    [testimonials, testFilter]
  );

  const filteredMessages = useMemo(() => {
    if (msgFilter === 'nao_lidas') return messages.filter((m) => !m.read);
    if (msgFilter === 'lidas') return messages.filter((m) => m.read);
    return messages;
  }, [messages, msgFilter]);

  const handleSaveNewTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateTestimonial(
        {
          clientName: newTestName,
          segment: newTestSegment,
          text: newTestText,
          rating: newTestRating,
        },
        'aprovado'
      );
      setNewTestName('');
      setNewTestSegment('');
      setNewTestText('');
      setNewTestRating(5);
      setShowNewTestimonial(false);
      await loadAllData();
    } catch (err) {
      setDataError(
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'Erro ao salvar depoimento.'
      );
    }
  };

  const openNewFaqForm = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqOrder(faqs.length + 1);
    setFaqPublished(true);
    setFaqFormError(null);
    setShowFaqForm(true);
  };

  const openEditFaqForm = (item: FaqRecord) => {
    setEditingFaqId(item.id);
    setFaqQuestion(item.question);
    setFaqAnswer(item.answer);
    setFaqOrder(item.order);
    setFaqPublished(item.published);
    setFaqFormError(null);
    setShowFaqForm(true);
  };

  const handleSaveFaq = async (e: FormEvent) => {
    e.preventDefault();
    setFaqFormError(null);
    try {
      await adminSaveFaq(
        {
          question: faqQuestion,
          answer: faqAnswer,
          order: faqOrder,
          published: faqPublished,
        },
        editingFaqId ?? undefined
      );
      setShowFaqForm(false);
      setEditingFaqId(null);
      await loadAllData();
    } catch (err) {
      setFaqFormError(
        err instanceof Error && !err.message.startsWith('{')
          ? err.message
          : 'Erro ao salvar pergunta do FAQ.'
      );
    }
  };

  const handleSeedFaqs = async () => {
    setLoadingData(true);
    try {
      await adminSeedDefaultFaqs();
      await loadAllData();
    } catch {
      setDataError('Não foi possível restaurar as perguntas padrão.');
      setLoadingData(false);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-sm text-slate-600">Verificando sessão administrativa...</p>
      </div>
    );
  }

  if (!user || !isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-[#0B3D91]">
              lh7 agência
            </span>
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B3D91]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao site
            </button>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#0B3D91]/10 text-[#0B3D91] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Painel Administrativo
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Área restrita ao administrador da lh7 agência para gerenciar agendamentos, depoimentos, mensagens e FAQ.
            </p>
          </div>

          {user && !isAuthorizedAdmin && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2" role="alert">
              <p className="text-sm font-semibold text-amber-900">
                Conta sem permissão administrativa
              </p>
              <p className="text-xs text-amber-800">
                Você entrou com <strong>{user.email}</strong>. Este painel aceita apenas a conta autorizada da agência ({ADMIN_EMAIL}).
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-[#0B3D91] hover:underline"
              >
                Sair e entrar com outra conta
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800" role="alert">
              {authError}
            </div>
          )}

          {!user && (
            <button
              type="button"
              onClick={handleLogin}
              disabled={signingIn}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963] disabled:opacity-60 transition-colors"
            >
              {signingIn ? 'Autenticando...' : 'Entrar com Google'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-display font-bold text-[#0B3D91] text-base whitespace-nowrap">
              lh7 agência
            </span>
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="font-medium text-slate-700 whitespace-nowrap">
              Painel Administrativo
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-xs text-slate-500 font-mono-tabular">
              {user.email}
            </span>
            <button
              type="button"
              onClick={loadAllData}
              aria-label="Atualizar dados do painel"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B3D91] border border-slate-200 rounded-lg hover:border-[#0B3D91] transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ver site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 transition-colors whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Agendamentos pendentes</p>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#0B3D91]">
              {counts.pendingAppointments}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Depoimentos pendentes</p>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-amber-600">
              {counts.pendingTestimonials}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">Mensagens não lidas</p>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#046A38]">
              {counts.unreadMessages}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500">FAQs publicados</p>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-slate-900">
              {counts.publishedFaqs}
            </p>
          </div>
        </div>

        {dataError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800" role="alert">
            {dataError}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit">
          {[
            { id: 'agendamentos', label: 'Agendamentos', count: appointments.length, icon: Calendar },
            { id: 'depoimentos', label: 'Depoimentos', count: testimonials.length, icon: Star },
            { id: 'mensagens', label: 'Mensagens', count: messages.length, icon: MessageSquare },
            { id: 'faq', label: 'FAQ', count: faqs.length, icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#0B3D91] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="font-mono-tabular text-xs text-slate-500">
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Agendamentos */}
        {activeTab === 'agendamentos' && (
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Agendamentos Recebidos
              </h2>
              <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
                {(['todos', 'pendente', 'confirmado', 'concluido', 'cancelado'] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setApptFilter(status)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                        apptFilter === status
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Nenhum agendamento encontrado nesta categoria.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono-tabular font-semibold text-[#0B3D91]">
                          {appt.date} · {appt.time}
                        </span>
                        <span aria-hidden="true">/</span>
                        <span>{appt.serviceInterest}</span>
                        <span aria-hidden="true">/</span>
                        <span
                          className={`font-semibold uppercase ${
                            appt.status === 'confirmado'
                              ? 'text-[#046A38]'
                              : appt.status === 'cancelado'
                              ? 'text-red-700'
                              : appt.status === 'concluido'
                              ? 'text-[#0B3D91]'
                              : 'text-amber-700'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900">
                        {appt.clientName}
                      </p>
                      <p className="text-sm font-mono-tabular text-slate-600">
                        Contato: {appt.contact}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-slate-500 pt-1">{appt.notes}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        aria-label={`Alterar status de ${appt.clientName}`}
                        value={appt.status}
                        onChange={async (e) => {
                          await adminUpdateAppointmentStatus(
                            appt.id,
                            e.target.value as AppointmentStatus
                          );
                          await loadAllData();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                      </select>

                      <a
                        href={buildWhatsAppUrl(
                          `Olá ${appt.clientName}, aqui é da lh7 agência! Sobre o seu agendamento para ${appt.date} às ${appt.time}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>

                      {confirmDeleteId === appt.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={async () => {
                              await adminDeleteAppointment(appt.id);
                              setConfirmDeleteId(null);
                              await loadAllData();
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1.5 text-xs text-slate-600"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(appt.id)}
                          aria-label={`Excluir agendamento de ${appt.clientName}`}
                          className="p-2 text-slate-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Depoimentos */}
        {activeTab === 'depoimentos' && (
          <section className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Moderação de Depoimentos
                  </h2>
                  <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['todos', 'pendente', 'aprovado', 'rejeitado'] as const).map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setTestFilter(status)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                            testFilter === status
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewTestimonial((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963]"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar depoimento
                </button>
              </div>

              {showNewTestimonial && (
                <form
                  onSubmit={handleSaveNewTestimonial}
                  className="p-5 bg-slate-50 border-b border-slate-200 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      placeholder="Nome do cliente"
                      className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={newTestSegment}
                      onChange={(e) => setNewTestSegment(e.target.value)}
                      placeholder="Segmento (opcional)"
                      className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    />
                    <select
                      aria-label="Nota em estrelas"
                      value={newTestRating}
                      onChange={(e) => setNewTestRating(Number(e.target.value))}
                      className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} estrelas
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={newTestText}
                    onChange={(e) => setNewTestText(e.target.value)}
                    placeholder="Texto do depoimento (mínimo 10 caracteres)"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A]"
                    >
                      Publicar depoimento
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewTestimonial(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {filteredTestimonials.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-500">
                  Nenhum depoimento encontrado nesta categoria.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredTestimonials.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono-tabular font-semibold text-amber-600">
                            {item.rating}/5 estrelas
                          </span>
                          <span aria-hidden="true">/</span>
                          <span
                            className={`font-semibold uppercase ${
                              item.status === 'aprovado'
                                ? 'text-[#046A38]'
                                : item.status === 'rejeitado'
                                ? 'text-red-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {item.clientName}
                          {item.segment ? ` — ${item.segment}` : ''}
                        </p>
                        <p className="text-sm text-slate-600">“{item.text}”</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {item.status !== 'aprovado' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await adminUpdateTestimonialStatus(item.id, 'aprovado');
                              await loadAllData();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A]"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Aprovar
                          </button>
                        )}
                        {item.status !== 'rejeitado' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await adminUpdateTestimonialStatus(item.id, 'rejeitado');
                              await loadAllData();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                          >
                            <X className="w-3.5 h-3.5" />
                            Ocultar
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            await adminDeleteTestimonial(item.id);
                            await loadAllData();
                          }}
                          aria-label={`Excluir depoimento de ${item.clientName}`}
                          className="p-2 text-slate-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tab 3: Mensagens */}
        {activeTab === 'mensagens' && (
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                Mensagens de Contato
              </h2>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                  { id: 'todas', label: 'Todas' },
                  { id: 'nao_lidas', label: 'Não lidas' },
                  { id: 'lidas', label: 'Lidas' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMsgFilter(f.id as 'todas' | 'nao_lidas' | 'lidas')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      msgFilter === f.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Nenhuma mensagem encontrada.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#0B3D91]">
                          Preferência: {msg.channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                        </span>
                        <span aria-hidden="true">/</span>
                        <span className={msg.read ? 'text-slate-500' : 'font-semibold text-[#046A38]'}>
                          {msg.read ? 'Lida' : 'Nova mensagem'}
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900">{msg.name}</p>
                      <p className="text-xs font-mono-tabular text-slate-600">
                        {msg.email} {msg.phone ? `· ${msg.phone}` : ''}
                      </p>
                      <p className="text-sm text-slate-700 pt-1">{msg.message}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={async () => {
                          await adminSetMessageRead(msg.id, !msg.read);
                          await loadAllData();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        {msg.read ? 'Marcar como não lida' : 'Marcar como lida'}
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent('Retorno lh7 agência')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B3D91] border border-slate-200 rounded-lg hover:border-[#0B3D91]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Responder e-mail
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          await adminDeleteMessage(msg.id);
                          await loadAllData();
                        }}
                        aria-label={`Excluir mensagem de ${msg.name}`}
                        className="p-2 text-slate-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 4: FAQ */}
        {activeTab === 'faq' && (
          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Perguntas Frequentes (FAQ)
                </h2>
                <p className="text-xs text-slate-500">
                  Alterações feitas aqui atualizam imediatamente o accordion público do site.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {faqs.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSeedFaqs}
                    className="px-3.5 py-2 text-xs font-semibold text-[#046A38] border border-[#046A38]/40 rounded-lg hover:bg-emerald-50"
                  >
                    Carregar FAQs padrão
                  </button>
                )}
                <button
                  type="button"
                  onClick={openNewFaqForm}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963]"
                >
                  <Plus className="w-4 h-4" />
                  Nova pergunta
                </button>
              </div>
            </div>

            {showFaqForm && (
              <form
                onSubmit={handleSaveFaq}
                className="p-5 bg-slate-50 border-b border-slate-200 space-y-4"
              >
                <h3 className="text-sm font-bold text-slate-900">
                  {editingFaqId ? 'Editar pergunta' : 'Cadastrar nova pergunta'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3">
                    <label htmlFor="faq-question" className="block text-xs font-semibold text-slate-700 mb-1">
                      Pergunta
                    </label>
                    <input
                      id="faq-question"
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      placeholder="Ex.: Quanto tempo leva para meu site aparecer no Google?"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="faq-order" className="block text-xs font-semibold text-slate-700 mb-1">
                      Ordem
                    </label>
                    <input
                      id="faq-order"
                      type="number"
                      min={0}
                      max={1000}
                      value={faqOrder}
                      onChange={(e) => setFaqOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm font-mono-tabular bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="faq-answer" className="block text-xs font-semibold text-slate-700 mb-1">
                    Resposta
                  </label>
                  <textarea
                    id="faq-answer"
                    rows={3}
                    value={faqAnswer}
                    onChange={(e) => setFaqAnswer(e.target.value)}
                    placeholder="Escreva a resposta completa e objetiva."
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={faqPublished}
                    onChange={(e) => setFaqPublished(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Publicar no site imediatamente
                </label>

                {faqFormError && (
                  <p className="text-xs text-red-700" role="alert">
                    {faqFormError}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#046A38] rounded-lg hover:bg-[#03502A]"
                  >
                    Salvar pergunta
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFaqForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {faqs.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <p className="text-sm text-slate-600">
                  Nenhuma pergunta personalizada salva no banco ainda. Enquanto isso, o site exibe as perguntas padrão da lh7 agência.
                </p>
                <button
                  type="button"
                  onClick={handleSeedFaqs}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0B3D91] rounded-lg hover:bg-[#072963]"
                >
                  Importar perguntas padrão para editar
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {faqs.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono-tabular font-semibold text-[#0B3D91]">
                          Ordem {item.order}
                        </span>
                        <span aria-hidden="true">/</span>
                        <span className={item.published ? 'text-[#046A38] font-semibold' : 'text-slate-500'}>
                          {item.published ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{item.question}</p>
                      <p className="text-sm text-slate-600">{item.answer}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditFaqForm(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0B3D91] border border-slate-200 rounded-lg hover:border-[#0B3D91]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await adminDeleteFaq(item.id);
                          await loadAllData();
                        }}
                        aria-label={`Excluir pergunta ${item.question}`}
                        className="p-2 text-slate-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
