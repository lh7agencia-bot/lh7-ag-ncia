import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  AppointmentInput,
  ContactMessageInput,
  FaqInput,
  FIELD_LIMITS,
  sanitizeText,
  TestimonialInput,
  validateAppointmentInput,
  validateContactMessageInput,
  validateFaqInput,
  validateTestimonialInput,
} from '../utils/validation';
import { DEFAULT_FAQS } from '../data/defaultFaqs';

export type AppointmentStatus = 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
export type TestimonialStatus = 'pendente' | 'aprovado' | 'rejeitado';

export interface AppointmentRecord {
  id: string;
  clientName: string;
  contact: string;
  serviceInterest: string;
  date: string;
  time: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface TestimonialRecord {
  id: string;
  clientName: string;
  segment?: string;
  text: string;
  rating: number;
  status: TestimonialStatus;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  channel: 'email' | 'whatsapp';
  read: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

function generateSafeId(prefix: string): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, '')
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${randomPart}`.slice(0, 64);
}

// --- Public Operations ---

export async function createPublicAppointment(input: AppointmentInput): Promise<string> {
  const validation = validateAppointmentInput(input);
  if (!validation.valid) {
    throw new Error(Object.values(validation.errors)[0] || 'Dados de agendamento inválidos.');
  }

  const id = generateSafeId('appt');
  const path = `appointments/${id}`;
  const notes = sanitizeText(input.notes ?? '', FIELD_LIMITS.appointment.notesMax);

  const payload: Record<string, unknown> = {
    clientName: sanitizeText(input.clientName, FIELD_LIMITS.appointment.clientNameMax),
    contact: sanitizeText(input.contact, FIELD_LIMITS.appointment.contactMax),
    serviceInterest: sanitizeText(input.serviceInterest, FIELD_LIMITS.appointment.serviceInterestMax),
    date: input.date.trim(),
    time: input.time.trim(),
    status: 'pendente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (notes.length > 0) {
    payload.notes = notes;
  }

  try {
    await setDoc(doc(db, 'appointments', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchApprovedTestimonials(): Promise<TestimonialRecord[]> {
  const path = 'testimonials';
  try {
    const q = query(collection(db, path), where('status', '==', 'aprovado'));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<TestimonialRecord, 'id'>),
    }));
    items.sort((a, b) => {
      const ta = a.createdAt?.toMillis() ?? 0;
      const tb = b.createdAt?.toMillis() ?? 0;
      return tb - ta;
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function submitPublicTestimonial(input: TestimonialInput): Promise<string> {
  const validation = validateTestimonialInput(input);
  if (!validation.valid) {
    throw new Error(Object.values(validation.errors)[0] || 'Dados do depoimento inválidos.');
  }

  const id = generateSafeId('test');
  const path = `testimonials/${id}`;
  const segment = sanitizeText(input.segment ?? '', FIELD_LIMITS.testimonial.segmentMax);

  const payload: Record<string, unknown> = {
    clientName: sanitizeText(input.clientName, FIELD_LIMITS.testimonial.clientNameMax),
    text: sanitizeText(input.text, FIELD_LIMITS.testimonial.textMax),
    rating: Math.round(Number(input.rating)),
    status: 'pendente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (segment.length > 0) {
    payload.segment = segment;
  }

  try {
    await setDoc(doc(db, 'testimonials', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function submitContactMessage(input: ContactMessageInput): Promise<string> {
  const validation = validateContactMessageInput(input);
  if (!validation.valid) {
    throw new Error(Object.values(validation.errors)[0] || 'Dados da mensagem inválidos.');
  }

  const id = generateSafeId('msg');
  const path = `messages/${id}`;
  const phone = sanitizeText(input.phone ?? '', FIELD_LIMITS.message.phoneMax);

  const payload: Record<string, unknown> = {
    name: sanitizeText(input.name, FIELD_LIMITS.message.nameMax),
    email: sanitizeText(input.email, FIELD_LIMITS.message.emailMax),
    message: sanitizeText(input.message, FIELD_LIMITS.message.messageMax),
    channel: input.channel === 'whatsapp' ? 'whatsapp' : 'email',
    read: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (phone.length > 0) {
    payload.phone = phone;
  }

  try {
    await setDoc(doc(db, 'messages', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchPublishedFaqs(): Promise<FaqRecord[]> {
  const path = 'faqs';
  try {
    const q = query(collection(db, path), where('published', '==', true));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FaqRecord, 'id'>),
    }));
    items.sort((a, b) => a.order - b.order);
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// --- Admin Operations ---

export async function adminFetchAppointments(): Promise<AppointmentRecord[]> {
  const path = 'appointments';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<AppointmentRecord, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminUpdateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  const path = `appointments/${id}`;
  try {
    await updateDoc(doc(db, 'appointments', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adminDeleteAppointment(id: string): Promise<void> {
  const path = `appointments/${id}`;
  try {
    await deleteDoc(doc(db, 'appointments', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function adminFetchTestimonials(): Promise<TestimonialRecord[]> {
  const path = 'testimonials';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<TestimonialRecord, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminCreateTestimonial(
  input: TestimonialInput,
  status: TestimonialStatus = 'aprovado'
): Promise<string> {
  const validation = validateTestimonialInput(input);
  if (!validation.valid) {
    throw new Error(Object.values(validation.errors)[0] || 'Dados inválidos.');
  }
  const id = generateSafeId('test');
  const path = `testimonials/${id}`;
  const segment = sanitizeText(input.segment ?? '', FIELD_LIMITS.testimonial.segmentMax);

  const payload: Record<string, unknown> = {
    clientName: sanitizeText(input.clientName, FIELD_LIMITS.testimonial.clientNameMax),
    text: sanitizeText(input.text, FIELD_LIMITS.testimonial.textMax),
    rating: Math.round(Number(input.rating)),
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (segment.length > 0) {
    payload.segment = segment;
  }

  try {
    await setDoc(doc(db, 'testimonials', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function adminUpdateTestimonialStatus(
  id: string,
  status: TestimonialStatus
): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await updateDoc(doc(db, 'testimonials', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function adminFetchMessages(): Promise<ContactMessageRecord[]> {
  const path = 'messages';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ContactMessageRecord, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminSetMessageRead(id: string, read: boolean): Promise<void> {
  const path = `messages/${id}`;
  try {
    await updateDoc(doc(db, 'messages', id), {
      read,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adminDeleteMessage(id: string): Promise<void> {
  const path = `messages/${id}`;
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function adminFetchFaqs(): Promise<FaqRecord[]> {
  const path = 'faqs';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FaqRecord, 'id'>),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminSaveFaq(input: FaqInput, existingId?: string): Promise<string> {
  const validation = validateFaqInput(input);
  if (!validation.valid) {
    throw new Error(Object.values(validation.errors)[0] || 'Dados do FAQ inválidos.');
  }

  const id = existingId || generateSafeId('faq');
  const path = `faqs/${id}`;
  const question = sanitizeText(input.question, FIELD_LIMITS.faq.questionMax);
  const answer = sanitizeText(input.answer, FIELD_LIMITS.faq.answerMax);
  const order = Math.max(0, Math.min(1000, Math.round(Number(input.order))));

  try {
    if (existingId) {
      await updateDoc(doc(db, 'faqs', id), {
        question,
        answer,
        order,
        published: Boolean(input.published),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(doc(db, 'faqs', id), {
        question,
        answer,
        order,
        published: Boolean(input.published),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return id;
  } catch (error) {
    handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function adminDeleteFaq(id: string): Promise<void> {
  const path = `faqs/${id}`;
  try {
    await deleteDoc(doc(db, 'faqs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function adminSeedDefaultFaqs(): Promise<void> {
  try {
    for (const item of DEFAULT_FAQS) {
      await setDoc(doc(db, 'faqs', item.id), {
        question: item.question,
        answer: item.answer,
        order: item.order,
        published: item.published,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'faqs');
  }
}
