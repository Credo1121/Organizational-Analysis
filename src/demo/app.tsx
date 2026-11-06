import { useEffect, useState } from 'react';
import {
  validateProject,
  type Project,
  type Finding,
  type Recommendation,
  type ProcessStep,
} from '../domain/schema';
import { FindingEditor, RecommendationEditor, ProcessEditor } from '../components/editors';
import { Modal } from '../components/modal';
import { Icon, BrandMark, type IconName } from './icons';
import { Pill } from './ui';
import { loadDemo, storeDemo, frontendProject } from './data';
import type { Page, PageProps } from './types';
import { Overview } from './pages/overview';
import { Sources } from './pages/sources';
import { Findings } from './pages/findings';
import { Perspectives } from './pages/perspectives';
import { Processes } from './pages/processes';
import { Recommendations } from './pages/recommendations';
import { Target } from './pages/target';
import { Report } from './pages/report';
import { RatingsEditor } from './ratings-editor';

const links: { id: Page; label: string; icon: IconName; group: string }[] = [
  { id: 'overview', label: 'Überblick', icon: 'overview', group: 'DEINE ANALYSE' },
  { id: 'sources', label: 'Daten & Quellen', icon: 'sources', group: 'DEINE ANALYSE' },
  { id: 'findings', label: 'Findings & Cluster', icon: 'findings', group: 'DEINE ANALYSE' },
  { id: 'perspectives', label: 'Innen / Außen', icon: 'perspectives', group: 'DEINE ANALYSE' },
  { id: 'processes', label: 'Prozesse & RACI', icon: 'processes', group: 'DEINE ANALYSE' },
  { id: 'target', label: 'Zielbild', icon: 'target', group: 'VERÄNDERUNG GESTALTEN' },
  {
    id: 'recommendations',
    label: 'Empfehlungen',
    icon: 'recommendations',
    group: 'VERÄNDERUNG GESTALTEN',
  },
  { id: 'report', label: 'Berichtsvorschau', icon: 'report', group: 'ERGEBNISSE TEILEN' },
];
function currentPage(): Page {
  const hash = location.hash.slice(1);
  return links.some((l) => l.id === hash) ? (hash as Page) : 'overview';
}
const update = <T extends { id: string }>(items: T[], item: T) =>
  items.some((x) => x.id === item.id)
    ? items.map((x) => (x.id === item.id ? item : x))
    : [...items, item];
export function DemoApp() {
  const [initial] = useState(loadDemo),
    [project, setProject] = useState(initial.project),
    [page, setPage] = useState<Page>(currentPage);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 680px)').matches);
  const [ratingsOpen, setRatingsOpen] = useState(false);
  const [menu, setMenu] = useState(false),
    [info, setInfo] = useState(false),
    [reset, setReset] = useState(false),
    [message, setMessage] = useState(initial.message);
  const [inspected, setInspected] = useState<Finding | null>(null),
    [finding, setFinding] = useState<Finding | null>(null),
    [rec, setRec] = useState<Recommendation | null>(null),
    [process, setProcess] = useState<ProcessStep | null>(null);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 680px)');
    const resize = () => setMobile(media.matches);
    media.addEventListener('change', resize);
    const change = () => {
      setPage(currentPage());
      setMenu(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false);
    };
    window.addEventListener('hashchange', change);
    window.addEventListener('keydown', escape);
    return () => {
      media.removeEventListener('change', resize);
      window.removeEventListener('hashchange', change);
      window.removeEventListener('keydown', escape);
    };
  }, []);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 6500);
    return () => clearTimeout(timer);
  }, [message]);
  function navigate(next: Page) {
    location.hash = next;
    setPage(next);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function save(next: Project) {
    const clean = validateProject({ ...next, version: project.version + 1 });
    try {
      storeDemo(clean);
      setMessage('Änderungen in diesem Browser-Tab gespeichert.');
    } catch {
      setMessage(
        'Änderungen gelten bis zum Neuladen. Dein Browser erlaubt keinen Sitzungsspeicher.',
      );
    }
    setProject(clean);
  }
  const props: PageProps = {
    project,
    navigate,
    inspect: setInspected,
    editFinding: setFinding,
    editRecommendation: setRec,
    editProcess: setProcess,
    save,
    editRatings: () => setRatingsOpen(true),
  };
  const views: Record<Page, React.ComponentType<PageProps>> = {
    overview: Overview,
    sources: Sources,
    findings: Findings,
    perspectives: Perspectives,
    processes: Processes,
    target: Target,
    recommendations: Recommendations,
    report: Report,
  };
  const View = views[page];
  const active = links.find((l) => l.id === page)!;
  return (
    <div className="demo-shell">
      <a
        className="d-skip"
        href="#demo-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('demo-main')?.focus();
        }}
      >
        Zum Inhalt springen
      </a>
      {menu && (
        <button
          className="d-menu-backdrop"
          aria-label="Navigation schließen"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`d-sidebar ${menu ? 'open' : ''}`} inert={mobile && !menu}>
        <a className="d-brand" href="#overview" onClick={() => navigate('overview')}>
          <BrandMark />
          <strong>
            OrgLens<span>STUDIO</span>
          </strong>
        </a>
        <button className="d-project-switch" onClick={() => setInfo(true)}>
          <div className="d-project-icon">P</div>
          <span>
            <strong>Produktmanagement</strong>
            <small>Organisationsanalyse</small>
          </span>
          <Icon name="chevron" size={13} />
        </button>
        <nav aria-label="Hauptnavigation">
          {links.map((l, i) => (
            <div key={l.id}>
              {(i === 0 || l.group !== links[i - 1].group) && (
                <div className="d-nav-group">{l.group}</div>
              )}
              <a
                href={`#${l.id}`}
                className={`d-nav-link ${page === l.id ? 'active' : ''}`}
                aria-current={page === l.id ? 'page' : undefined}
                onClick={() => navigate(l.id)}
              >
                <Icon name={l.icon} size={19} />
                <span>{l.label}</span>
                {l.id === 'findings' && <small>{project.findings.length}</small>}
                {l.id === 'report' && <span className="d-nav-new">NEU</span>}
              </a>
            </div>
          ))}
        </nav>
        <div className="d-sidebar-bottom">
          <div className="d-session-note">
            <span className="d-live-dot" />
            <div>
              <strong>Dein Demo-Arbeitsbereich</strong>
              <span>Änderungen nur in diesem Tab</span>
            </div>
          </div>
          <button className="d-reset" onClick={() => setReset(true)}>
            <Icon name="reset" size={15} />
            Demo zurücksetzen
          </button>
          <div className="d-sidebar-version">
            ORGLENS STUDIO <span>FRONTEND PREVIEW</span>
          </div>
        </div>
      </aside>
      <div className="d-app-content">
        <header className="d-topbar">
          <div className="d-breadcrumb">
            <button
              className="d-mobile-menu d-icon-action"
              aria-label="Navigation öffnen"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              <Icon name="menu" />
            </button>
            <span>Arbeitsbereich</span>
            <Icon name="chevron" size={12} />
            <strong>{active.label}</strong>
          </div>
          <div className="d-topbar-actions">
            <button className="d-demo-indicator" onClick={() => setInfo(true)}>
              <span className="d-live-dot" />
              Frontend-Demo
            </button>
            <span className="d-topbar-divider" />
            <button
              className="d-avatar"
              onClick={() => setInfo(true)}
              aria-label="Informationen zum Demo-Arbeitsbereich"
            >
              B
            </button>
          </div>
        </header>
        <div className="d-demo-ribbon">
          <span>
            <Icon name="shield" size={13} />
            Fiktive Daten. Echter Arbeitsablauf.
          </span>
          <span>Kein Backend · kein Upload · kein KI-Dienst</span>
        </div>
        <main id="demo-main" className="d-main" tabIndex={-1}>
          <View {...props} />
        </main>
        <footer className="d-app-footer">
          <span>
            OrgLens Studio <i /> Klarheit schafft Handlungsspielraum.
          </span>
          <span>Frontend-Vorschau · nur fiktive Daten</span>
        </footer>
      </div>
      {message && (
        <div className="d-toast" role="status">
          <Icon name="check" size={17} />
          {message}
          <button onClick={() => setMessage('')} aria-label="Hinweis schließen">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
      {finding && (
        <FindingEditor
          value={finding}
          project={project}
          onClose={() => setFinding(null)}
          onSave={async (item) => {
            save({ ...project, findings: update(project.findings, item) });
            setFinding(null);
          }}
        />
      )}
      {ratingsOpen && (
        <RatingsEditor
          project={project}
          onClose={() => setRatingsOpen(false)}
          onSave={(ratings) => {
            save({ ...project, starRatings: ratings });
            setRatingsOpen(false);
          }}
        />
      )}
      {rec && (
        <RecommendationEditor
          value={rec}
          project={project}
          onClose={() => setRec(null)}
          onSave={async (item) => {
            save({ ...project, recommendations: update(project.recommendations, item) });
            setRec(null);
          }}
        />
      )}
      {process && (
        <ProcessEditor
          value={process}
          project={project}
          onClose={() => setProcess(null)}
          onSave={async (item) => {
            save({ ...project, processes: update(project.processes, item) });
            setProcess(null);
          }}
        />
      )}
      {inspected && (
        <Modal title={inspected.title} onClose={() => setInspected(null)}>
          <div className="d-inspector">
            <div className="d-tags">
              <Pill>{inspected.id}</Pill>
              <Pill tone="gray">{inspected.level}</Pill>
              {inspected.stars.map((s) => (
                <Pill tone="gray" key={s}>
                  {s}
                </Pill>
              ))}
            </div>
            <h3>Was wurde beobachtet?</h3>
            <p>{inspected.observation}</p>
            <h3>Wie lässt sich das einordnen?</h3>
            <p>{inspected.interpretation}</p>
            <div className="d-inspector-hypothesis">
              <span className="d-eyebrow">Handlungshypothese</span>
              <p>{inspected.hypothesis}</p>
            </div>
            <h3>Die Belege dahinter</h3>
            {project.statements
              .filter((s) => inspected.statementIds.includes(s.id))
              .map((s) => (
                <div className="d-inspector-source" key={s.id}>
                  <div>
                    <Pill tone={s.perspective === 'Innen' ? 'gray' : 'blue'}>{s.perspective}</Pill>
                    <span>
                      {s.id} · {s.interview}
                    </span>
                  </div>
                  <p>{s.text}</p>
                  <small>{s.department}</small>
                </div>
              ))}
            <p className="d-footnote">
              Schwere: {inspected.severity || 'Noch nicht bewertet'}. Häufigkeit ist kein
              automatischer Schweregrad.
            </p>
            <div className="modal-footer">
              <button
                className="primary"
                onClick={() => {
                  setFinding(inspected);
                  setInspected(null);
                }}
              >
                <Icon name="edit" size={16} />
                Finding manuell bearbeiten
              </button>
            </div>
          </div>
        </Modal>
      )}
      {info && (
        <Modal title="Dein Frontend-Arbeitsbereich" onClose={() => setInfo(false)}>
          <div className="d-info">
            <Pill>Interaktive Frontend-Demo</Pill>
            <h3>Ein Gefühl für die App. Ohne Installation.</h3>
            <p>
              Diese Vorschau verwendet ausschließlich erfundene Interviews und Bewertungen. Du
              kannst Findings und Empfehlungen bearbeiten, Quellen erkunden und Prioritäten
              verändern.
            </p>
            <div className="d-info-grid">
              <div>
                <Icon name="check" />
                <strong>Hier funktioniert</strong>
                <p>
                  Navigation, Suche, Filter, manuelle Bearbeitung, RACI, Zielbildsimulation und
                  Berichtsvorschau.
                </p>
              </div>
              <div>
                <Icon name="shield" />
                <strong>Bewusst getrennt</strong>
                <p>
                  Keine Anmeldung, kein Upload, keine KI und keine Server-Datenbank. Verwende keine
                  echten Kundendaten.
                </p>
              </div>
            </div>
            <p>
              Änderungen werden nur im Sitzungsspeicher dieses Browser-Tabs gehalten. Der feste
              HTML-Beispielbericht bildet diese Änderungen nicht ab. Der geschützte Backendbetrieb
              bleibt eine separate Ausbaustufe.
            </p>
            <button className="primary" onClick={() => setInfo(false)}>
              Arbeitsbereich erkunden
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </Modal>
      )}
      {reset && (
        <Modal title="Demo zurücksetzen?" onClose={() => setReset(false)}>
          <p>
            Deine Änderungen an den fiktiven Daten in diesem Browser-Tab werden durch die
            ursprünglichen Beispieldaten ersetzt.
          </p>
          <div className="modal-footer">
            <button onClick={() => setReset(false)}>Abbrechen</button>
            <button
              className="primary"
              onClick={() => {
                const p = frontendProject();
                try {
                  storeDemo(p);
                } catch {}
                setProject(p);
                setReset(false);
                navigate('overview');
                setMessage('Die fiktive Ausgangsbasis ist wiederhergestellt.');
              }}
            >
              Demo zurücksetzen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
