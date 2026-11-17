// Dumps the structured content used by the PDF guides (run: npx tsx scripts/export-content.ts out.json).
import { writeFileSync } from 'node:fs';
import { BECAS, BECA_SERVICES, CALENDAR } from '../lib/becas';
import { TREES } from '../lib/evaluators';
import { GUIDES } from '../lib/guides';

writeFileSync(process.argv[2] || 'content.json', JSON.stringify({ BECAS, BECA_SERVICES, CALENDAR, TREES, GUIDES }, null, 1));
