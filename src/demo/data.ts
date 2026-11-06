import { demoProject } from '../domain/demo';
import { validateProject, type Project } from '../domain/schema';

export function frontendProject(): Project {
  const p = demoProject();
  p.id = 'orglens-frontend-demo-v1';
  p.name = 'Produktmanagement';
  const rows: [string, string, 'Innen' | 'Außen', string][] = [
    [
      'PM',
      'Produktmanagement',
      'Innen',
      'Administrative Aufgaben lassen zu wenig Zeit für Marktbeobachtung.',
    ],
    [
      'Sales',
      'Vertrieb',
      'Außen',
      'Die Priorisierung von Kundenanforderungen ist nicht transparent.',
    ],
    [
      'Pre',
      'Pre-Sales',
      'Außen',
      'Technische Rückfragen kommen wiederholt ohne dokumentierten Entscheidungsweg.',
    ],
    [
      'Service',
      'Werkskundendienst',
      'Außen',
      'Erfahrungen aus Reklamationen fließen nicht systematisch ins Portfolio ein.',
    ],
    [
      'Quality',
      'Qualität',
      'Außen',
      'Für Änderungen am Produkt fehlen abgestimmte Übergabekriterien.',
    ],
    [
      'PM2',
      'Produktmanagement',
      'Innen',
      'Stammdaten werden in mehreren Systemen parallel gepflegt.',
    ],
    [
      'Dev',
      'Entwicklung',
      'Außen',
      'Die Rolle des Produktmanagements ist in frühen Phasen nicht eindeutig.',
    ],
    [
      'PM3',
      'Produktmanagement',
      'Innen',
      'Persönliche Absprachen funktionieren, werden aber selten dokumentiert.',
    ],
    ['Sales2', 'Vertrieb', 'Außen', 'Für Abkündigungen wünschen wir einen verlässlichen Vorlauf.'],
    ['Pre2', 'Pre-Sales', 'Außen', 'Wiederkehrende Fragen benötigen eine gemeinsame Wissensbasis.'],
  ];
  rows.forEach(([, department, perspective, text], i) =>
    p.statements.push({
      id: `PS-${String(i + 6).padStart(2, '0')}`,
      text,
      interview: `INT-${String(i + 5).padStart(2, '0')}`,
      department,
      perspective,
      topic: ['Kapazität', 'Portfolio', 'Entscheidungen', 'Lifecycle', 'Schnittstellen'][i % 5],
    }),
  );
  const extra = [
    [
      'Rückmeldungen aus dem Feld systematisch nutzen',
      'Erfahrungen aus Service und Qualität erreichen das Portfolio unregelmäßig.',
      'Feedback braucht einen definierten Weg in die Produktentscheidung.',
      'Einen geschlossenen Feedbackkreislauf pilotieren.',
      ['PS-09', 'PS-03'],
      ['Prozesse', 'Menschen'],
      'Feedback & Lernen',
      'Taktisch',
    ],
    [
      'Wissen unabhängig von Einzelpersonen machen',
      'Absprachen und Antworten liegen häufig bei einzelnen Personen.',
      'Individuelle Stärke ersetzt noch keinen verlässlichen gemeinsamen Prozess.',
      'Entscheidungen und wiederkehrende Antworten gemeinsam dokumentieren.',
      ['PS-13', 'PS-15', 'PS-04'],
      ['Menschen', 'Struktur'],
      'Wissen & Kompetenzen',
      'Taktisch',
    ],
    [
      'Lifecycle-Verantwortung schärfen',
      'Der Vertrieb erwartet einen verlässlichen Vorlauf bei Abkündigungen.',
      'Verantwortlichkeiten und Kommunikation müssen über den Lebenszyklus zusammenpassen.',
      'Rollen und Übergabepunkte im Lifecycle abstimmen.',
      ['PS-14', 'PS-12'],
      ['Struktur', 'Strategie'],
      'Lifecycle',
      'Strategisch',
    ],
    [
      'Marktsicht im Portfolio verankern',
      'Operative Aufgaben verdrängen die strukturierte Marktbeobachtung.',
      'Ein gemeinsamer Rhythmus könnte Marktinformationen in Entscheidungen übersetzen.',
      'Markt- und Portfolioreview in einem festen Rhythmus erproben.',
      ['PS-06', 'PS-07'],
      ['Strategie', 'Anreize'],
      'Portfoliosteuerung',
      'Strategisch',
    ],
  ] as const;
  extra.forEach(
    (
      [title, observation, interpretation, hypothesis, statementIds, dimensions, cluster, level],
      i,
    ) =>
      p.findings.push({
        id: `F-0${i + 4}`,
        title,
        observation,
        interpretation,
        hypothesis,
        statementIds: [...statementIds],
        stars: [...dimensions],
        cluster,
        level,
        released: true,
        severity: '',
        assessmentNote: '',
        assessmentRole: '',
        assessmentDate: '',
      }),
  );
  p.recommendations.push(
    {
      id: 'E-04',
      title: 'Feedbackkreislauf schließen',
      description: 'Rückmeldungen aus Service und Qualität in einem gemeinsamen Review bündeln.',
      outcome: 'Ein erprobter Weg vom Feldfeedback zur Portfolioentscheidung.',
      findingIds: ['F-04'],
      dependencies: ['E-02'],
      level: 'Taktisch',
      effort: 'Gemeinsam bewerten',
      released: true,
    },
    {
      id: 'E-05',
      title: 'Lifecycle-Rollen vereinbaren',
      description: 'Verantwortung und Kommunikation von Einführung bis Abkündigung klären.',
      outcome: 'Abgestimmte Rollen und nachvollziehbare Übergaben.',
      findingIds: ['F-06'],
      dependencies: [],
      level: 'Strategisch',
      effort: 'Gemeinsam bewerten',
      released: true,
    },
  );
  p.processes.push(
    {
      id: 'P-03',
      process: 'Abkündigung',
      step: 'Auslauf und Kommunikation steuern',
      currentRole: 'C',
      targetRole: 'A',
      current: 2,
      target: 4,
      source: 'Fiktive Einschätzung PM-Leitung',
      findingIds: ['F-06'],
      evidence: 'Rollen, Vorlauf und Kommunikationsweg werden im Pilotfall genutzt.',
    },
    {
      id: 'P-04',
      process: 'Reklamation',
      step: 'Feldfeedback ins Portfolio überführen',
      currentRole: 'I',
      targetRole: 'C',
      current: 1,
      target: 3,
      source: 'Fiktive Einschätzung PM-Leitung',
      findingIds: ['F-04'],
      evidence: 'Rückmeldungen werden im Portfolioreview nachvollziehbar berücksichtigt.',
    },
  );
  const current = [2, 2, 1, 2, 3],
    target = [4, 3, 4, 3, 4];
  p.starRatings = p.starRatings.map((r, i) => ({
    ...r,
    current: current[i],
    target: target[i],
    rationale:
      'Fiktive manuelle Beispielbewertung auf einer Demo-Skala 1–4. Kein validierter Maßstab.',
  }));
  return validateProject(p);
}

const key = 'orglens.frontend-demo.v1';
export function loadDemo(): { project: Project; message: string } {
  try {
    const raw = sessionStorage.getItem(key);
    return { project: raw ? validateProject(JSON.parse(raw)) : frontendProject(), message: '' };
  } catch {
    return {
      project: frontendProject(),
      message: 'Der Browserstand war nicht lesbar. Die fiktive Ausgangsbasis wurde geladen.',
    };
  }
}
export function storeDemo(project: Project) {
  const clean = validateProject(project);
  sessionStorage.setItem(key, JSON.stringify(clean));
}
