"""Builds the downloadable PDF guides into content/guides/<slug>.pdf.

Usage (from the repo root):
  npx tsx scripts/export-content.ts /tmp/content.json
  python3 scripts/build_guides.py /tmp/content.json

Content comes from lib/becas.ts, lib/evaluators.ts, lib/guides.ts and
content/services.json, so the PDFs stay in sync with the website.
"""
import json, os, sys, datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, NextPageTemplate
from reportlab.lib.styles import ParagraphStyle
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, 'scripts', 'fonts')
for name, f in [('Serif', 'Fraunces-Regular.ttf'), ('Serif-It', 'Fraunces-Italic.ttf'), ('Sans', 'InterTight-Regular.ttf'), ('Sans-Bold', 'InterTight-SemiBold.ttf'), ('Mono', 'PlexMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, f)))
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='Sans-Bold', italic='Sans', boldItalic='Sans-Bold')

INK, SAND, GREEN, RED, GOLD, MUTED = HexColor('#0B1F33'), HexColor('#F4EFE6'), HexColor('#0B7A59'), HexColor('#A3312A'), HexColor('#E8D3AE'), HexColor('#5E584E')
LIGHT = {'verde': HexColor('#12A37A'), 'ambar': HexColor('#C98A12'), 'rojo': RED}
LIGHT_TXT = {'verde': 'VIABLE', 'ambar': 'VIABLE CON PUNTOS A REVISAR', 'rojo': 'ESTA VÍA NO · HAY ALTERNATIVAS'}
SITE = os.environ.get('NEXT_PUBLIC_SITE_URL', 'https://tudiligencialegal.com').rstrip('/')
EMAIL = 'info@tudiligencialegal.com'
TODAY = 'noviembre de 2026'

def t(s):  # characters outside the embedded latin subset
    return escape(str(s)).replace('≈', 'aprox.').replace('→', '-').replace('🇪🇸', '').replace('🇵🇹', '').replace('🇮🇹', '').replace('−', '-')

S = {
    'h1': ParagraphStyle('h1', fontName='Serif', fontSize=26, leading=30, textColor=INK, spaceAfter=10),
    'h2': ParagraphStyle('h2', fontName='Serif', fontSize=17, leading=21, textColor=INK, spaceBefore=12, spaceAfter=6),
    'kicker': ParagraphStyle('k', fontName='Mono', fontSize=8.5, leading=11, textColor=GREEN, spaceAfter=4),
    'p': ParagraphStyle('p', fontName='Sans', fontSize=10, leading=14.5, textColor=INK, spaceAfter=6),
    'small': ParagraphStyle('s', fontName='Sans', fontSize=8.6, leading=12, textColor=MUTED, spaceAfter=4),
    'li': ParagraphStyle('li', fontName='Sans', fontSize=10, leading=14, textColor=INK, leftIndent=12, bulletIndent=2, spaceAfter=2),
    'cell': ParagraphStyle('c', fontName='Sans', fontSize=8.8, leading=11.5, textColor=INK),
    'cellb': ParagraphStyle('cb', fontName='Sans-Bold', fontSize=8.8, leading=11.5, textColor=INK),
}

def bullets(items, style='li'):
    return [Paragraph(t(i), S[style], bulletText='•') for i in items]

def card(flow, bg=SAND, border=None):
    tb = Table([[flow]], colWidths=[170 * mm])
    st = [('BACKGROUND', (0, 0), (-1, -1), bg), ('LEFTPADDING', (0, 0), (-1, -1), 10), ('RIGHTPADDING', (0, 0), (-1, -1), 10), ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8)]
    if border: st.append(('LINEBEFORE', (0, 0), (0, -1), 3, border))
    tb.setStyle(TableStyle(st))
    return tb

def cover(c, doc):
    w, h = A4
    c.saveState()
    c.setFillColor(INK); c.rect(0, 0, w, h, stroke=0, fill=1)
    c.setStrokeColor(HexColor('#1B3049'))
    for x in range(0, int(w), 57): c.line(x, 0, x, h)
    for y in range(0, int(h), 57): c.line(0, y, w, y)
    c.setFillColor(SAND); c.setFont('Serif', 20); c.drawString(22 * mm, h - 28 * mm, 'Tu Diligencia Legal')
    c.setFillColor(RED); c.circle(22 * mm + c.stringWidth('Tu Diligencia Legal', 'Serif', 20) + 4, h - 28 * mm + 1.5, 3.2, stroke=0, fill=1)
    c.setFillColor(HexColor('#A9B2BE')); c.setFont('Mono', 8); c.drawString(22 * mm, h - 34 * mm, 'PARTE DE CERTIA GROUP · DERECHO MIGRATORIO')
    c.setFillColor(GOLD); c.setFont('Mono', 9); c.drawString(22 * mm, 120 * mm, f'GUÍA GRATUITA · ACTUALIZADA EN {TODAY.upper()}')
    # title wrapped
    from reportlab.lib.utils import simpleSplit
    lines = simpleSplit(doc.guide_title, 'Serif', 34, w - 44 * mm)
    y = 108 * mm
    c.setFillColor(SAND); c.setFont('Serif', 34)
    for ln in lines: c.drawString(22 * mm, y, ln); y -= 40
    c.setFillColor(HexColor('#C9CFD6')); c.setFont('Sans', 11)
    for ln in simpleSplit(doc.guide_desc, 'Sans', 11, w - 44 * mm): c.drawString(22 * mm, y - 6, ln); y -= 15
    c.setFillColor(HexColor('#A9B2BE')); c.setFont('Sans', 8.5)
    c.drawString(22 * mm, 18 * mm, f'Para {doc.reader} · {SITE.replace("https://", "")} · {EMAIL}')
    c.restoreState()

def page(c, doc):
    w, h = A4
    c.saveState()
    c.setFillColor(INK); c.setFont('Serif', 10); c.drawString(20 * mm, h - 14 * mm, 'Tu Diligencia Legal')
    c.setFillColor(RED); c.circle(20 * mm + c.stringWidth('Tu Diligencia Legal', 'Serif', 10) + 2.5, h - 14 * mm + 0.8, 1.8, stroke=0, fill=1)
    c.setFillColor(MUTED); c.setFont('Mono', 7.5); c.drawRightString(w - 20 * mm, h - 14 * mm, doc.guide_title.upper()[:70])
    c.setStrokeColor(HexColor('#D9D2C5')); c.line(20 * mm, h - 17 * mm, w - 20 * mm, h - 17 * mm)
    c.setFont('Sans', 7.5); c.setFillColor(MUTED)
    c.drawString(20 * mm, 12 * mm, f'Información orientativa a {TODAY}. No sustituye el análisis de un abogado con tus documentos. {SITE.replace("https://", "")}')
    c.drawRightString(w - 20 * mm, 12 * mm, str(doc.page))
    c.restoreState()

def build(slug, title, desc, story, reader):
    out = os.path.join(ROOT, 'content', 'guides', f'{slug}.pdf')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    doc = BaseDocTemplate(out, pagesize=A4, title=title, author='Tu Diligencia Legal · Certia Group', subject=desc, leftMargin=20 * mm, rightMargin=20 * mm, topMargin=24 * mm, bottomMargin=20 * mm)
    doc.guide_title, doc.guide_desc, doc.reader = title, desc, reader
    fr = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='f')
    doc.addPageTemplates([PageTemplate(id='cover', frames=[fr], onPage=cover), PageTemplate(id='body', frames=[fr], onPage=page)])
    doc.build([NextPageTemplate('body'), PageBreak()] + story + closing())
    print('built', out)

def closing():
    links = [('Pre-evaluación gratuita', f'{SITE}/nacionalidad-espanola#evaluador'), ('Agendar consulta', f'{SITE}/agendar'), ('Tarifas', f'{SITE}/tarifas'), ('Centro de respuestas', f'{SITE}/ayuda'), ('Becas 2026', f'{SITE}/becas'), ('Mi caso', f'{SITE}/mi-caso'), ('Certia Group', 'https://certia.group')]
    rows = ''.join(f'<link href="{u}" color="#0B7A59">{t(l)}</link> &nbsp;·&nbsp; ' for l, u in links)
    return [Spacer(1, 10), card([Paragraph('¿Y AHORA?', S['kicker']), Paragraph('Tu siguiente paso', S['h2']),
        Paragraph('1. Haz la pre-evaluación gratuita: en 2 minutos te mostramos el semáforo, la vía probable y su base legal. 2. Pregunta a Diana, nuestra asistente, a cualquier hora. 3. Cuando estés listo, agenda tu consulta: se descuenta si contratas el servicio en 30 días.', S['p']),
        Paragraph(rows.rstrip(' ·&nbsp;'), S['p']), Paragraph(f'Escríbenos a <link href="mailto:{EMAIL}" color="#0B7A59">{EMAIL}</link>. Condiciones, reembolsos y privacidad en {SITE}/legal.', S['small'])])]

def tree_section(tree, skip=()):
    out = []
    for rid, r in tree['results'].items():
        if rid in skip: continue
        block = [Paragraph(f'<font color="{LIGHT[r["light"]].hexval().replace("0x", "#")}">{LIGHT_TXT[r["light"]]}</font> · CONFIANZA {t(r["confidence"]).upper()}', S['kicker']),
                 Paragraph(t(r['title']), ParagraphStyle('x', parent=S['h2'], spaceBefore=0)),
                 Paragraph(f'<b>Vía:</b> {t(r["route"])}', S['p']), Paragraph(t(r['body']), S['p']),
                 Paragraph(f'<b>Base legal:</b> {t(r["basis"])}', S['small'])]
        if r.get('pending'): block += [Paragraph('<b>A confirmar con un abogado:</b>', S['small'])] + bullets(r['pending'], 'small')
        out += [KeepTogether([card(block, bg=HexColor('#FBF8F2'), border=LIGHT[r['light']])]), Spacer(1, 7)]
    return out

def service_extras(svc):
    out = [Paragraph('Documentos', S['h2'])]
    for d in svc.get('docs', []):
        out += [Paragraph(f'<b>{t(d["head"])}</b>', S['p'])] + bullets(d['items'])
    out += [Paragraph('Precios', S['h2'])]
    data = [[Paragraph('<b>Servicio</b>', S['cell']), Paragraph('<b>Incluye</b>', S['cell']), Paragraph('<b>Precio</b>', S['cell'])]] + [[Paragraph(t(p['name']), S['cell']), Paragraph(t(p['includes']), S['cell']), Paragraph(t(p['price']), S['cellb'])] for p in svc.get('prices', [])]
    tb = Table(data, colWidths=[60 * mm, 82 * mm, 28 * mm]); tb.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.4, HexColor('#D9D2C5')), ('LINEABOVE', (0, 0), (-1, 0), 1.2, INK), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    out += [tb, Paragraph('Las consultas se pagan por adelantado y se descuentan si contratas en 30 días. Tasas oficiales, traducciones y apostillas aparte.', S['small'])]
    out += [Paragraph('Preguntas frecuentes', S['h2'])]
    for f in svc.get('faqs', []):
        out += [Paragraph(f'<b>{t(f["q"])}</b>', S['p']), Paragraph(t(f['a']), S['p'])]
    return out

def main(path):
    C = json.load(open(path))
    SV = {s['slug']: s for s in json.load(open(os.path.join(ROOT, 'content', 'services.json')))}
    G, T = C['GUIDES'], C['TREES']

    def nat(slug, svc_slug, tree, intro, mistakes, reader, skip=()):
        g = G[slug]
        story = [Paragraph('EN ESTA GUÍA', S['kicker']), Paragraph(t(g['title']), S['h1'])] + [Paragraph(t(x), S['p']) for x in intro]
        story += [Paragraph('Las vías, una por una', S['h2']), Paragraph('Cada ficha resume una situación típica con su semáforo, la base legal y lo que un abogado debe confirmar con tus documentos. Es la misma lógica de nuestra pre-evaluación gratuita.', S['p'])]
        story += tree_section(T[tree], skip)
        story += [Paragraph('Errores frecuentes que retrasan o tumban un expediente', S['h2'])] + bullets(mistakes)
        story += service_extras(SV[svc_slug])
        build(slug, g['title'], g['desc'], story, reader)

    nat('nacionalidad-espanola', 'nacionalidad-espanola', 'nacionalidad-espanola', [
        'España es el destino más pedido por los venezolanos, y con razón: hay vías por padres, abuelos, matrimonio y residencia, y como iberoamericano puedes obtener la nacionalidad con solo 2 años de residencia legal, sin renunciar a la venezolana y sin examen DELE.',
        'La Ley de Memoria Democrática cerró en octubre de 2025. Quien presentó a tiempo sigue su expediente; quien no, debe revisar la opción (art. 20 del Código Civil), la transmisión por filiación o la residencia de 1 año (art. 22.2.f) para nietos de españoles de origen.',
    ], [
        'Pedir la nacionalidad cuando ya eres español de origen: si tu padre o madre era español al nacer tú, basta inscribir el nacimiento.',
        'Dejar pasar los 20 años en la opción por patria potestad (art. 20.1.a).',
        'No revisar si algún eslabón de la familia se naturalizó antes de tener hijos (art. 24 CC).',
        'Contar como residencia periodos con estancia por estudios sin revisarlos antes de presentar.',
        'Presentar partidas sin apostillar, con datos que no coinciden entre generaciones o sin notas marginales.',
        'Antecedentes penales caducados al momento de presentar.',
    ], 'venezolanos con raíces o vida en España', skip=('estrategia',))

    nat('italia-2025', 'nacionalidad-italiana', 'nacionalidad-italiana', [
        'La Ley 74/2025, en vigor desde el 24 de mayo de 2025, cambió las reglas: quien nació fuera de Italia y tiene otra nacionalidad ya no es italiano automáticamente, salvo excepciones. La principal es tener un padre, madre, abuelo o abuela que tenga, o tuviera al morir, solo la ciudadanía italiana; otra es que el padre o la madre ciudadano viviera dos años seguidos en Italia antes del nacimiento. La Corte Constitucional avaló la reforma en la sentencia 63/2026.',
        'Los trámites iniciados hasta el 27 de marzo de 2025 a las 23:59 (hora de Roma), con cita comunicada, solicitud o demanda, siguen las reglas anteriores. Además, la naturalización de descendientes de italianos por nacimiento baja a 2 años de residencia en Italia, y quien nació en Italia puede readquirir la ciudadanía hasta el 31 de diciembre de 2027.',
    ], [
        'Dar por hecho que un abuelo nacido en Italia basta: la excepción exige que el padre, madre, abuelo o abuela tenga o tuviera solo la ciudadanía italiana.',
        'No obtener la constancia de no naturalización (o su fecha) del emigrante.',
        'Presentar actas venezolanas con nombres italianos mal transcritos sin rectificar.',
        'Ignorar la línea materna anterior a 1948, que solo prospera por vía judicial.',
        'Traducciones al italiano no certificadas o apostillas sobre la copia equivocada.',
    ], 'venezolanos de origen italiano')

    nat('portugal-2026', 'nacionalidad-portuguesa', 'nacionalidad-portuguesa', [
        'La Lei Orgânica 1/2026, publicada el 18 de mayo de 2026 y en vigor desde el 19 de mayo, endureció la ley de nacionalidad portuguesa. Los hijos de portugueses mantienen su vía. Los nietos deben probar lazos efectivos con la comunidad portuguesa, conocimiento de la lengua y la cultura, y antecedentes limpios.',
        'Los bisnietos tienen una nueva vía por naturalización, pero con 5 años de residencia legal en Portugal. La naturalización por residencia pasa a 7 años para nacionales de la CPLP y la UE, y a 10 años para el resto. Los expedientes pendientes al 19 de mayo de 2026 siguen la ley anterior.',
    ], [
        'Empezar por el nieto cuando el padre o la madre puede pedirla primero como hijo, más rápido y sin requisitos de vínculo.',
        'No comprobar si el abuelo perdió la nacionalidad (por ejemplo, al naturalizarse antes de 1981).',
        'Presentar la vía de nietos sin pruebas reales de vínculo ni certificado de idioma.',
        'No transcribir el matrimonio de los padres en el registro portugués.',
    ], 'venezolanos lusodescendientes')

    nat('visados', 'visados', 'visados', [
        'Si no tienes ascendencia europea, el camino empieza con un visado. En España, además, cada año de residencia legal cuenta para la nacionalidad, que los venezolanos pueden pedir con 2 años.',
        'Los umbrales de ingresos son orientativos y se actualizan cada año: el visado de teletrabajo español pide alrededor del 200 % del salario mínimo; la residencia no lucrativa, el 400 % del IPREM; la D7 portuguesa, al menos el salario mínimo portugués; la D8, unas 4 veces el salario mínimo portugués.',
    ], [
        'Pasaporte con poca vigencia: muchos consulados piden 12 meses.',
        'Extractos bancarios sin historial suficiente o con ingresos de origen no demostrable.',
        'Seguros médicos con copagos o carencias cuando el visado exige cobertura completa.',
        'Antecedentes penales sin apostillar o vencidos.',
        'Entrar como turista con intención de quedarse sin conocer los requisitos del arraigo.',
    ], 'venezolanos que quieren vivir en Europa')

    # Becas
    g = G['becas-2026']
    st = [Paragraph('EN ESTA GUÍA', S['kicker']), Paragraph(t(g['title']), S['h1']),
          Paragraph('Las becas para estudiar en Europa existen, pero se ganan con meses de antelación y con una solicitud impecable. Esta guía reúne las convocatorias más útiles para venezolanos en España, Portugal e Italia en el curso 2026-2027, con lo que cubren, sus plazos, el coste real de estudiar en cada país y los enlaces oficiales.', S['p']),
          Paragraph('Calendario anual de convocatorias', S['h2'])]
    cal = Table([[Paragraph(f'<b>{t(a)}</b>', S['cell']), Paragraph(t(b), S['cell'])] for a, b in C['CALENDAR']], colWidths=[40 * mm, 130 * mm])
    cal.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.4, HexColor('#D9D2C5')), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    st.append(cal)
    for c in C['BECAS']:
        st += [PageBreak(), Paragraph(f'BECAS EN {t(c["name"]).upper()}', S['kicker']), Paragraph(f'Estudiar en {t(c["name"])}', S['h1']), Paragraph(t(c['intro']), S['p'])]
        for b in c['becas']:
            st += [KeepTogether([card([Paragraph(t(b['level']).upper(), S['kicker']), Paragraph(t(b['name']), ParagraphStyle('x', parent=S['h2'], spaceBefore=0)),
                Paragraph(f'<b>Para quién:</b> {t(b["who"])}', S['p']), Paragraph(f'<b>Qué cubre:</b> {t(b["covers"])}', S['p']), Paragraph(f'<b>Importe:</b> {t(b["amount"])}', S['p']),
                Paragraph(f'<b>Última convocatoria:</b> {t(b["window"])} · <b>Próxima:</b> {t(b["next"])}', S['p']), Paragraph(f'<link href="{b["url"]}" color="#0B7A59">{t(b["url"])}</link>', S['small'])], bg=HexColor('#FBF8F2'), border=GREEN)]), Spacer(1, 6)]
        st += [Paragraph('Cuánto cuesta', S['h2'])]
        tb = Table([[Paragraph(t(a), S['cellb']), Paragraph(t(b), S['cell'])] for a, b in c['costs']], colWidths=[75 * mm, 95 * mm])
        tb.setStyle(TableStyle([('LINEBELOW', (0, 0), (-1, -1), 0.4, HexColor('#D9D2C5')), ('LINEABOVE', (0, 0), (-1, 0), 1.2, INK), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
        st += [tb, Spacer(1, 6), card([Paragraph(f'<b>Nuestro consejo:</b> {t(c["tip"])}', S['p'])])]
    st += [PageBreak(), Paragraph('SERVICIO', S['kicker']), Paragraph('Te buscamos tu beca', S['h1']),
           Paragraph('Trabajamos con especialistas en admisiones y becas internacionales. Si consigues la admisión, también tramitamos tu visado de estudios.', S['p'])]
    for s in C['BECA_SERVICES']:
        st += [KeepTogether([card([Paragraph(f'USD {s["usd"]}', S['kicker']), Paragraph(t(s['name']), ParagraphStyle('x', parent=S['h2'], spaceBefore=0)), Paragraph(t(s['desc']), S['p'])] + bullets(s['items']))]), Spacer(1, 6)]
    st += [Paragraph('Checklist para cualquier beca', S['h2'])] + bullets(['Título y notas certificadas y apostilladas (y, si aplica, traducidas).', 'Pasaporte vigente durante todo el curso.', 'CV en formato europeo (Europass) de 2 páginas como máximo.', 'Carta de motivación específica para cada programa: por qué ese máster, por qué tú y qué harás después.', '2 cartas de recomendación de profesores o jefes.', 'Certificado de idioma (inglés B2/C1 o italiano/portugués según el programa).', 'En Italia: documentos de ingresos y patrimonio familiar del último año para el ISEE parificato.', 'Medios económicos o carta de beca para el visado de estudios.'])
    st += [Paragraph('Todas las cifras proceden de las convocatorias oficiales 2026-2027 o de las webs de las universidades citadas. Las convocatorias cambian cada año: confirma siempre en la web oficial antes de presentar.', S['small'])]
    build('becas-2026', g['title'], g['desc'], st, 'estudiantes venezolanos')

    # Apostillas
    g = G['apostillas']
    st = [Paragraph('EN ESTA GUÍA', S['kicker']), Paragraph(t(g['title']), S['h1']),
          Paragraph('Casi todos los expedientes de nacionalidad y visado dependen de documentos venezolanos: partidas de nacimiento, actas de matrimonio, títulos y antecedentes penales. Un error en un documento puede costar meses. Esta guía resume el orden correcto.', S['p']),
          Paragraph('1. Qué es la apostilla', S['h2']), Paragraph('Venezuela, España, Portugal, Italia, Alemania, Croacia y el Reino Unido forman parte del Convenio de La Haya de 1961. La apostilla certifica la firma del funcionario que emitió el documento, de modo que el país de destino lo acepta sin legalización consular. En Venezuela la emite el Ministerio del Poder Popular para Relaciones Exteriores a través de su sistema de legalización y apostilla electrónica.', S['p']),
          Paragraph('2. El orden correcto', S['h2'])] + bullets([
          'Pide el documento original actualizado (partida o acta certificada reciente, con todas sus notas marginales).',
          'Comprueba que nombres, apellidos, fechas y lugares coinciden en toda la línea familiar. Si no, primero se rectifica.',
          'Si el documento requiere firma previa de otra autoridad (por ejemplo, títulos universitarios), complétala antes.',
          'Apostilla el documento.',
          'Traduce si el destino lo exige: Italia pide traducción al italiano; en Portugal y otros países la exigencia depende del registro. España no exige traducción de documentos en castellano.',
          'Guarda copias digitales de todo y controla las fechas de caducidad.']) + [
          Paragraph('3. Qué documentos suelen pedir', S['h2'])] + bullets([
          'Nacionalidad por ascendencia: partidas de nacimiento de cada generación, actas de matrimonio y, en su caso, de defunción.',
          'Nacionalidad por residencia y visados: partida de nacimiento y antecedentes penales.',
          'Estudios y becas: título y notas certificadas.',
          'Reagrupación familiar: actas de matrimonio y nacimiento que prueben el parentesco.']) + [
          Paragraph('4. Errores frecuentes', S['h2'])] + bullets([
          'Apostillar una copia simple en vez del documento certificado que pide el registro.',
          'Antecedentes penales caducados: muchos organismos solo los aceptan si son recientes (habitualmente de 3 a 6 meses).',
          'Diferencias de una letra en apellidos o nombres entre generaciones.',
          'Partidas antiguas sin las notas marginales (reconocimientos, matrimonios, rectificaciones).',
          'Traducciones hechas por traductores no reconocidos en el país de destino.']) + [
          Paragraph('5. Cómo te ayudamos', S['h2']), Paragraph('Revisamos tus documentos antes de apostillar (revisión documental, USD 150, hasta 10 documentos), gestionamos apostillas (USD 60 por documento), traducciones juradas (desde USD 35 por página) y búsqueda de actas en Europa (USD 180 por acta).', S['p'])]
    build('apostillas', g['title'], g['desc'], st, 'venezolanos que preparan su expediente')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '/tmp/content.json')
