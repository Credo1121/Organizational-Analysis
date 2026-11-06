import { useState } from 'react';
import type { PageProps } from '../types';
import { PageHeading, Action, Pill, SectionTitle } from '../ui';
import { Icon } from '../icons';
export function Processes({ project: p, editProcess, inspect }: PageProps) {
  const [selected, setSelected] = useState(p.processes[0].id);
  const step = p.processes.find((s) => s.id === selected) ?? p.processes[0];
  return (
    <>
      <PageHeading
        eyebrow="Analyse / Prozesse & RACI"
        title="Klarheit über Rollen. Raum für Reife."
        description="Verantwortung und Prozessreife getrennt betrachten – und im Zusammenhang verstehen."
      />
      <div className="d-process-tabs">
        {p.processes.map((s) => (
          <button
            key={s.id}
            className={step.id === s.id ? 'active' : ''}
            onClick={() => setSelected(s.id)}
          >
            <Icon name="processes" size={18} />
            {s.process}
            <span>
              {s.current ?? '–'}
              <Icon name="arrow" size={12} />
              {s.target ?? '–'}
            </span>
          </button>
        ))}
      </div>
      <div className="d-process-detail">
        <section className="d-card">
          <SectionTitle label={step.process} title={step.step}>
            <button
              className="d-icon-action"
              aria-label="Prozess bearbeiten"
              onClick={() => editProcess(step)}
            >
              <Icon name="edit" size={17} />
            </button>
          </SectionTitle>
          <div className="d-role-grid">
            <div>
              <span className="d-overline">VERANTWORTUNG HEUTE</span>
              <strong>{step.currentRole}</strong>
              <p>
                {
                  {
                    R: 'Responsible · Durchführend',
                    A: 'Accountable · Ergebnisverantwortlich',
                    C: 'Consulted · Einbezogen',
                    I: 'Informed · Informiert',
                    Offen: 'Noch nicht geklärt',
                  }[step.currentRole]
                }
              </p>
            </div>
            <Icon name="arrow" size={24} />
            <div>
              <span className="d-overline">ANGESTREBTE ROLLE</span>
              <strong>{step.targetRole}</strong>
              <p>
                {
                  {
                    R: 'Responsible · Durchführend',
                    A: 'Accountable · Ergebnisverantwortlich',
                    C: 'Consulted · Einbezogen',
                    I: 'Informed · Informiert',
                    Offen: 'Noch nicht geklärt',
                  }[step.targetRole]
                }
              </p>
            </div>
          </div>
          <div className="d-process-scale">
            <div className="d-section-inline">
              <h3>Prozessreife</h3>
              <Pill tone="gray">
                Ist {step.current ?? 'offen'} → Ziel {step.target ?? 'offen'}
              </Pill>
            </div>
            <div className="d-maturity">
              {[
                'Personenabhängig',
                'Teilweise etabliert',
                'Prozess genutzt',
                'Etabliert & gesteuert',
              ].map((label, i) => (
                <div
                  key={label}
                  className={`${step.current === i + 1 ? 'current' : ''} ${step.target === i + 1 ? 'target' : ''}`}
                >
                  <span>{i + 1}</span>
                  <strong>{label}</strong>
                  {step.current === i + 1 && <small>IST-BILD</small>}
                  {step.target === i + 1 && <small>ZIELBILD</small>}
                </div>
              ))}
            </div>
          </div>
          <div className="d-inline-note">
            <Icon name="sources" size={15} />
            <p>Bewertungsquelle: {step.source || 'Offen'}</p>
          </div>
        </section>
        <section className="d-card d-evidence-panel">
          <SectionTitle
            label="Wirkung nachvollziehbar machen"
            title="Woran erkennen wir Fortschritt?"
          />
          <p>{step.evidence || 'Nachweise für die Zielreife noch gemeinsam festlegen.'}</p>
          <div className="d-soft-rule" />
          <span className="d-overline">VERKNÜPFTE FINDINGS</span>
          {step.findingIds.map((id) => {
            const f = p.findings.find((x) => x.id === id)!;
            return (
              <button key={id} className="d-finding-ref" onClick={() => inspect(f)}>
                <span>{id}</span>
                <strong>{f.title}</strong>
                <Icon name="external" size={15} />
              </button>
            );
          })}
          <div className="d-note-bottom">
            <Icon name="shield" size={16} />
            <p>
              Eine umgesetzte Empfehlung erhöht den Reifegrad nicht automatisch. Der Nachweis
              entscheidet.
            </p>
          </div>
          <Action icon="edit" onClick={() => editProcess(step)}>
            Rolle und Bewertung bearbeiten
          </Action>
        </section>
      </div>
    </>
  );
}
