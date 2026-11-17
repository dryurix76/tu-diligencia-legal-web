import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Placeholder legal texts: the legal team must replace them before launch.
const DOCS: Record<string, { title: string; body: string[] }> = {
  privacidad: {
    title: 'Política de privacidad',
    body: [
      'Responsable: [Razón social de Tu Diligencia Legal / Certia Group], [domicilio], [correo de privacidad].',
      'Datos que tratamos: nombre, correo, teléfono/WhatsApp, país, información de tu caso que nos envías en formularios, chat y documentos.',
      'Finalidades: responder tus consultas, prestar los servicios contratados, enviarte comunicaciones sobre tu expediente y, si lo aceptas, guías y alertas.',
      'Encargados: HubSpot (CRM), Stripe (pagos), Cal.com (agenda), Meta WhatsApp Business (mensajería), Anthropic (asistente virtual), Resend (correo) y Vercel (alojamiento y archivos).',
      'Derechos: acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [correo de privacidad].',
      '[Texto completo pendiente de revisión legal (RGPD y normativa aplicable).]',
    ],
  },
  terminos: {
    title: 'Términos, reprogramación y reembolsos',
    body: [
      'Las consultas con abogado se pagan por adelantado. Su importe se descuenta del servicio si lo contratas dentro de los 30 días siguientes.',
      'Puedes reprogramar gratis hasta 24 horas antes de la cita. Si no te conectas sin avisar, la consulta se da por realizada.',
      'La pre-evaluación y el asistente virtual ofrecen orientación general y no constituyen asesoría jurídica.',
      'Los servicios se prestan con precio cerrado por escrito. Las tasas oficiales, traducciones y apostillas se cobran aparte salvo que se indique.',
      '[Texto completo pendiente de revisión legal.]',
    ],
  },
};

export function generateStaticParams() { return Object.keys(DOCS).map((doc) => ({ doc })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> { return { title: DOCS[(await params).doc]?.title }; }

export default async function Legal({ params }: { params: Promise<{ doc: string }> }) {
  const d = DOCS[(await params).doc];
  if (!d) notFound();
  return (
    <>
      <div style={{ background: '#0B1F33' }}><Header dark /></div>
      <section className="section"><div className="wrap" style={{ maxWidth: 820 }}>
        <h1 className="h2" style={{ marginBottom: 32 }}>{d.title}</h1>
        {d.body.map((p) => <p key={p}>{p}</p>)}
      </div></section>
      <Footer />
    </>
  );
}
