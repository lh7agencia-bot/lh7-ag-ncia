# Security Specification — lh7 agência

## 1. Data Invariants
1. **Agendamentos (`/appointments/{appointmentId}`)**:
   - Somente administradores verificados (`lh7agencia@gmail.com` com `email_verified == true` ou documento em `/admins/{uid}`) podem ler (`get`/`list`), atualizar ou excluir agendamentos, pois contêm PII (`clientName`, `contact`, `notes`).
   - Visitantes públicos podem apenas criar um agendamento com `status == 'pendente'`, campos obrigatórios dentro dos limites de tamanho e timestamps gerados no servidor (`request.time`).
2. **Depoimentos (`/testimonials/{testimonialId}`)**:
   - Leituras públicas (`get` e `list`) são restritas estritamente a documentos onde `resource.data.status == 'aprovado'`.
   - Visitantes públicos podem enviar um novo depoimento apenas com `status == 'pendente'` e `rating` inteiro entre 1 e 5.
   - Somente administradores podem aprovar, rejeitar, editar ou excluir depoimentos, ou publicar depoimentos já como `'aprovado'`.
3. **Mensagens de Contato (`/messages/{messageId}`)**:
   - Somente administradores podem ler, atualizar (`read: true/false`) ou excluir mensagens, protegendo `email`, `phone` e `message`.
   - Visitantes públicos podem criar mensagens apenas com `read == false` e `channel in ['email', 'whatsapp']`.
4. **FAQ (`/faqs/{faqId}`)**:
   - Leituras públicas (`get` e `list`) retornam apenas itens com `resource.data.published == true`.
   - Criação, edição, reordenação e exclusão de perguntas são exclusivas do administrador.

## 2. "Dirty Dozen" Payloads (Adversarial Tests)
1. **Shadow Field Injection on Appointment**: `{ clientName: "Ana", contact: "62998805900", serviceInterest: "SEO Local", date: "2026-12-01", time: "10:00", status: "pendente", isAdmin: true, createdAt: serverTimestamp, updatedAt: serverTimestamp }` -> `PERMISSION_DENIED` (`hasOnly` bloqueia `isAdmin`).
2. **Appointment Status Bypass**: Public create with `status: "confirmado"` -> `PERMISSION_DENIED`.
3. **Appointment PII Scraping**: Unauthenticated or non-admin `list` on `/appointments` -> `PERMISSION_DENIED`.
4. **Self-Approved Public Testimonial**: Public create on `/testimonials` with `status: "aprovado"` -> `PERMISSION_DENIED`.
5. **Rating Out of Bounds**: Public create on `/testimonials` with `rating: 10` or `rating: 0` or `rating: "5"` -> `PERMISSION_DENIED`.
6. **Unapproved Testimonial Leak**: Unauthenticated `list` on `/testimonials` without `where('status', '==', 'aprovado')` -> `PERMISSION_DENIED`.
7. **Contact Message PII Read**: Non-admin authenticated user `get` on `/messages/{id}` -> `PERMISSION_DENIED`.
8. **Message Pre-Marked Read**: Public create on `/messages` with `read: true` -> `PERMISSION_DENIED`.
9. **FAQ Unauthorized Mutation**: Non-admin `create` or `update` on `/faqs/{id}` -> `PERMISSION_DENIED`.
10. **ID Poisoning Attack**: Document ID with 300 characters or invalid characters (`../admin`) -> `PERMISSION_DENIED` (`isValidId`).
11. **Oversized Payload (Denial of Wallet)**: `message` field with 5,000 characters on `/messages` -> `PERMISSION_DENIED`.
12. **Unverified Admin Email Spoof**: User with `email == 'lh7agencia@gmail.com'` and `email_verified == false` attempting admin `list` on `/appointments` -> `PERMISSION_DENIED`.
