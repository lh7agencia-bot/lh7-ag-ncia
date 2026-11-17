import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAppointmentInput,
  validateTestimonialInput,
  validateContactMessageInput,
  validateFaqInput,
  buildWhatsAppUrl,
  getAvailableDateOptions,
  sanitizeText,
} from './validation';

test('validateAppointmentInput accepts valid appointment and rejects missing or malformed fields', () => {
  const ok = validateAppointmentInput({
    clientName: 'Mariana Souza',
    contact: '62998805900',
    serviceInterest: 'Criação de Site + SEO Local',
    date: '2026-11-20',
    time: '10:30',
    notes: 'Preciso de um site novo para minha clínica.',
  });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.errors, {});

  const bad = validateAppointmentInput({
    clientName: 'A',
    contact: '123',
    serviceInterest: '',
    date: '20/11/2026',
    time: '999',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.clientName);
  assert.ok(bad.errors.contact);
  assert.ok(bad.errors.serviceInterest);
  assert.ok(bad.errors.date);
  assert.ok(bad.errors.time);
});

test('validateTestimonialInput enforces rating 1..5 and text length bounds', () => {
  const ok = validateTestimonialInput({
    clientName: 'Carlos Henrique',
    segment: 'Clínica Odontológica',
    text: 'Depois que a lh7 agência refez nosso site e trabalhou o SEO local, passamos a receber contatos toda semana.',
    rating: 5,
  });
  assert.equal(ok.valid, true);

  const badRating = validateTestimonialInput({
    clientName: 'Carlos',
    text: 'Texto suficientemente longo para testar nota.',
    rating: 6,
  });
  assert.equal(badRating.valid, false);
  assert.ok(badRating.errors.rating);
});

test('validateContactMessageInput validates email format and message body', () => {
  const ok = validateContactMessageInput({
    name: 'Rafael Lima',
    email: 'rafael@empresa.com.br',
    phone: '62999998888',
    message: 'Gostaria de um orçamento para criação de site institucional.',
    channel: 'whatsapp',
  });
  assert.equal(ok.valid, true);

  const bad = validateContactMessageInput({
    name: 'R',
    email: 'invalido',
    message: 'Oi',
    channel: 'email',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.email);
  assert.ok(bad.errors.message);
});

test('validateFaqInput validates question, answer, and integer order', () => {
  const ok = validateFaqInput({
    question: 'Em quanto tempo meu site fica pronto?',
    answer: 'Sites institucionais ficam prontos entre 10 e 20 dias úteis com SEO técnico configurado.',
    order: 1,
    published: true,
  });
  assert.equal(ok.valid, true);

  const bad = validateFaqInput({
    question: 'Oi?',
    answer: 'Curto',
    order: -1,
    published: true,
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.question);
  assert.ok(bad.errors.answer);
  assert.ok(bad.errors.order);
});

test('buildWhatsAppUrl uses exact phone number 5562998805900 and URL encodes text', () => {
  const url = buildWhatsAppUrl('Olá lh7 agência!');
  assert.equal(url, 'https://wa.me/5562998805900?text=Ol%C3%A1%20lh7%20ag%C3%AAncia!');
});

test('getAvailableDateOptions returns requested business days excluding Sundays', () => {
  const base = new Date(2026, 10, 17); // Nov 17, 2026
  const dates = getAvailableDateOptions(base, 6);
  assert.equal(dates.length, 6);
  for (const item of dates) {
    assert.match(item.value, /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
    const [y, m, d] = item.value.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    assert.notEqual(dt.getDay(), 0);
  }
});

test('sanitizeText trims and caps length', () => {
  assert.equal(sanitizeText('  abcde  ', 3), 'abc');
});
