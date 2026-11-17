# Tu Diligencia Legal · sitio web

Sitio en Next.js con todo lo necesario para captar, filtrar y atender clientes:

| Pieza | Herramienta | Qué hace |
| --- | --- | --- |
| CRM | **HubSpot** | Cada formulario crea o actualiza el contacto, abre un negocio y guarda notas con las respuestas y la puntuación. |
| Filtro de leads | `lib/leadScore.ts` | Puntúa 0–100 según semáforo + "¿cuándo quieres empezar?" → tier **A** (listo para consulta), **B** (necesita acompañamiento), **C** (se está informando). |
| Bot Diana | **Claude** (Anthropic) | Responde en la web y en WhatsApp solo con la base de conocimiento (`content/kb.json`). Sin clave usa coincidencia por palabras. |
| WhatsApp | **WhatsApp Cloud API** | Respuesta automática al instante según el tier, confirmaciones de cita e instrucciones de pago. Diana contesta los mensajes entrantes. |
| Pagos | **Stripe** + Zelle/Binance | Tarjeta con Stripe Checkout. Zelle y Binance reservan la hora y quedan como "pago pendiente" para que el equipo confirme. |
| Agenda | **Cal.com** | Horarios reales de cada abogado; la reserva se crea al confirmarse el pago. |
| Correo | **Resend** | Respuestas automáticas, instrucciones de pago, enlaces de acceso y avisos al equipo. |
| Portal Mi caso | HubSpot + Cal.com + Stripe + **Vercel Blob** | Acceso por enlace mágico (sin contraseña), estado del expediente, subida de documentos, pagos, mensajes y citas. |

Sin claves el sitio funciona igual y cada integración se registra en la consola en vez de enviarse, para poder probarlo en local.

---

## 1. Arrancar en local

```bash
npm install
cp .env.example .env.local   # rellena lo que tengas; lo vacío se simula
npm run dev                  # http://localhost:3000
```

## 2. Desplegar (Vercel recomendado)

1. Sube esta carpeta a un repositorio de GitHub y conéctalo en vercel.com → *New Project*.
2. En *Settings → Environment Variables* pega las variables de `.env.example`.
3. En *Storage* crea un **Blob store**: Vercel añade `BLOB_READ_WRITE_TOKEN` solo.
4. Conecta el dominio y pon `NEXT_PUBLIC_SITE_URL` con `https://`.

## 3. HubSpot

1. *Configuración → Integraciones → Apps privadas* → crea una app con permisos `crm.objects.contacts` y `crm.objects.deals` (lectura y escritura). Copia el token a `HUBSPOT_PRIVATE_APP_TOKEN`.
2. *Propiedades de contacto* → crea estas propiedades de texto de una línea:
   `tdl_case_id`, `tdl_lead_score` (número), `tdl_lead_tier`, `tdl_service`, `tdl_timing`, `tdl_light`, `tdl_source`, `tdl_country`, `tdl_docs_json` (texto de varias líneas).
3. *Negocios → Pipelines*: crea estas etapas y copia sus ID a las variables `HUBSPOT_STAGE_*`:
   Nuevo lead → Pre-evaluado → Pago pendiente → Consulta pagada → Propuesta enviada → Contratado → Expediente en curso → Resuelto.
   `HUBSPOT_STAGE_ORDER` mapea las etapas a las 6 fases que ve el cliente en Mi caso.
4. Crea una vista filtrada por `tdl_lead_tier = A`: esos son los leads que los asesores llaman primero.
5. **Portal:** para mostrar un mensaje al cliente, añade una nota al contacto que empiece por `[CLIENTE]`. Para personalizar su lista de documentos, pon en `tdl_docs_json` algo como:
   `[{"name":"Pasaporte","who":"cliente","status":"pendiente"},{"name":"Partida del abuelo","who":"nosotros","status":"gestion"}]`

## 4. Stripe

1. Copia la clave secreta a `STRIPE_SECRET_KEY`.
2. *Desarrolladores → Webhooks* → endpoint `https://TU-DOMINIO/api/stripe/webhook` con el evento `checkout.session.completed`. Copia el *signing secret* a `STRIPE_WEBHOOK_SECRET`.
3. Opcional: activa PayPal y otros métodos en *Configuración → Métodos de pago*. Checkout los muestra solo.

## 5. Cal.com

1. Crea un tipo de evento por consulta y abogado (Consulta inicial 30 min, Estrategia 60 min, Urgente 30 min), con Google Meet o Zoom como ubicación.
2. *Configuración → Desarrollador → Claves API* → `CALCOM_API_KEY`.
3. Pon los ID de evento en `CALCOM_EVENT_DEFAULT_*` o, para enrutar por especialidad, en `CALCOM_EVENT_<AREA>_<CONSULTA>` (p. ej. `CALCOM_EVENT_IT_INICIAL` para el abogado de Italia).
4. *Workflows* → recordatorios por correo y WhatsApp/SMS 24 h y 1 h antes.

## 6. WhatsApp Cloud API

1. En developers.facebook.com crea una app *Business*, añade el producto **WhatsApp** y registra el número.
2. Copia el token permanente (usuario del sistema) a `WHATSAPP_TOKEN` y el *Phone number ID* a `WHATSAPP_PHONE_NUMBER_ID`.
3. *Configuración → Webhook*: URL `https://TU-DOMINIO/api/whatsapp/webhook`, token de verificación = `WHATSAPP_VERIFY_TOKEN`, suscríbete a `messages`.
4. Crea y envía a aprobación estas **plantillas** (categoría *Utility*, idioma español):

| Nombre | Texto sugerido |
| --- | --- |
| `tdl_caso_listo` | Hola {{1}}, soy Diana de Tu Diligencia Legal. Recibimos tu caso {{2}} sobre {{3}}. Tu perfil parece viable: el siguiente paso es la consulta con el abogado especialista. Agenda aquí: {{4}} |
| `tdl_caso_recibido` | Hola {{1}}, recibimos tu caso {{2}} sobre {{3}}. Un asesor lo revisa en horario laboral. Mientras, puedes escribirme aquí cualquier duda. |
| `tdl_guia` | Hola {{1}}, gracias por tu interés en {{2}}. Aquí tienes nuestras guías y respuestas: {{3}}. Escríbeme cuando quieras. |
| `tdl_pago_pendiente` | Hola {{1}}, reservamos tu consulta (caso {{2}}). Para confirmarla, paga {{3}}: {{4}} |
| `tdl_cita_confirmada` | Hola {{1}}, tu cita está confirmada: {{2}}. Enlace: {{3}} |
| `tdl_pregunta_recibida` | Hola {{1}}, recibimos y pagaste tu consulta {{2}}. Tu abogado te responde por escrito en 48 h. |

## 7. Diana (Claude)

`ANTHROPIC_API_KEY` en console.anthropic.com. El modelo por defecto es `claude-haiku-5-5` (rápido y económico). Diana solo responde con `content/kb.json`: para enseñarle algo nuevo, añade una entrada ahí (y aparecerá también en el Centro de respuestas).

## 8. Correo (obligatorio: sin esto no llega ningún correo)

Todos los formularios envían **una respuesta automática al cliente** y **una copia completa a `TEAM_NOTIFICATION_EMAIL`** (por defecto `info@tudiligencialegal.com`). Elige una de dos opciones:

- **SMTP (lo más simple):** usa el buzón `info@` de tu hosting. Define `SMTP_HOST`, `SMTP_PORT` (465), `SMTP_SECURE=true`, `SMTP_USER` y `SMTP_PASS`, y `EMAIL_FROM=Tu Diligencia Legal <info@tudiligencialegal.com>`.
- **Resend:** verifica el dominio en resend.com (registros DNS), crea la API key (`RESEND_API_KEY`) y define `EMAIL_FROM`.

En ambos casos añade en el DNS los registros SPF, DKIM y DMARC que te indique el proveedor para no caer en spam. Las redes sociales (`NEXT_PUBLIC_SOCIAL_*`) y el WhatsApp (`NEXT_PUBLIC_WHATSAPP_NUMBER`) aparecen en todos los correos.

## 8b. Base de datos y panel /admin

1. En Vercel: *Storage → Create → Neon (Postgres)* y conéctala al proyecto. Se crea `DATABASE_URL` (o `POSTGRES_URL`). La tabla `submissions` se crea sola.
2. Define `ADMIN_PASSWORD` y entra en `https://TU-DOMINIO/admin`. Ahí ves todas las solicitudes (evaluador, contacto, guías, becas, registros, consultas), confirmas pagos de Zelle o Binance manual, cambias estados y exportas CSV. El panel muestra qué integraciones están activas.

## 8c. Binance Pay

- **Automático:** con una cuenta Binance Pay Merchant, crea la API key y define `BINANCE_PAY_API_KEY` y `BINANCE_PAY_SECRET`. En el panel de Binance configura el webhook `https://TU-DOMINIO/api/binance/webhook`. Al pagar, la cita se confirma sola y llegan correo y WhatsApp.
- **Manual:** sin API, el cliente ve tu `BINANCE_PAY_ID` y su referencia; la reserva queda *pendiente de pago* y la confirmas desde `/admin`, lo que dispara correo y WhatsApp de confirmación.

## 8d. Guías en PDF y becas

Las guías se descargan solo con un enlace firmado que se envía por correo (30 días). Se generan desde el contenido del sitio:

```bash
npx tsx scripts/export-content.ts /tmp/content.json
python3 scripts/build_guides.py /tmp/content.json   # requiere: pip install reportlab
```

Los datos de becas están en `lib/becas.ts` y los árboles del evaluador en `lib/evaluators.ts`. Revísalos cada 6 meses.

## 8e. Textos legales

`lib/legal.ts` contiene aviso legal, privacidad, cookies, condiciones de contratación y reembolsos. Los datos de la empresa se completan con `NEXT_PUBLIC_LEGAL_*` en Vercel. **Deben validarlos los abogados de la firma antes de publicar.**

---

## 9. SEO, analítica y conversiones

Ya implementado: títulos y descripciones por página (`lib/seo.ts`), canonical y hreflang, imágenes sociales automáticas, datos estructurados (LegalService, Service con precios, FAQPage, BreadcrumbList, Article), migas de pan, `sitemap.xml`, `robots.txt`, `llms.txt` para buscadores con IA, fuentes alojadas en el propio sitio, cabeceras de seguridad y redirecciones.

1. **Search Console y Bing:** verifica el dominio (pon los códigos en `NEXT_PUBLIC_GSC_VERIFICATION` y `NEXT_PUBLIC_BING_VERIFICATION`) y envía `https://TU-DOMINIO/sitemap.xml`.
2. **GA4:** crea la propiedad, pega `NEXT_PUBLIC_GA_ID` y marca como eventos clave: `generate_lead`, `purchase`, `begin_checkout`, `sign_up`, `chat_lawyer_request`.
3. **Google Ads:** crea 3 conversiones (Lead A, Lead, Consulta pagada), pega el ID y las etiquetas, y activa *conversiones mejoradas* (el sitio ya envía el correo cifrado por Google tras el consentimiento).
4. **Conversiones offline:** cada contacto guarda en HubSpot `tdl_gclid`, `tdl_utm_*`, `tdl_fbclid`, `tdl_landing_page` y `tdl_referrer` (créalas como propiedades de texto). Conecta Google Ads a HubSpot (*Marketing → Anuncios*) y crea eventos de conversión por etapa del negocio (*Consulta pagada*, *Contratado*) para que Google optimice hacia clientes reales.
5. **Meta Pixel:** pega `NEXT_PUBLIC_META_PIXEL_ID`. Solo se carga si el visitante acepta cookies.
6. **Banner de cookies:** aparece solo si hay alguna herramienta de medición configurada. Revisad el texto con vuestro asesor legal.

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| Precios de consultas | `lib/catalog.ts` (`CONSULTS`) |
| Precios, vías, preguntas del evaluador, FAQ y textos de cada servicio | `content/services.json` |
| Base de conocimiento de Diana y Centro de respuestas | `content/kb.json` |
| Reglas de puntuación de leads | `lib/leadScore.ts` |
| Artículos del blog | `lib/posts.ts` (índice) + `content/blog/<slug>.md` |
| Textos legales | `lib/legal.ts` |
| Árboles del evaluador (vías y base legal) | `lib/evaluators.ts` |
| Becas | `lib/becas.ts` |
| Títulos y descripciones SEO | `lib/seo.ts` (`PAGE_SEO`) |
| Landings de cola larga (nietos, residencia, opción, recurso) | `lib/landings.ts` |
| Equipo | `app/nosotros/page.tsx` |

## Pendiente antes de publicar

- Validación legal de todos los textos de requisitos (reforma italiana de 2025, Ley de Memoria Democrática, ley portuguesa, golden visa, etc.).
- Precios definitivos, cifras reales, equipo, casos de éxito, WhatsApp y correo.
- Validación legal de `lib/legal.ts` y datos de la empresa (`NEXT_PUBLIC_LEGAL_*`).
- Los documentos del portal se guardan en Vercel Blob con URL no adivinable. Si preferís almacenamiento privado (S3/R2 con URLs firmadas), cambiad `app/api/case/upload/route.ts`.
