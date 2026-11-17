export const FIELD_LIMITS = {
  appointment: {
    clientNameMin: 2,
    clientNameMax: 120,
    contactMin: 6,
    contactMax: 120,
    serviceInterestMin: 2,
    serviceInterestMax: 120,
    notesMax: 500,
    datePattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
    timePattern: /^[0-9]{2}:[0-9]{2}$/,
  },
  testimonial: {
    clientNameMin: 2,
    clientNameMax: 100,
    segmentMax: 100,
    textMin: 10,
    textMax: 600,
    ratingMin: 1,
    ratingMax: 5,
  },
  message: {
    nameMin: 2,
    nameMax: 120,
    emailMin: 5,
    emailMax: 160,
    phoneMax: 40,
    messageMin: 5,
    messageMax: 2000,
  },
  faq: {
    questionMin: 5,
    questionMax: 240,
    answerMin: 10,
    answerMax: 2000,
    orderMin: 0,
    orderMax: 1000,
  },
} as const;

export const BUSINESS_WHATSAPP_NUMBER = '5562998805900';
export const BUSINESS_PHONE_DISPLAY = '(62) 99880-5900';
export const ADMIN_EMAIL = 'lh7agencia@gmail.com';

export interface AppointmentInput {
  clientName: string;
  contact: string;
  serviceInterest: string;
  date: string;
  time: string;
  notes?: string;
}

export interface TestimonialInput {
  clientName: string;
  segment?: string;
  text: string;
  rating: number;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  channel: 'email' | 'whatsapp';
}

export interface FaqInput {
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length < FIELD_LIMITS.message.emailMin || trimmed.length > FIELD_LIMITS.message.emailMax) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function validateAppointmentInput(input: AppointmentInput): ValidationResult {
  const errors: Record<string, string> = {};
  const clientName = input.clientName.trim();
  const contact = input.contact.trim();
  const serviceInterest = input.serviceInterest.trim();
  const date = input.date.trim();
  const time = input.time.trim();
  const notes = (input.notes ?? '').trim();

  if (clientName.length < FIELD_LIMITS.appointment.clientNameMin || clientName.length > FIELD_LIMITS.appointment.clientNameMax) {
    errors.clientName = 'Informe seu nome completo (mínimo 2 caracteres).';
  }
  if (contact.length < FIELD_LIMITS.appointment.contactMin || contact.length > FIELD_LIMITS.appointment.contactMax) {
    errors.contact = 'Informe um WhatsApp ou e-mail válido para retorno.';
  }
  if (serviceInterest.length < FIELD_LIMITS.appointment.serviceInterestMin || serviceInterest.length > FIELD_LIMITS.appointment.serviceInterestMax) {
    errors.serviceInterest = 'Selecione o serviço desejado.';
  }
  if (!FIELD_LIMITS.appointment.datePattern.test(date)) {
    errors.date = 'Selecione uma data válida (AAAA-MM-DD).';
  }
  if (!FIELD_LIMITS.appointment.timePattern.test(time)) {
    errors.time = 'Selecione um horário disponível.';
  }
  if (notes.length > FIELD_LIMITS.appointment.notesMax) {
    errors.notes = 'Observações podem ter no máximo 500 caracteres.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateTestimonialInput(input: TestimonialInput): ValidationResult {
  const errors: Record<string, string> = {};
  const clientName = input.clientName.trim();
  const segment = (input.segment ?? '').trim();
  const text = input.text.trim();
  const rating = Number(input.rating);

  if (clientName.length < FIELD_LIMITS.testimonial.clientNameMin || clientName.length > FIELD_LIMITS.testimonial.clientNameMax) {
    errors.clientName = 'Informe seu nome (mínimo 2 caracteres).';
  }
  if (segment.length > FIELD_LIMITS.testimonial.segmentMax) {
    errors.segment = 'Segmento deve ter no máximo 100 caracteres.';
  }
  if (text.length < FIELD_LIMITS.testimonial.textMin || text.length > FIELD_LIMITS.testimonial.textMax) {
    errors.text = 'O depoimento deve ter entre 10 e 600 caracteres.';
  }
  if (!Number.isInteger(rating) || rating < FIELD_LIMITS.testimonial.ratingMin || rating > FIELD_LIMITS.testimonial.ratingMax) {
    errors.rating = 'Escolha uma nota de 1 a 5 estrelas.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateContactMessageInput(input: ContactMessageInput): ValidationResult {
  const errors: Record<string, string> = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = (input.phone ?? '').trim();
  const message = input.message.trim();

  if (name.length < FIELD_LIMITS.message.nameMin || name.length > FIELD_LIMITS.message.nameMax) {
    errors.name = 'Informe seu nome (mínimo 2 caracteres).';
  }
  if (!validateEmail(email)) {
    errors.email = 'Informe um endereço de e-mail válido.';
  }
  if (phone.length > FIELD_LIMITS.message.phoneMax) {
    errors.phone = 'Telefone deve ter no máximo 40 caracteres.';
  }
  if (message.length < FIELD_LIMITS.message.messageMin || message.length > FIELD_LIMITS.message.messageMax) {
    errors.message = 'Escreva sua mensagem (entre 5 e 2000 caracteres).';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateFaqInput(input: FaqInput): ValidationResult {
  const errors: Record<string, string> = {};
  const question = input.question.trim();
  const answer = input.answer.trim();
  const order = Number(input.order);

  if (question.length < FIELD_LIMITS.faq.questionMin || question.length > FIELD_LIMITS.faq.questionMax) {
    errors.question = 'A pergunta deve ter entre 5 e 240 caracteres.';
  }
  if (answer.length < FIELD_LIMITS.faq.answerMin || answer.length > FIELD_LIMITS.faq.answerMax) {
    errors.answer = 'A resposta deve ter entre 10 e 2000 caracteres.';
  }
  if (!Number.isInteger(order) || order < FIELD_LIMITS.faq.orderMin || order > FIELD_LIMITS.faq.orderMax) {
    errors.order = 'A ordem deve ser um número inteiro entre 0 e 1000.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildWhatsAppUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getAvailableDateOptions(baseDate = new Date(), daysCount = 10): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];
  const cursor = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  let added = 0;

  while (added < daysCount) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day === 0) continue; // skip Sunday
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, '0');
    const dd = String(cursor.getDate()).padStart(2, '0');
    const value = `${yyyy}-${mm}-${dd}`;
    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const label = `${weekdayNames[day]}, ${dd} de ${monthNames[cursor.getMonth()]}`;
    options.push({ value, label });
    added += 1;
  }

  return options;
}

export const AVAILABLE_TIME_SLOTS = ['09:00', '10:30', '14:00', '15:30', '17:00'] as const;
