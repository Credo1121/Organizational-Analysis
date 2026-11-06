export type CsvRow = Record<string, string>;
export function parseCsv(input: string): { headers: string[]; rows: CsvRow[] } {
  const text = input.replace(/^\uFEFF/, '');
  if (!text.trim()) throw new Error('Die CSV-Datei ist leer.');
  const first = text.split(/\r?\n/)[0],
    delimiter = (first.match(/;/g)?.length ?? 0) > (first.match(/,/g)?.length ?? 0) ? ';' : ',';
  const records: string[][] = [];
  let row: string[] = [],
    field = '',
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (quoted || !field) quoted = !quoted;
      else throw new Error('Ungültige Anführungszeichen in der CSV.');
    } else if (c === delimiter && !quoted) {
      row.push(field);
      field = '';
    } else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (row.some((x) => x.trim())) records.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (quoted) throw new Error('Nicht geschlossene Anführungszeichen.');
  row.push(field);
  if (row.some((x) => x.trim())) records.push(row);
  const headers = (records.shift() ?? []).map((x) => x.trim());
  if (!headers.length || headers.some((x) => !x) || new Set(headers).size !== headers.length)
    throw new Error('Spaltennamen müssen ausgefüllt und eindeutig sein.');
  if (records.length > 2000) throw new Error('Maximal 2000 Zeilen pro Import.');
  return {
    headers,
    rows: records.map((r, i) => {
      if (r.length !== headers.length) throw new Error(`Zeile ${i + 2}: falsche Spaltenanzahl.`);
      return Object.fromEntries(headers.map((h, j) => [h, r[j].trim()]));
    }),
  };
}

export function detectedTerms(rows: CsvRow[], personColumn: string, manual: string): string[] {
  const terms = new Set(
    manual
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean),
  );
  for (const row of rows) {
    if (personColumn && row[personColumn] && !/^INT-\d+$/i.test(row[personColumn]))
      terms.add(row[personColumn]);
    for (const value of Object.values(row)) {
      for (const m of value.matchAll(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)) terms.add(m[0]);
      for (const m of value.matchAll(/(?:\+\d{1,3}[\s/-]?)?(?:\d[\s/-]?){8,15}\d/g))
        terms.add(m[0]);
    }
  }
  return [...terms].sort((a, b) => b.length - a.length);
}
export function replaceTerms(value: string, replacements: Record<string, string>): string {
  const keys = Object.keys(replacements)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  if (!keys.length) return value;
  const escaped = keys.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const map = new Map(keys.map((k) => [k.toLocaleLowerCase('de'), replacements[k]]));
  return value.replace(
    new RegExp(escaped.join('|'), 'giu'),
    (match) => map.get(match.toLocaleLowerCase('de')) ?? match,
  );
}
export async function fingerprint(value: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const result = await crypto.subtle.sign(
    'HMAC',
    k,
    new TextEncoder().encode(value.trim().toLocaleLowerCase('de')),
  );
  return [...new Uint8Array(result)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
