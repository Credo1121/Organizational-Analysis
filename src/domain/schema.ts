import { z } from 'zod';

export const stars = ['Strategie', 'Struktur', 'Prozesse', 'Anreize', 'Menschen'] as const;
export const levels = ['Operativ', 'Taktisch', 'Strategisch'] as const;
const text = z.string().max(12000);
const id = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[\p{L}\p{N}_.:-]+$/u, 'Kennung enthält unzulässige Zeichen');
const rating = z.number().int().min(1).max(4).nullable();
export const statementSchema = z
  .object({
    id,
    text: text.min(1),
    interview: z.string().min(1).max(100),
    department: z.string().max(200),
    perspective: z.enum(['Innen', 'Außen']),
    topic: z.string().max(200),
  })
  .strict();
export const findingSchema = z
  .object({
    id,
    title: z.string().min(1).max(300),
    observation: text,
    interpretation: text,
    hypothesis: text,
    statementIds: z.array(id).max(2000),
    stars: z.array(z.enum(stars)).max(5),
    cluster: z.string().max(200),
    level: z.enum(levels),
    released: z.boolean(),
    severity: z.string().max(200),
    assessmentNote: text,
    assessmentRole: z.string().max(100),
    assessmentDate: z.string().max(30),
  })
  .strict();
export const recommendationSchema = z
  .object({
    id,
    title: z.string().min(1).max(300),
    description: text,
    outcome: text,
    findingIds: z.array(id).max(2000),
    dependencies: z.array(id).max(500),
    level: z.enum(levels),
    effort: z.string().max(200),
    released: z.boolean(),
  })
  .strict();
export const processSchema = z
  .object({
    id,
    process: z.string().min(1).max(200),
    step: z.string().min(1).max(200),
    currentRole: z.enum(['R', 'A', 'C', 'I', 'Offen']),
    targetRole: z.enum(['R', 'A', 'C', 'I', 'Offen']),
    current: rating,
    target: rating,
    source: z.string().max(200),
    findingIds: z.array(id).max(2000),
    evidence: text,
  })
  .strict();
export const projectSchema = z
  .object({
    schemaVersion: z.literal(1),
    id,
    version: z.number().int().min(0),
    name: z.string().min(1).max(200),
    synthetic: z.boolean(),
    statements: z.array(statementSchema).max(2000),
    findings: z.array(findingSchema).max(2000),
    recommendations: z.array(recommendationSchema).max(500),
    processes: z.array(processSchema).max(2000),
    starRatings: z
      .array(
        z
          .object({ dimension: z.enum(stars), current: rating, target: rating, rationale: text })
          .strict(),
      )
      .length(5),
  })
  .strict();
export type Project = z.infer<typeof projectSchema>;
export type Statement = z.infer<typeof statementSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type ProcessStep = z.infer<typeof processSchema>;

export function validateProject(input: unknown): Project {
  const p = projectSchema.parse(input);
  const unique = (ids: string[]) => new Set(ids).size === ids.length;
  for (const collection of [p.statements, p.findings, p.recommendations, p.processes]) {
    if (!unique(collection.map((x) => x.id)))
      throw new Error('Doppelte Kennungen sind nicht zulässig.');
  }
  if (!unique(p.starRatings.map((x) => x.dimension)))
    throw new Error('STAR-Dimensionen müssen eindeutig sein.');
  const statementIds = new Set(p.statements.map((x) => x.id)),
    findingIds = new Set(p.findings.map((x) => x.id));
  const recIds = new Set(p.recommendations.map((x) => x.id));
  const refs = (ids: string[], known: Set<string>) => {
    if (!unique(ids) || ids.some((x) => !known.has(x)))
      throw new Error('Ungültige oder doppelte Quellenverknüpfung.');
  };
  for (const f of p.findings) {
    refs(f.statementIds, statementIds);
    if (f.released && !f.statementIds.length)
      throw new Error('Ein Finding ohne Belege kann nicht freigegeben werden.');
  }
  for (const r of p.recommendations) {
    refs(r.findingIds, findingIds);
    refs(r.dependencies, recIds);
    if (r.dependencies.includes(r.id))
      throw new Error('Eine Empfehlung kann nicht von sich selbst abhängen.');
    if (
      r.released &&
      (!r.findingIds.length ||
        r.findingIds.some((id) => !p.findings.find((f) => f.id === id)?.released))
    )
      throw new Error('Freigegebene Empfehlungen benötigen freigegebene Findings.');
  }
  for (const s of p.processes) refs(s.findingIds, findingIds);
  const visiting = new Set<string>(),
    done = new Set<string>();
  const walk = (id: string) => {
    if (visiting.has(id)) throw new Error('Zyklische Empfehlungen sind nicht zulässig.');
    if (done.has(id)) return;
    visiting.add(id);
    for (const d of p.recommendations.find((r) => r.id === id)?.dependencies ?? []) walk(d);
    visiting.delete(id);
    done.add(id);
  };
  for (const r of p.recommendations) walk(r.id);
  for (const r of p.starRatings)
    if ((r.current !== null || r.target !== null) && !r.rationale.trim())
      throw new Error('STAR-Werte benötigen eine Bewertungsgrundlage.');
  return p;
}

export function emptyProject(): Project {
  return {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    version: 0,
    name: 'Organisationsanalyse',
    synthetic: false,
    statements: [],
    findings: [],
    recommendations: [],
    processes: [],
    starRatings: stars.map((dimension) => ({
      dimension,
      current: null,
      target: null,
      rationale: '',
    })),
  };
}
