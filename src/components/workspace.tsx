'use client';
import { useEffect, useState } from 'react';
import {
  stars,
  type Project,
  type Finding,
  type Recommendation,
  type ProcessStep,
} from '@/domain/schema';
import { api, download } from './api';
import { Radar } from './radar';
import { Modal } from './modal';
import { Importer } from './importer';
import { FindingEditor, RecommendationEditor, ProcessEditor } from './editors';

type Page =
  'overview' | 'sources' | 'findings' | 'perspectives' | 'processes' | 'recommendations' | 'report';
const pages: { id: Page; label: string; icon: string }[] = [
  { id: 'overview', label: 'Überblick', icon: '◫' },
  { id: 'sources', label: 'Daten & Quellen', icon: '▤' },
  { id: 'findings', label: 'Findings & Cluster', icon: '◇' },
  { id: 'perspectives', label: 'Innen / Außen', icon: '⇄' },
  { id: 'processes', label: 'Prozesse & RACI', icon: '⌘' },
  { id: 'recommendations', label: 'Empfehlungen', icon: '→' },
  { id: 'report', label: 'Ergebnisbericht', icon: '▧' },
];
const identifier = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
export function Workspace() {
  const [session, setSession] = useState<{ authenticated: boolean; configured: boolean } | null>(
      null,
    ),
    [project, setProject] = useState<Project | null>(null);
  const [password, setPassword] = useState(''),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [pending, setPending] = useState(false);
  const [page, setPage] = useState<Page>('overview'),
    [importing, setImporting] = useState(false),
    [search, setSearch] = useState(''),
    [star, setStar] = useState<string>('Alle'),
    [side, setSide] = useState('Alle');
  const [finding, setFinding] = useState<Finding | null>(null),
    [recommendation, setRecommendation] = useState<Recommendation | null>(null),
    [process, setProcess] = useState<ProcessStep | null>(null);
  const [ratings, setRatings] = useState<Project['starRatings'] | null>(null),
    [releasedSources, setReleasedSources] = useState(false);
  const [priorityFile, setPriorityFile] = useState<{
      projectId: string;
      version: number;
      order: string[];
      confirmed?: boolean;
    } | null>(null),
    [restore, setRestore] = useState<unknown>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  useEffect(() => {
    void api<{ authenticated: boolean; configured: boolean }>('session')
      .then(async (s) => {
        setSession(s);
        if (s.authenticated) setProject(await api<Project>('project'));
      })
      .catch((e) => setError(e.message));
  }, []);
  async function run(action: () => Promise<void>) {
    setPending(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }
  async function persist(next: Project) {
    const saved = await api<Project>('project', 'PUT', next);
    setProject(saved);
    setNotice('Änderungen lokal gespeichert.');
    setReleasedSources(false);
  }
  function editFinding() {
    setFinding({
      id: identifier('F'),
      title: 'Neues Finding',
      observation: '',
      interpretation: '',
      hypothesis: '',
      statementIds: [],
      stars: [],
      cluster: '',
      level: 'Operativ',
      released: false,
      severity: '',
      assessmentNote: '',
      assessmentRole: '',
      assessmentDate: '',
    });
  }
  function editRecommendation() {
    setRecommendation({
      id: identifier('E'),
      title: 'Neue Empfehlung',
      description: '',
      outcome: '',
      findingIds: [],
      dependencies: [],
      level: 'Operativ',
      effort: '',
      released: false,
    });
  }
  function editProcess() {
    setProcess({
      id: identifier('P'),
      process: 'Produktentstehung',
      step: 'Neuer Prozessschritt',
      currentRole: 'Offen',
      targetRole: 'Offen',
      current: null,
      target: null,
      source: '',
      findingIds: [],
      evidence: '',
    });
  }
  function navigate(id: Page) {
    setPage(id);
    setImporting(false);
    setError('');
    setNotice('');
    setSearch('');
  }
  async function loadJson(file: File | undefined, kind: 'priority' | 'backup') {
    if (!file) return;
    await run(async () => {
      if (file.size > 2 * 1024 * 1024) throw new Error('Maximal 2 MiB pro Datei.');
      const data = JSON.parse(await file.text());
      if (kind === 'priority') {
        if (
          !data ||
          typeof data.projectId !== 'string' ||
          !Number.isInteger(data.version) ||
          !Array.isArray(data.order) ||
          data.order.some((x: unknown) => typeof x !== 'string')
        )
          throw new Error('Ungültige Priorisierungsdatei.');
        setPriorityFile(data);
      } else setRestore(data);
    });
  }
  if (!session || (session.authenticated && !project))
    return (
      <div className="loading">
        <span className="brand-symbol">◈</span>
        <p>{error || 'Lokaler Arbeitsbereich wird geladen …'}</p>
        {error && <button onClick={() => location.reload()}>Erneut versuchen</button>}
      </div>
    );
  if (!session.authenticated)
    return (
      <main className="login-layout">
        <section className="login-story">
          <div className="brand">
            <span className="brand-symbol">◈</span> OrgLens
          </div>
          <div>
            <div className="eyebrow">Organisation verstehen. Veränderung ermöglichen.</div>
            <h1>
              Aus Perspektiven
              <br />
              wird ein klares Bild.
            </h1>
            <p>Dein lokaler Arbeitsbereich für nachvollziehbare Organisationsanalysen.</p>
          </div>
          <span className="small muted">
            Lokal gespeichert · Manuell steuerbar · Quellenbasiert
          </span>
        </section>
        <section className="login-card">
          <span className="status">
            <i />
            Lokaler Einzelplatz
          </span>
          <h2>Willkommen zurück.</h2>
          <p className="muted">Melde dich an, um deine Analyse fortzusetzen.</p>
          {!session.configured && (
            <p className="notice">
              Zugang noch nicht eingerichtet. Im Terminal zuerst <code>npm run setup:local</code>{' '}
              ausführen und ein eigenes Passwort vergeben.
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await api('session', 'POST', { password });
                setPassword('');
                setSession({ authenticated: true, configured: true });
                setProject(await api<Project>('project'));
              });
            }}
          >
            <label>
              Lokales Passwort
              <input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="primary wide" disabled={pending || !session.configured}>
              {pending ? 'Anmeldung …' : 'Arbeitsbereich öffnen'} <span>→</span>
            </button>
          </form>
          <p className="small muted">
            Kein Cloud-Konto. Dieses Login schützt den App-Zugriff; es verschlüsselt keine Dateien
            auf deinem Rechner.
          </p>
        </section>
      </main>
    );
  const p = project!;
  const filtered = p.findings.filter(
    (f) =>
      (star === 'Alle' || f.stars.includes(star as (typeof stars)[number])) &&
      `${f.title} ${f.cluster} ${f.observation}`.toLowerCase().includes(search.toLowerCase()),
  );
  const statements = p.statements.filter(
    (s) =>
      (side === 'Alle' || s.perspective === side) &&
      `${s.text} ${s.interview} ${s.department}`.toLowerCase().includes(search.toLowerCase()),
  );
  const updateList = <T extends { id: string }>(items: T[], item: T) =>
    items.some((x) => x.id === item.id)
      ? items.map((x) => (x.id === item.id ? item : x))
      : [...items, item];
  const move = (id: string, delta: number) => {
    const index = p.recommendations.findIndex((r) => r.id === id);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= p.recommendations.length) return;
    const list = [...p.recommendations];
    [list[index], list[next]] = [list[next], list[index]];
    void run(() => persist({ ...p, recommendations: list }));
  };
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate('overview');
          }}
        >
          <span className="brand-symbol">◈</span>OrgLens<span className="beta">POC</span>
        </a>
        <div className="sidebar-caption">ARBEITSBEREICH</div>
        <nav aria-label="Hauptnavigation">
          {pages.map((item) => (
            <button
              key={item.id}
              aria-current={page === item.id ? 'page' : undefined}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
              {item.id === 'sources' && p.statements.length > 0 && (
                <small>{p.statements.length}</small>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="status">
            <i />
            Lokal verbunden
          </span>
          <p>
            Deine Daten bleiben hier.
            <br />
            <span className="small">KI-Gateway nicht angebunden.</span>
          </p>
          <button
            className="text-button"
            onClick={() =>
              void run(async () => {
                await api('session', 'DELETE');
                setProject(null);
                setSession({ authenticated: false, configured: true });
              })
            }
          >
            Abmelden →
          </button>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div>
            <span className="muted">Analyse / </span>
            {pages.find((x) => x.id === page)?.label}
          </div>
          <div className="topbar-right">
            {p.synthetic && <span className="badge">Fiktive Beispieldaten</span>}
            <span className="avatar" title="Lokaler Beraterzugang">
              B
            </span>
          </div>
        </header>
        <main className="main-content">
          <div className="project-line">
            <span className="eyebrow">{p.name}</span>
            <span className="small muted">Lokal gespeichert · Version {p.version}</span>
          </div>
          {error && (
            <div role="alert" className="error banner">
              {error}
              <button
                onClick={() =>
                  void run(async () => {
                    setProject(await api<Project>('project'));
                    setNotice('Aktueller Stand geladen.');
                  })
                }
              >
                Aktuellen Stand laden
              </button>
            </div>
          )}
          {notice && (
            <div role="status" className="success">
              {notice}
            </div>
          )}
          {page === 'overview' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Organisation verstehen.</h1>
                  <p className="muted">
                    Perspektiven verbinden. Handlungsspielräume sichtbar machen.
                  </p>
                </div>
                <button onClick={() => setRatings(structuredClone(p.starRatings))}>
                  Bewertungen bearbeiten <span>→</span>
                </button>
              </div>
              <div className="metrics">
                <div>
                  <strong>{p.statements.length}</strong>
                  <span>Problem Statements</span>
                </div>
                <div>
                  <strong>{new Set(p.statements.map((s) => s.interview)).size}</strong>
                  <span>Interviewquellen</span>
                </div>
                <div>
                  <strong>{p.findings.length}</strong>
                  <span>Verdichtete Findings</span>
                </div>
                <div>
                  <strong>{p.processes.length}</strong>
                  <span>Prozessschritte</span>
                </div>
              </div>
              <div className="overview-grid">
                <section className="panel radar-panel">
                  <div className="section-heading">
                    <div>
                      <div className="eyebrow">STAR-MODELL</div>
                      <h2>Das Gesamtbild.</h2>
                    </div>
                    <span className="badge subtle">Ist & Ziel</span>
                  </div>
                  <Radar project={p} />
                  <div className="dimension-list">
                    {p.starRatings.map((r) => (
                      <button
                        key={r.dimension}
                        onClick={() => {
                          setStar(r.dimension);
                          navigate('findings');
                        }}
                      >
                        <span>{r.dimension}</span>
                        <span className="muted">
                          {r.current ?? '—'} <span className="arrow">→</span> {r.target ?? '—'}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="small muted">
                    Offene Dimensionen bleiben unbewertet. Bewertungsgrundlage und Begründung werden
                    manuell festgehalten.
                  </p>
                </section>
                <section>
                  <div className="section-heading">
                    <div>
                      <div className="eyebrow">VON DER BEOBACHTUNG ZUM HANDELN</div>
                      <h2>Was bewegt das Team?</h2>
                    </div>
                  </div>
                  {p.findings.slice(0, 3).map((f, i) => (
                    <article className="insight-card" key={f.id}>
                      <div className="insight-top">
                        <span className="number">0{i + 1}</span>
                        <span className="small muted">
                          {f.level} · {f.released ? 'Zur Diskussion' : 'Entwurf'}
                        </span>
                      </div>
                      <button className="title-button" onClick={() => setFinding(f)}>
                        {f.title}
                        <span>→</span>
                      </button>
                      <p>{f.observation}</p>
                      <div className="insight-footer">
                        <span>{f.statementIds.length} Belege</span>
                        <span>{f.stars.join(' · ') || 'Zuordnung offen'}</span>
                      </div>
                    </article>
                  ))}
                  {!p.findings.length && (
                    <div className="empty-card">
                      <span className="empty-symbol">◇</span>
                      <h3>Hier entsteht dein Gesamtbild.</h3>
                      <p className="muted">
                        Beginne mit deinen Quellen oder erkunde den Arbeitsablauf mit vollständig
                        erfundenen Beispieldaten.
                      </p>
                      <button className="primary" onClick={() => navigate('sources')}>
                        Quellen importieren
                      </button>
                      <button
                        className="text-button"
                        disabled={pending}
                        onClick={() =>
                          void run(async () => {
                            setProject(await api<Project>('demo', 'POST', {}));
                            setNotice(
                              'Synthetisches Demonstrationsprojekt geladen. Alle Angaben sind fiktiv.',
                            );
                          })
                        }
                      >
                        Fiktive Demo laden →
                      </button>
                    </div>
                  )}
                  <div className="quiet-card">
                    <span className="badge">Deine fachliche Kontrolle</span>
                    <p>
                      Quellen bleiben nachvollziehbar. Findings und Empfehlungen kannst du jederzeit
                      manuell bearbeiten.
                    </p>
                    <button className="text-button" onClick={() => navigate('report')}>
                      Ergebnisbericht vorbereiten →
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}
          {page === 'sources' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Die Grundlage deiner Analyse.</h1>
                  <p className="muted">
                    Pseudonymisierte Aussagen. Klare Herkunft. Nachvollziehbare Belege.
                  </p>
                </div>
                {!importing && (
                  <button className="primary" onClick={() => setImporting(true)}>
                    + CSV importieren
                  </button>
                )}
              </div>
              {importing ? (
                <section className="panel">
                  <Importer
                    project={p}
                    onImported={(next) => {
                      setProject(next);
                      setImporting(false);
                      setReleasedSources(false);
                      setNotice('Bereinigte Daten erfolgreich importiert.');
                    }}
                    onCancel={() => setImporting(false)}
                  />
                </section>
              ) : (
                <>
                  <div className="toolbar">
                    <input
                      aria-label="Quellen durchsuchen"
                      placeholder="Aussagen, Quellen oder Bereiche suchen …"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                      aria-label="Quellenperspektive"
                      value={side}
                      onChange={(e) => setSide(e.target.value)}
                    >
                      {['Alle', 'Innen', 'Außen'].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                    <span className="muted small">{statements.length} Aussagen</span>
                  </div>
                  <section className="panel flush">
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>ID / Quelle</th>
                            <th>Problem Statement</th>
                            <th>Perspektive</th>
                            <th>Themenfeld</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statements.map((s) => (
                            <tr key={s.id}>
                              <td>
                                <strong>{s.id}</strong>
                                <small>{s.interview}</small>
                              </td>
                              <td className="statement-cell">
                                {s.text}
                                <small>{s.department}</small>
                              </td>
                              <td>
                                <span className="badge subtle">{s.perspective}</span>
                              </td>
                              <td>{s.topic || <span className="muted">Zu prüfen</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!statements.length && (
                      <p className="empty-message">
                        Keine passenden Aussagen. CSV importieren oder Filter ändern.
                      </p>
                    )}
                  </section>
                  <p className="muted small">
                    Originaldateien werden nicht verändert. Mehrere Quellen können im Finding
                    verknüpft werden.
                  </p>
                </>
              )}
            </>
          )}
          {page === 'findings' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Aus Aussagen werden Findings.</h1>
                  <p className="muted">
                    Beobachtung, Interpretation und Hypothese bleiben getrennt.
                  </p>
                </div>
                <button className="primary" onClick={editFinding}>
                  + Finding erstellen
                </button>
              </div>
              <div className="toolbar">
                <input
                  aria-label="Findings durchsuchen"
                  placeholder="Finding oder Cluster suchen …"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  aria-label="STAR-Dimension filtern"
                  value={star}
                  onChange={(e) => setStar(e.target.value)}
                >
                  {['Alle', ...stars].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="finding-grid">
                {filtered.map((f) => (
                  <article key={f.id} className="panel finding-card">
                    <div className="section-heading">
                      <span className="badge">
                        {f.id} · {f.level}
                      </span>
                      <button className="text-button" onClick={() => setFinding(f)}>
                        Bearbeiten →
                      </button>
                    </div>
                    <h2>{f.title}</h2>
                    <p>{f.observation}</p>
                    <div className="tag-row">
                      {f.stars.map((s) => (
                        <span className="tag" key={s}>
                          {s}
                        </span>
                      ))}
                      {f.cluster && <span className="tag">Cluster: {f.cluster}</span>}
                    </div>
                    <details>
                      <summary>Interpretation & Belege</summary>
                      <p>{f.interpretation}</p>
                      <p>
                        <strong>Hypothese:</strong> {f.hypothesis}
                      </p>
                      {p.statements
                        .filter((s) => f.statementIds.includes(s.id))
                        .map((s) => (
                          <div className="source-note" key={s.id}>
                            <strong>
                              {s.id} · {s.interview} · {s.perspective}
                            </strong>
                            <p>{s.text}</p>
                          </div>
                        ))}
                    </details>
                    <div className="insight-footer">
                      <span>
                        {f.released ? 'Zur Diskussion freigegeben' : 'Entwurf'} ·{' '}
                        {f.statementIds.length} Belege
                      </span>
                      <span>{f.severity || 'Schwere offen'}</span>
                    </div>
                  </article>
                ))}
              </div>
              {!filtered.length && (
                <div className="empty-card">
                  <h3>Noch keine passenden Findings.</h3>
                  <p>Erstelle ein Finding und verknüpfe die zugrunde liegenden Aussagen.</p>
                </div>
              )}
            </>
          )}
          {page === 'perspectives' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Selbstbild trifft Erwartung.</h1>
                  <p className="muted">
                    Innen- und Außensicht pro Finding vergleichen, ohne Unterschiede zu glätten.
                  </p>
                </div>
              </div>
              {p.findings.map((f) => (
                <section className="panel" key={f.id}>
                  <div className="section-heading">
                    <h2>{f.title}</h2>
                    <button className="text-button" onClick={() => setFinding(f)}>
                      Finding prüfen →
                    </button>
                  </div>
                  <div className="perspective-grid">
                    {(['Innen', 'Außen'] as const).map((perspective) => {
                      const sources = p.statements.filter(
                        (s) => f.statementIds.includes(s.id) && s.perspective === perspective,
                      );
                      return (
                        <div key={perspective}>
                          <div className="perspective-label">
                            {perspective === 'Innen'
                              ? 'INNEN · PRODUKTMANAGEMENT'
                              : 'AUSSEN · SCHNITTSTELLEN'}
                          </div>
                          {sources.map((s) => (
                            <blockquote key={s.id}>
                              <p>{s.text}</p>
                              <cite>
                                {s.id} · {s.interview} · {s.department}
                              </cite>
                            </blockquote>
                          ))}
                          {!sources.length && (
                            <p className="muted">
                              Keine Belege aus dieser Perspektive. Keine Zustimmung ableitbar.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="muted small">
                    {f.statementIds.length} Erwähnungen ·{' '}
                    {
                      new Set(
                        p.statements
                          .filter((s) => f.statementIds.includes(s.id))
                          .map((s) => s.interview),
                      ).size
                    }{' '}
                    Interviewquellen · keine automatische Aussage über Schwere oder Kausalität.
                  </p>
                </section>
              ))}
              {!p.findings.length && (
                <p className="empty-card">Zunächst Findings mit Quellen verknüpfen.</p>
              )}
            </>
          )}
          {page === 'processes' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Verantwortung braucht Klarheit.</h1>
                  <p className="muted">Prozessschritte, RACI und Reifegrad gemeinsam betrachten.</p>
                </div>
                <button className="primary" onClick={editProcess}>
                  + Prozessschritt
                </button>
              </div>
              <p className="hint">
                Reifegrad: 1 Personenabhängig · 2 Teilweise etabliert · 3 Prozess genutzt · 4
                Etabliert und entscheidungswirksam
              </p>
              {p.processes.map((s) => (
                <section className="panel process-card" key={s.id}>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">{s.process}</span>
                      <h2>{s.step}</h2>
                    </div>
                    <button onClick={() => setProcess(s)}>Bearbeiten →</button>
                  </div>
                  <div className="process-metrics">
                    <div>
                      <span className="muted small">PM-Verantwortung</span>
                      <strong>
                        {s.currentRole} <span>→</span> {s.targetRole}
                      </strong>
                    </div>
                    <div>
                      <span className="muted small">Prozessreife · Ist → Ziel</span>
                      <div className="maturity-track">
                        {[1, 2, 3, 4].map((n) => (
                          <span
                            key={n}
                            className={`${s.current === n ? 'is-current' : ''} ${s.target === n ? 'is-target' : ''}`}
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="muted small">
                    Quelle: {s.source || 'Noch zu dokumentieren'} · Ist {s.current ?? 'offen'} /
                    Ziel {s.target ?? 'offen'}
                  </p>
                  <details>
                    <summary>Findings und Nachweis für Zielreife</summary>
                    <p>{s.evidence || 'Nachweise noch zu vereinbaren.'}</p>
                    {s.findingIds.map((id) => (
                      <button
                        key={id}
                        className="text-button"
                        onClick={() => setFinding(p.findings.find((f) => f.id === id)!)}
                      >
                        {id} · {p.findings.find((f) => f.id === id)?.title} →
                      </button>
                    ))}
                  </details>
                </section>
              ))}
              {!p.processes.length && (
                <div className="empty-card">
                  <h3>Prozesssicht aufbauen.</h3>
                  <p>RACI per CSV importieren oder den ersten Prozessschritt manuell anlegen.</p>
                  <button
                    onClick={() => {
                      navigate('sources');
                      setImporting(true);
                    }}
                  >
                    Zum CSV-Import
                  </button>
                </div>
              )}
            </>
          )}
          {page === 'recommendations' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Was gehen wir zuerst an?</h1>
                  <p className="muted">Deine Empfehlungen. Eine bewusste Reihenfolge.</p>
                </div>
                <button className="primary" onClick={editRecommendation}>
                  + Empfehlung erstellen
                </button>
              </div>
              <div className="notice">
                Schwere, Aufwand und Priorität sind unterschiedliche Bewertungen. Abhängigkeiten
                bleiben beim Umsortieren erhalten.
              </div>
              <div className="backlog">
                {p.recommendations.map((r, i) => (
                  <article
                    key={r.id}
                    className="panel recommendation-row"
                    draggable
                    onDragStart={() => setDragged(r.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!dragged || dragged === r.id || pending) return;
                      const list = p.recommendations.filter((x) => x.id !== dragged);
                      list.splice(
                        list.findIndex((x) => x.id === r.id),
                        0,
                        p.recommendations.find((x) => x.id === dragged)!,
                      );
                      void run(() => persist({ ...p, recommendations: list }));
                      setDragged(null);
                    }}
                  >
                    <span className="grip" aria-hidden="true">
                      ⠿
                    </span>
                    <span className="rank">{String(i + 1).padStart(2, '0')}</span>
                    <div className="recommendation-main">
                      <div className="tag-row">
                        <span className="badge subtle">{r.level}</span>
                        <span className="small muted">
                          {r.id} · {r.released ? 'Zur Diskussion' : 'Entwurf'}
                        </span>
                      </div>
                      <button className="title-button" onClick={() => setRecommendation(r)}>
                        {r.title}
                      </button>
                      <p className="muted">{r.outcome || 'Erwartetes Ergebnis noch offen.'}</p>
                      <details>
                        <summary>Belege und Abhängigkeiten</summary>
                        <p>{r.description}</p>
                        <p>
                          Findings: {r.findingIds.join(', ') || 'Offen'} · Aufwand:{' '}
                          {r.effort || 'Offen'}
                        </p>
                        <p>
                          Benötigt zuvor:{' '}
                          {r.dependencies.join(', ') || 'Keine Abhängigkeiten hinterlegt'}
                        </p>
                      </details>
                    </div>
                    <div className="order-buttons">
                      <button
                        aria-label={`${r.title} nach oben`}
                        disabled={i === 0 || pending}
                        onClick={() => move(r.id, -1)}
                      >
                        ↑
                      </button>
                      <button
                        aria-label={`${r.title} nach unten`}
                        disabled={i === p.recommendations.length - 1 || pending}
                        onClick={() => move(r.id, 1)}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => setRecommendation(r)}
                        aria-label={`${r.title} bearbeiten`}
                      >
                        →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              {!p.recommendations.length && (
                <div className="empty-card">
                  <h3>Vom Finding zum nächsten Schritt.</h3>
                  <p>Erstelle eine Empfehlung und verknüpfe die Findings, auf denen sie beruht.</p>
                </div>
              )}
              <div className="quiet-card">
                <h3>Priorisierung aus einem Gespräch übernehmen</h3>
                <p className="muted">
                  Lade die aus dem HTML-Bericht gespeicherte Datei. Die Reihenfolge wird vor
                  Übernahme angezeigt.
                </p>
                <label>
                  Priorisierungsdatei
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      void loadJson(e.target.files?.[0], 'priority');
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </>
          )}
          {page === 'report' && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Ein Bericht, der Zusammenhänge zeigt.</h1>
                  <p className="muted">
                    Ein eigenständiger HTML-Ergebnisbericht für dein Kundengespräch.
                  </p>
                </div>
              </div>
              <div className="report-grid">
                <section className="panel">
                  <div className="report-preview">
                    <span className="eyebrow">ORGLENS / ERGEBNISBERICHT</span>
                    <h2>{p.name}</h2>
                    <div className="mini-rule" />
                    <Radar project={p} />
                    <p className="small muted">
                      Überblick · Findings · Prozesse · Empfehlungen · Quellen
                    </p>
                  </div>
                  <span className="badge">Diskussionsstand · Version {p.version}</span>
                  <p>
                    Ein freigegebener Stand zum Erkunden und Priorisieren. Ohne App-Installation,
                    externe Dienste oder KI-Verbindung.
                  </p>
                </section>
                <section>
                  <div className="panel">
                    <h2>Was wird exportiert?</h2>
                    <ul className="export-list">
                      <li>
                        <span>Freigegebene Findings</span>
                        <strong>{p.findings.filter((f) => f.released).length}</strong>
                      </li>
                      <li>
                        <span>Freigegebene Empfehlungen</span>
                        <strong>{p.recommendations.filter((r) => r.released).length}</strong>
                      </li>
                      <li>
                        <span>Problem Statements</span>
                        <strong>{p.statements.length}</strong>
                      </li>
                      <li>
                        <span>Interviewkennungen</span>
                        <strong>{new Set(p.statements.map((s) => s.interview)).size}</strong>
                      </li>
                      <li>
                        <span>RACI / Prozessschritte</span>
                        <strong>{p.processes.length}</strong>
                      </li>
                    </ul>
                    <p className="small muted">
                      Enthalten sind alle bestätigten Quellen und RACI-Daten. Nicht enthalten:
                      Transkripte, interne Interpretationen ungeprüfter Findings oder Zugangsdaten.
                      Die HTML-Datei selbst hat keinen Login-Schutz.
                    </p>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={releasedSources}
                        onChange={(e) => setReleasedSources(e.target.checked)}
                      />
                      Ich habe die Inhalte geprüft und gebe die vollständige enthaltene Quellenbasis
                      sowie RACI für diesen Bericht frei.
                    </label>
                    <button
                      className="primary wide"
                      disabled={!releasedSources || pending}
                      onClick={() =>
                        void run(async () => {
                          await download('report', 'orglens-ergebnisbericht.html', 'POST', {
                            version: p.version,
                            sourceRelease: true,
                          });
                          setNotice('HTML-Bericht heruntergeladen. Lokal im Browser öffnen.');
                        })
                      }
                    >
                      HTML-Bericht herunterladen <span>↓</span>
                    </button>
                  </div>
                  <div className="quiet-card">
                    <h3>Dein Projekt sichern.</h3>
                    <p className="muted small">
                      Ein Backup enthält den vollständigen Analyse-Arbeitsstand. Es ist kein
                      Kundenbericht und enthält keine Passwörter.
                    </p>
                    <button
                      onClick={() =>
                        void run(() => download('backup', 'orglens-projektbackup.json'))
                      }
                    >
                      Projektbackup herunterladen
                    </button>
                    <label>
                      Projektbackup wiederherstellen
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          void loadJson(e.target.files?.[0], 'backup');
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
        <footer className="app-footer">
          <span>OrgLens · Lokaler PoC</span>
          <span>
            Quellenbasiert. Manuell steuerbar.{' '}
            <span className="footer-gateway">KI-Gateway noch nicht verbunden.</span>
          </span>
        </footer>
      </div>
      {finding && (
        <FindingEditor
          value={finding}
          project={p}
          onClose={() => setFinding(null)}
          onSave={async (value) => {
            await persist({ ...p, findings: updateList(p.findings, value) });
            setFinding(null);
          }}
        />
      )}
      {recommendation && (
        <RecommendationEditor
          value={recommendation}
          project={p}
          onClose={() => setRecommendation(null)}
          onSave={async (value) => {
            await persist({ ...p, recommendations: updateList(p.recommendations, value) });
            setRecommendation(null);
          }}
        />
      )}
      {process && (
        <ProcessEditor
          value={process}
          project={p}
          onClose={() => setProcess(null)}
          onSave={async (value) => {
            await persist({ ...p, processes: updateList(p.processes, value) });
            setProcess(null);
          }}
        />
      )}
      {ratings && (
        <Modal title="STAR-Bewertungen bearbeiten" onClose={() => setRatings(null)}>
          <p className="muted">
            Die Skala ist noch fachlich abzustimmen. Hinterlege bei Werten von 1–4 deine eigene
            Bewertungsgrundlage. Keine automatische Ableitung aus Prozessreife oder Erwähnungen.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await persist({ ...p, starRatings: ratings });
                setRatings(null);
              });
            }}
          >
            {ratings.map((r, i) => (
              <fieldset key={r.dimension}>
                <legend>{r.dimension}</legend>
                <div className="form-grid">
                  {(['current', 'target'] as const).map((k) => (
                    <label key={k}>
                      {k === 'current' ? 'Ist' : 'Ziel'}
                      <select
                        aria-label={k === 'current' ? 'Ist' : 'Ziel'}
                        value={r[k] ?? ''}
                        onChange={(e) =>
                          setRatings(
                            ratings.map((v, j) =>
                              i === j
                                ? { ...v, [k]: e.target.value ? Number(e.target.value) : null }
                                : v,
                            ),
                          )
                        }
                      >
                        <option value="">Unbewertet</option>
                        {[1, 2, 3, 4].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <label>
                  Bewertungsmaßstab, Begründung und Quelle
                  <textarea
                    required={r.current !== null || r.target !== null}
                    value={r.rationale}
                    onChange={(e) =>
                      setRatings(
                        ratings.map((v, j) => (i === j ? { ...v, rationale: e.target.value } : v)),
                      )
                    }
                  />
                </label>
              </fieldset>
            ))}
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <div className="modal-footer">
              <button className="primary" disabled={pending}>
                Bewertungen speichern
              </button>
              <button type="button" onClick={() => setRatings(null)}>
                Verwerfen
              </button>
            </div>
          </form>
        </Modal>
      )}
      {priorityFile && (
        <Modal title="Priorisierung prüfen" onClose={() => setPriorityFile(null)}>
          <p className="muted">
            Projekt {priorityFile.projectId} · Berichtsversion {priorityFile.version}. Bestehende
            Änderungen werden bei Versionskonflikten nicht überschrieben.
          </p>
          <ol>
            {priorityFile.order.map((id, i) => (
              <li key={`${id}-${i}`}>
                {id} ·{' '}
                {p.recommendations.find((r) => r.id === id)?.title ?? 'Unbekannte Empfehlung'}
              </li>
            ))}
          </ol>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <div className="modal-footer">
            <button
              className="primary"
              disabled={pending}
              onClick={() =>
                void run(async () => {
                  setProject(
                    await api<Project>('priorities', 'POST', { ...priorityFile, confirmed: true }),
                  );
                  setPriorityFile(null);
                  setNotice('Priorisierung übernommen.');
                })
              }
            >
              Reihenfolge bewusst übernehmen
            </button>
            <button onClick={() => setPriorityFile(null)}>Abbrechen</button>
          </div>
        </Modal>
      )}
      {restore !== null && (
        <Modal title="Projektbackup wiederherstellen?" onClose={() => setRestore(null)}>
          <p className="notice">
            Der aktuelle Projektstand wird ersetzt. Sichere ihn vorher als Backup. Die
            Wiederherstellung erzeugt eine neue Projektkennung; alte Workshopdateien können danach
            nicht importiert werden.
          </p>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            onClick={() => void run(() => download('backup', 'orglens-vor-wiederherstellung.json'))}
          >
            Aktuellen Stand zuerst sichern
          </button>
          <div className="modal-footer">
            <button
              className="primary"
              disabled={pending}
              onClick={() =>
                void run(async () => {
                  setProject(
                    await api<Project>('restore', 'POST', {
                      version: p.version,
                      confirmed: true,
                      project: restore,
                    }),
                  );
                  setRestore(null);
                  setReleasedSources(false);
                  setNotice('Projektbackup wiederhergestellt.');
                })
              }
            >
              Wiederherstellung bestätigen
            </button>
            <button onClick={() => setRestore(null)}>Abbrechen</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
