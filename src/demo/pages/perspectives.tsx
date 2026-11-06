import { useState } from 'react';
import type { PageProps } from '../types';
import { PageHeading, Pill, SectionTitle } from '../ui';
import { Icon } from '../icons';
export function Perspectives({ project: p, inspect }: PageProps) {
  const [selected, setSelected] = useState(p.findings[0].id);
  const f = p.findings.find((x) => x.id === selected) ?? p.findings[0];
  const sources = p.statements.filter((s) => f.statementIds.includes(s.id));
  return (
    <>
      <PageHeading
        eyebrow="Analyse / Innen- und Außensicht"
        title="Gleiche Organisation. Andere Perspektiven."
        description="Was das Team beschäftigt – und was seine Schnittstellen von ihm erwarten."
      />
      <div className="d-perspectives-layout">
        <section className="d-card d-topic-list">
          <SectionTitle label="Themenvergleich" title="Ein Thema wählen" />
          {p.findings.map((item) => (
            <button
              key={item.id}
              className={f.id === item.id ? 'active' : ''}
              onClick={() => setSelected(item.id)}
            >
              <span>{item.id}</span>
              <strong>{item.title}</strong>
              <Icon name="chevron" size={15} />
            </button>
          ))}
        </section>
        <section className="d-perspective-detail">
          <div className="d-comparison-heading">
            <Pill>{f.cluster}</Pill>
            <h2>{f.title}</h2>
            <button className="d-text-link" onClick={() => inspect(f)}>
              Finding im Detail
              <Icon name="external" size={14} />
            </button>
          </div>
          <div className="d-comparison-cards">
            {(['Innen', 'Außen'] as const).map((side) => {
              const ss = sources.filter((s) => s.perspective === side);
              return (
                <article
                  className={`d-card d-quote-card ${side === 'Außen' ? 'outside' : ''}`}
                  key={side}
                >
                  <div className="d-quote-head">
                    <span className="d-icon-tile">
                      <Icon name="perspectives" />
                    </span>
                    <div>
                      <h3>{side === 'Innen' ? 'Die Innensicht' : 'Die Außensicht'}</h3>
                      <span>
                        {side === 'Innen' ? 'Produktmanagement' : 'Direkte Schnittstellen'}
                      </span>
                    </div>
                    <Pill tone="gray">{ss.length} Belege</Pill>
                  </div>
                  {ss.map((s) => (
                    <div className="d-quote" key={s.id}>
                      <span className="d-quote-mark">“</span>
                      <p>{s.text}</p>
                      <small>
                        {s.id} · {s.interview} · {s.department}
                      </small>
                    </div>
                  ))}
                  {!ss.length && (
                    <div className="d-quote-empty">
                      <Icon name="sources" size={28} />
                      <p>Diese Perspektive ist noch nicht belegt.</p>
                      <small>Aus fehlenden Aussagen lässt sich keine Zustimmung ableiten.</small>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div className="d-synthesis">
            <Icon name="findings" size={23} />
            <div>
              <span className="d-eyebrow">Arbeitshypothese zur Diskussion</span>
              <p>{f.interpretation}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
