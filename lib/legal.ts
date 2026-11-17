// Legal texts. Company data comes from env vars so the legal team can fill them
// in Vercel without touching code. Reviewed against the rules in force in
// November 2026; must be validated by the firm's lawyers before launch.

const v = (k: string, f: string) => process.env[k] || f;
export const CO = {
  name: v('NEXT_PUBLIC_LEGAL_NAME', '[Razón social]'),
  brand: 'Tu Diligencia Legal',
  group: 'Certia Group',
  taxId: v('NEXT_PUBLIC_LEGAL_TAX_ID', '[NIF/CIF]'),
  address: v('NEXT_PUBLIC_LEGAL_ADDRESS', '[Domicilio social]'),
  registry: v('NEXT_PUBLIC_LEGAL_REGISTRY', '[Datos de inscripción en el Registro Mercantil]'),
  bar: v('NEXT_PUBLIC_LEGAL_BAR', '[Colegio de la Abogacía y número de colegiación del abogado responsable]'),
  email: v('NEXT_PUBLIC_CONTACT_EMAIL', 'info@tudiligencialegal.com'),
  privacyEmail: v('NEXT_PUBLIC_PRIVACY_EMAIL', 'info@tudiligencialegal.com'),
  dpo: v('NEXT_PUBLIC_LEGAL_DPO', ''),
  updated: '17 de noviembre de 2026',
};

export interface LegalSection { h: string; p: (string | string[])[] }
export interface LegalDoc { title: string; summary: string; sections: LegalSection[] }

export const LEGAL: Record<string, LegalDoc> = {
  'aviso-legal': {
    title: 'Aviso legal',
    summary: 'Quién está detrás de este sitio, condiciones de uso y responsabilidad sobre la información publicada.',
    sections: [
      { h: '1. Titular del sitio', p: [
        'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se informa:',
        [`Titular: ${CO.name}, que opera con la marca ${CO.brand}, integrada en ${CO.group}.`, `NIF/CIF: ${CO.taxId}.`, `Domicilio: ${CO.address}.`, `Registro: ${CO.registry}.`, `Correo electrónico: ${CO.email}.`, `Profesión regulada: los servicios jurídicos los prestan abogados colegiados. ${CO.bar}. Normas profesionales: Estatuto General de la Abogacía Española (Real Decreto 135/2021) y Código Deontológico de la Abogacía Española.`],
      ] },
      { h: '2. Objeto y condiciones de uso', p: [
        'Este sitio informa sobre servicios de asesoría en nacionalidad, extranjería y movilidad internacional, y permite solicitar evaluaciones, consultas y servicios. Al navegar aceptas usarlo de buena fe y conforme a la ley, sin introducir datos falsos o de terceros sin su autorización, sin intentar acceder a áreas restringidas y sin automatizar envíos de formularios.',
      ] },
      { h: '3. Información orientativa', p: [
        'Los contenidos, el evaluador y el asistente virtual ofrecen información general y orientativa basada en la normativa vigente en la fecha de su última revisión. No constituyen asesoramiento jurídico ni crean una relación abogado-cliente. Solo un abogado, con tus documentos, puede confirmar la viabilidad de tu caso. Las leyes de nacionalidad cambian con frecuencia (por ejemplo, la Ley italiana 74/2025 o la Lei Orgânica portuguesa 1/2026), por lo que recomendamos confirmar siempre la situación actual.',
      ] },
      { h: '4. Inteligencia artificial', p: [
        'Diana, el asistente del sitio, es un sistema de inteligencia artificial. Lo indicamos de forma clara al iniciar la conversación, conforme al artículo 50 del Reglamento (UE) 2024/1689 de Inteligencia Artificial. Diana no toma decisiones sobre tu caso ni sustituye al abogado; deriva al equipo humano cuando la pregunta lo requiere.',
      ] },
      { h: '5. Propiedad intelectual e industrial', p: [
        `Los textos, diseños, logotipos, código e imágenes del sitio son titularidad de ${CO.name} o de ${CO.group}, o se usan con licencia. Queda prohibida su reproducción, distribución o transformación con fines comerciales sin autorización escrita. Puedes enlazar a cualquier página del sitio siempre que no se sugiera una relación inexistente.`,
      ] },
      { h: '6. Enlaces externos', p: [
        'Enlazamos a fuentes oficiales (BOE, Diário da República, Gazzetta Ufficiale, consulados, universidades) para que puedas verificar la información. No controlamos esos sitios ni respondemos de sus cambios.',
      ] },
      { h: '7. Responsabilidad', p: [
        'Trabajamos para que la información sea exacta y esté actualizada, pero no garantizamos la ausencia de errores ni la disponibilidad ininterrumpida del sitio. No respondemos de decisiones tomadas solo con base en la información general publicada, sin una consulta profesional. Nada de lo anterior limita la responsabilidad que no pueda excluirse según la ley, ni nuestra responsabilidad profesional por los servicios contratados.',
      ] },
      { h: '8. Ley aplicable y reclamaciones', p: [
        'Este aviso se rige por la ley española. Si eres consumidor, puedes reclamar ante los tribunales de tu domicilio cuando la ley lo permita. Tienes a tu disposición hojas de reclamaciones y puedes acudir a los servicios de consumo de tu comunidad autónoma o, en litigios transfronterizos dentro de la UE, al Centro Europeo del Consumidor. La plataforma europea ODR dejó de funcionar el 20 de julio de 2025 (Reglamento (UE) 2024/3228), por lo que ya no se enlaza.',
      ] },
    ],
  },

  privacidad: {
    title: 'Política de privacidad',
    summary: 'Qué datos tratamos, para qué, con qué base legal, con quién los compartimos, cuánto tiempo los guardamos y cómo ejercer tus derechos.',
    sections: [
      { h: '1. Responsable del tratamiento', p: [
        [`Responsable: ${CO.name} (${CO.brand}, ${CO.group}).`, `NIF/CIF: ${CO.taxId}. Domicilio: ${CO.address}.`, `Contacto de privacidad: ${CO.privacyEmail}.`, CO.dpo ? `Delegado de Protección de Datos: ${CO.dpo}.` : 'Si se designa un Delegado de Protección de Datos, sus datos de contacto aparecerán aquí.'],
        'Aplicamos el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD). Si resides fuera de la UE, el RGPD se aplica porque ofrecemos servicios desde la UE (art. 3 RGPD), además de las garantías de tu país; en Venezuela, el derecho de acceso y rectificación de datos (habeas data) reconocido en el artículo 28 de la Constitución.',
      ] },
      { h: '2. Qué datos tratamos', p: [[
        'Identificación y contacto: nombre, correo, teléfono o WhatsApp, país.',
        'Datos de tu caso: respuestas del evaluador, mensajes, documentos que subas (partidas, pasaportes, certificados) y notas del abogado.',
        'Datos de pago: importe, método y referencia de la transacción. No almacenamos números de tarjeta: los gestiona Stripe. En pagos con Binance Pay o Zelle guardamos la referencia que nos facilitas.',
        'Datos de navegación: páginas visitadas, origen de la visita (UTM, gclid) y datos técnicos, solo si aceptas cookies de analítica o publicidad.',
        'Conversaciones con el asistente virtual Diana.',
        'Categorías especiales: algunos expedientes pueden revelar origen étnico o datos de salud o antecedentes penales (por ejemplo, certificados exigidos por la ley de nacionalidad). Solo los tratamos cuando son necesarios para tu trámite y con tu consentimiento explícito (art. 9.2.a RGPD) o para la formulación de reclamaciones (art. 9.2.f RGPD), y los antecedentes penales en el marco del art. 10 RGPD y del art. 10 LOPDGDD.',
      ]] },
      { h: '3. Para qué y con qué base legal', p: [[
        'Responder tus solicitudes, enviarte el resultado del evaluador y las guías: aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).',
        'Prestar los servicios contratados, agendar citas, gestionar pagos y tu expediente: ejecución del contrato (art. 6.1.b).',
        'Facturación, contabilidad y prevención del blanqueo de capitales cuando corresponda: obligación legal (art. 6.1.c; Ley 58/2003 General Tributaria; Ley 10/2010 de prevención del blanqueo de capitales).',
        'Enviarte información comercial sobre servicios similares a los que solicitaste: interés legítimo (art. 6.1.f RGPD y art. 21.2 LSSI). Puedes oponerte en cada comunicación.',
        'Newsletter, alertas legislativas y medición de campañas publicitarias: consentimiento (art. 6.1.a), revocable en cualquier momento.',
        'Seguridad del sitio y prevención del fraude (límites de envío, registros técnicos): interés legítimo (art. 6.1.f).',
      ]] },
      { h: '4. Decisiones automatizadas', p: [
        'El evaluador y un sistema de puntuación interna ordenan las solicitudes para priorizar la atención (por ejemplo, según la urgencia que indicas). No se adoptan decisiones con efectos jurídicos sobre ti basadas únicamente en tratamientos automatizados (art. 22 RGPD): un abogado revisa cada caso antes de cualquier decisión, y siempre puedes pedir intervención humana.',
      ] },
      { h: '5. Con quién compartimos tus datos', p: [
        'No vendemos tus datos. Los comunicamos solo a:',
        [
          'Encargados de tratamiento con contrato conforme al art. 28 RGPD: HubSpot (CRM), Stripe (pagos con tarjeta), Binance (pagos con criptomonedas, si eliges ese método), Cal.com (agenda), Meta Platforms (WhatsApp Business), Anthropic (asistente virtual), Resend o nuestro proveedor de correo, Neon (base de datos) y Vercel (alojamiento).',
          'Abogados y profesionales colaboradores de Certia Group que intervengan en tu expediente, sujetos a secreto profesional.',
          'Administraciones públicas, consulados, registros civiles y traductores jurados, solo cuando es necesario para tu trámite.',
          'Autoridades, cuando una ley lo exige.',
        ],
      ] },
      { h: '6. Transferencias internacionales', p: [
        'Algunos proveedores están en Estados Unidos. Las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. (Decisión de adecuación de la Comisión de 10 de julio de 2023) cuando el proveedor está adherido, o en cláusulas contractuales tipo de la Comisión (art. 46.2.c RGPD). Al enviarte información a Venezuela u otros países fuera de la UE, la transferencia es necesaria para ejecutar el contrato contigo o a petición tuya (art. 49.1.b RGPD).',
      ] },
      { h: '7. Cuánto tiempo los conservamos', p: [[
        'Solicitudes sin contratación: 24 meses desde el último contacto, salvo que antes pidas su supresión.',
        'Expedientes y documentación de clientes: durante la relación y después el plazo de prescripción de acciones (5 años, art. 1964 del Código Civil) y el exigido por la normativa fiscal (4 años) o de prevención del blanqueo (10 años, art. 25 Ley 10/2010) cuando aplique.',
        'Conversaciones con Diana: 12 meses.',
        'Datos de comunicaciones comerciales: hasta que retires el consentimiento o te opongas.',
        'Al terminar, los datos se bloquean (art. 32 LOPDGDD) y se suprimen cuando vencen las responsabilidades legales.',
      ]] },
      { h: '8. Tus derechos', p: [
        `Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, y retirar tu consentimiento, escribiendo a ${CO.privacyEmail} con el asunto «Protección de datos». Responderemos en un mes (ampliable dos meses en casos complejos, art. 12.3 RGPD). Si no estás conforme, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).`,
      ] },
      { h: '9. Seguridad y secreto profesional', p: [
        'Aplicamos cifrado en tránsito (HTTPS), control de accesos, enlaces de acceso con caducidad, registros de actividad y copias de seguridad. Los abogados están sujetos al secreto profesional (art. 542.3 de la Ley Orgánica del Poder Judicial y arts. 21 y 22 del Estatuto General de la Abogacía Española). Nunca te pediremos contraseñas por correo, WhatsApp ni chat.',
      ] },
      { h: '10. Menores', p: [
        'Los servicios para menores (por ejemplo, la opción de nacionalidad de un hijo) se contratan a través de sus padres o representantes legales. Los menores de 14 años no pueden facilitarnos datos directamente (art. 7 LOPDGDD).',
      ] },
    ],
  },

  cookies: {
    title: 'Política de cookies',
    summary: 'Qué cookies usamos, para qué y cómo cambiar tu elección.',
    sections: [
      { h: '1. Qué son y base legal', p: [
        'Las cookies y tecnologías similares (como el almacenamiento local) guardan información en tu navegador. Solo instalamos las técnicas sin tu consentimiento; las de analítica y publicidad solo con tu aceptación previa, conforme al artículo 22.2 de la LSSI y a la Guía sobre el uso de las cookies de la AEPD (actualizada en 2023). Puedes aceptar, rechazar o cambiar tu elección con la misma facilidad.',
      ] },
      { h: '2. Cookies que usamos', p: [[
        'Técnicas (necesarias, exentas de consentimiento): tdl_session (sesión del portal «Mi caso», 30 días), tdl_admin (acceso del equipo, 8 horas), tdl_consent (almacenamiento local que guarda tu elección de cookies), tdl_attr (almacenamiento de sesión con el origen de tu visita, que se borra al cerrar la pestaña) y las cookies de Stripe en la página de pago para prevenir el fraude.',
        'Analítica (con consentimiento): Google Analytics 4 (_ga, _ga_*), hasta 2 años. Mide visitas de forma agregada.',
        'Publicidad (con consentimiento): Google Ads (_gcl_au y similares) y Meta Pixel (_fbp), hasta 90 días. Miden la eficacia de nuestras campañas.',
      ]] },
      { h: '3. Modo de consentimiento', p: [
        'Usamos el modo de consentimiento de Google (Consent Mode v2): si rechazas, las etiquetas de Google no guardan cookies de analítica ni de publicidad y solo envían señales sin identificadores.',
      ] },
      { h: '4. Cómo cambiar tu elección', p: [
        'Usa el botón «Cambiar mi elección de cookies» de esta página o borra las cookies desde la configuración de tu navegador. Las cookies de terceros se rigen también por las políticas de Google y Meta.',
      ] },
    ],
  },

  terminos: {
    title: 'Condiciones de contratación',
    summary: 'Cómo contratas, qué incluye cada servicio, precios, pagos, citas, obligaciones de ambas partes y responsabilidad.',
    sections: [
      { h: '1. Partes y ámbito', p: [
        `Estas condiciones regulan la contratación a distancia de consultas y servicios de ${CO.brand} (${CO.name}, NIF ${CO.taxId}) a través de este sitio, correo o WhatsApp. Si eres consumidor, se aplica además el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios (Real Decreto Legislativo 1/2007, TRLGDCU). Te las enviamos por correo al contratar (art. 98.7 TRLGDCU) y puedes descargarlas desde esta página.`,
      ] },
      { h: '2. Información previa y presupuesto', p: [
        'Antes de pagar ves el servicio, su contenido, el precio total en dólares estadounidenses, los impuestos aplicables y los gastos que no incluye (tasas oficiales, traducciones juradas, apostillas, envíos y tasas consulares). Para servicios de gestión completa, el abogado te entrega una hoja de encargo con el alcance, honorarios y forma de pago, conforme al artículo 48 del Estatuto General de la Abogacía Española.',
      ] },
      { h: '3. Cómo se contrata', p: [[
        'Eliges el servicio o consulta, la fecha (en las videollamadas) y el método de pago.',
        'Aceptas estas condiciones y, si quieres que empecemos antes de 14 días, lo pides expresamente (ver la Política de reembolsos).',
        'Recibes la confirmación por correo y, si nos diste tu WhatsApp, también por ese canal.',
        'El contrato se perfecciona cuando confirmamos el pago. Guardamos el documento electrónico del contrato y puedes pedir una copia.',
      ]] },
      { h: '4. Precios y medios de pago', p: [
        'Los precios publicados son por persona y por servicio, salvo que se indique otra cosa. Aceptamos tarjeta (Stripe), Binance Pay (USDT) y Zelle. En pagos con criptomonedas el importe se fija en USDT al crear la orden; no respondemos de las comisiones o variaciones de tu proveedor. En pagos por Zelle o Binance manual, la cita se reserva provisionalmente y se confirma al recibir el pago; si no lo recibimos en 24 horas (o antes de la cita, si es urgente), la reserva puede liberarse.',
        'Por normativa de prevención del blanqueo de capitales podemos pedirte que identifiques al pagador cuando no seas tú.',
      ] },
      { h: '5. Consultas: qué incluyen', p: [[
        'Consulta exprés: respuesta escrita a una pregunta concreta en 48 horas laborables.',
        'Consulta inicial: 30 minutos de videollamada con un abogado especialista.',
        'Consulta de estrategia: 60 minutos más un informe escrito de viabilidad.',
        'Revisión documental: revisión de hasta 10 documentos e informe escrito.',
        'Consulta urgente: videollamada como mínimo 2 horas después de la reserva y, como máximo, el día hábil siguiente.',
        'El importe de la consulta se descuenta del servicio completo si lo contratas en los 30 días siguientes.',
      ]] },
      { h: '6. Citas, puntualidad y reprogramación', p: [[
        'Puedes reprogramar gratis una vez hasta 24 horas antes de la cita desde el enlace de tu correo o escribiéndonos.',
        'Si el abogado no puede atenderte, te ofrecemos otra fecha o la devolución íntegra, a tu elección.',
        'Esperamos 10 minutos. Si no te conectas y no avisas, la consulta se considera realizada, salvo causa justificada que nos comuniques en las 24 horas siguientes, en cuyo caso te ofrecemos una nueva fecha una sola vez.',
      ]] },
      { h: '7. Obligaciones del cliente', p: [
        'Facilitar información veraz y completa y documentos auténticos. La viabilidad depende de esa información: si resulta falsa o incompleta, no respondemos de las consecuencias. No grabar las consultas sin consentimiento del abogado.',
      ] },
      { h: '8. Nuestras obligaciones y alcance', p: [
        'Actuamos con la diligencia profesional exigible, con secreto profesional y libres de conflicto de intereses. Es una obligación de medios: no podemos garantizar el resultado, porque la decisión corresponde a la administración, al consulado o al tribunal, ni los plazos de esas autoridades. Los abogados cuentan con seguro de responsabilidad civil profesional, obligatorio según el Estatuto General de la Abogacía Española.',
      ] },
      { h: '9. Pre-evaluación y asistente virtual', p: [
        'El evaluador y Diana son gratuitos y orientativos, basados en tus respuestas y en la normativa vigente en su última revisión. No son asesoramiento jurídico ni generan relación profesional.',
      ] },
      { h: '10. Reclamaciones y ley aplicable', p: [
        `Si algo no ha ido bien, escríbenos a ${CO.email}; respondemos en un plazo máximo de un mes, como exige el artículo 21 del TRLGDCU. También puedes presentar una queja ante el Colegio de la Abogacía del abogado actuante. Antes de acudir a los tribunales en España, la Ley Orgánica 1/2025 exige en la mayoría de los asuntos civiles intentar un medio adecuado de solución de controversias (negociación, mediación o conciliación); te lo ofreceremos sin coste. Se aplica la ley española; si eres consumidor, son competentes los tribunales de tu domicilio cuando la ley lo establezca.`,
      ] },
    ],
  },

  reembolsos: {
    title: 'Política de reembolsos y desistimiento',
    summary: 'Cuándo puedes desistir, qué se devuelve, en qué plazo y cómo pedirlo.',
    sections: [
      { h: '1. Tu derecho de desistimiento: 14 días', p: [
        'Como consumidor que contrata a distancia, tienes 14 días naturales desde la contratación para desistir sin dar explicaciones y sin penalización (arts. 102 y 104 TRLGDCU).',
      ] },
      { h: '2. Si pides que empecemos antes', p: [
        'Muchas personas quieren su consulta en pocos días. Para empezar dentro de esos 14 días necesitamos que lo pidas expresamente al contratar (arts. 98.8 y 99.3 TRLGDCU). Entonces:',
        [
          'Si desistes antes de que prestemos el servicio, te devolvemos el 100 %.',
          'Si desistes cuando el servicio está a medias (por ejemplo, un servicio de gestión ya iniciado), pagas solo la parte proporcional ya prestada y te devolvemos el resto (art. 108.3 TRLGDCU).',
          'Una vez prestado por completo el servicio (por ejemplo, la consulta ya realizada o el informe ya entregado), no se aplica el desistimiento, siempre que hayas dado tu consentimiento expreso y reconocido que lo perdías (art. 103.a TRLGDCU).',
        ],
      ] },
      { h: '3. Nuestra política, más allá de la ley', p: [[
        'Cancelación de una consulta con más de 24 horas de antelación: reembolso del 100 % o cambio de fecha, a tu elección.',
        'Cancelación con menos de 24 horas: cambio de fecha una vez sin coste; si prefieres el reembolso, devolvemos el 50 %.',
        'Si el abogado concluye en la consulta que tu caso no es viable por la vía evaluada, te explicamos las alternativas; si decides no seguir, el importe de la consulta no es reembolsable porque el servicio se ha prestado, pero lo descontamos si contratas otra vía en 30 días.',
        'Cancelaciones o errores nuestros (cita no atendida, servicio no prestado, cobro duplicado): reembolso íntegro.',
        'Servicios de gestión con varias fases: se facturan por fases según la hoja de encargo. Si terminas el encargo, abonas las fases ejecutadas y los gastos ya desembolsados a terceros (tasas, traducciones, apostillas), que no son reembolsables una vez pagados.',
        'Servicio «Te buscamos tu beca»: no garantizamos la concesión de la beca, que decide la entidad convocante. Si no encontramos ninguna convocatoria abierta compatible con tu perfil, te devolvemos el 100 %.',
      ]] },
      { h: '4. Cómo pedirlo', p: [
        `Escribe a ${CO.email} con tu número de caso indicando que deseas desistir o cancelar. Puedes usar este modelo: «Por la presente le comunico que desisto de mi contrato de prestación del siguiente servicio: [servicio], contratado el [fecha]. Nombre: [nombre]. Caso: [número]. Fecha: [fecha]». Te confirmaremos la recepción por escrito.`,
      ] },
      { h: '5. Plazo y forma del reembolso', p: [
        'Devolvemos sin demora y, como máximo, en 14 días naturales desde que recibimos tu solicitud (art. 107 TRLGDCU), por el mismo medio de pago que usaste, salvo que acordemos otro sin coste para ti. En Binance Pay, devolvemos el importe en USDT a la cuenta de origen; en Zelle, a la cuenta emisora. Las comisiones de tu banco o plataforma no dependen de nosotros.',
      ] },
      { h: '6. Contracargos', p: [
        'Si tienes un problema con un pago, escríbenos antes de iniciar un contracargo con tu banco: lo resolvemos más rápido. Esto no limita tus derechos frente a tu entidad.',
      ] },
    ],
  },
};
