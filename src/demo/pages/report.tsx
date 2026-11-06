import type { PageProps } from '../types';
import { PageHeading, Pill } from '../ui';
import { Icon } from '../icons';
import { ProfileRadar } from '../radar';
export function Report({ project: p }: PageProps) {
  const findings = p.findings.filter((f) => f.released);
  return (
    <>
      <div className="d-no-print">
        <PageHeading
          eyebrow="Ergebnis / Berichtsvorschau"
          title="Eine Geschichte, die Zusammenhänge zeigt."
          description="Der aktuelle Browserstand als Vorschau für dein Kundengespräch."
        />
        <div className="d-report-actions">
          <span>
            <Icon name="report" size={17} />
            Vorschau · {findings.length} freigegebene Findings
          </span>
          <button className="d-button d-primary" onClick={() => window.print()}>
            <Icon name="download" size={16} />
            Drucken / PDF
          </button>
          <a className="d-button" href="./report.html" target="_blank" rel="noopener">
            Bisherigen HTML-Beispielbericht öffnen
            <Icon name="external" size={16} />
          </a>
        </div>
      </div>
      <article className="d-report-sheet">
        <div className="d-report-kicker">
          <span>ORGLENS / ORGANISATIONSANALYSE</span>
          <span>DISKUSSIONSSTAND</span>
        </div>
        <div className="d-report-cover">
          <Pill>Fiktive Beispieldaten</Pill>
          <h1>
            Produktmanagement
            <br />
            mit klarem Auftrag.
          </h1>
          <p>
            Perspektiven verbinden.
            <br />
            Handlungsfelder verstehen.
            <br />
            Veränderung gemeinsam gestalten.
          </p>
        </div>
        <div className="d-report-rule" />
        <div className="d-report-profile">
          <div>
            <span className="d-eyebrow">Das organisatorische Profil</span>
            <h2>
              Ein Gesamtbild aus
              <br />
              vielen Perspektiven.
            </h2>
            <p>
              {new Set(p.statements.map((s) => s.interview)).size} fiktive Interviews,{' '}
              {p.statements.length} Problem Statements und {p.processes.length} Kernprozesse bilden
              die Beispielbasis dieses Berichts.
            </p>
            <span className="d-footnote">
              Manuelle Demo-Bewertung; kein validierter STAR-Maßstab.
            </span>
          </div>
          <ProfileRadar project={p} selected="Strategie" onSelect={() => {}} interactive={false} />
        </div>
        <section>
          <div className="d-eyebrow">Zentrale Findings</div>
          {findings.map((f, i) => (
            <div className="d-report-finding" key={f.id}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <Pill tone="gray">{f.level}</Pill>
                <h3>{f.title}</h3>
                <p>{f.observation}</p>
                <small>Quellen: {f.statementIds.join(' · ')}</small>
              </div>
            </div>
          ))}
        </section>
        <section className="d-report-recs">
          <div className="d-eyebrow">Empfehlungen · manuell priorisiert</div>
          <h2>Der nächste Schritt wird konkret.</h2>
          {p.recommendations
            .filter((r) => r.released)
            .map((r, i) => (
              <div key={r.id}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{r.title}</strong>
                <Pill tone="gray">{r.level}</Pill>
              </div>
            ))}
        </section>
        <footer>Frontend-Vorschau · Fiktive Daten · Änderungen nur im aktuellen Browser-Tab</footer>
      </article>
      <p className="d-inline-note d-no-print">
        Das separat verlinkte HTML-Beispiel ist ein fester Musterbericht. Es enthält keine
        nachträglichen Änderungen aus dieser Frontend-Sitzung. Die Vorschau oben zeigt deinen
        aktuellen Browserstand.
      </p>
    </>
  );
}
