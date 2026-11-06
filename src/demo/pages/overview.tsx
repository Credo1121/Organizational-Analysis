import { useState } from 'react';
import { ProfileRadar } from '../radar';
import { Icon } from '../icons';
import { PageHeading, Action, Pill, SectionTitle } from '../ui';
import type { PageProps } from '../types';
export function Overview({ project: p, navigate, inspect, editRatings }: PageProps) {
  const [dimension, setDimension] = useState('Strategie');
  const current = p.starRatings.find((r) => r.dimension === dimension)!;
  const focused = p.findings.filter((f) => f.stars.includes(dimension as (typeof f.stars)[number]));
  const metrics = [
    {
      value: new Set(p.statements.map((s) => s.interview)).size,
      label: 'Interviewperspektiven',
      detail: 'Innen und außen verbunden',
      icon: 'perspectives' as const,
    },
    {
      value: p.statements.length,
      label: 'Problem Statements',
      detail: 'Die Basis deiner Analyse',
      icon: 'sources' as const,
    },
    {
      value: p.findings.length,
      label: 'Verdichtete Findings',
      detail: 'Mit Quellen nachvollziehbar',
      icon: 'findings' as const,
    },
    {
      value: p.recommendations.length,
      label: 'Handlungsempfehlungen',
      detail: 'Für den nächsten Schritt',
      icon: 'recommendations' as const,
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="Dein Analyse-Cockpit"
        title="Aus Perspektiven wird Klarheit."
        description="Das Gesamtbild deiner Organisation. Und die Hebel, die sie weiterbringen."
      >
        <Action onClick={() => navigate('report')} icon="external">
          Berichtsvorschau
        </Action>
      </PageHeading>
      <div className="d-metrics">
        {metrics.map((m, i) => (
          <button
            key={m.label}
            className="d-metric"
            onClick={() =>
              navigate((['perspectives', 'sources', 'findings', 'recommendations'] as const)[i])
            }
          >
            <span className="d-metric-top">
              <Icon name={m.icon} size={17} />
              <Icon name="external" size={13} />
            </span>
            <strong>{String(m.value).padStart(2, '0')}</strong>
            <span className="d-metric-label">{m.label}</span>
            <small>{m.detail}</small>
          </button>
        ))}
      </div>
      <div className="d-profile-grid">
        <section className="d-card d-profile">
          <SectionTitle label="Organisatorisches Profil" title="Wo stehen wir heute?">
            <div className="d-tags">
              <Pill tone="gray">STAR-Modell</Pill>
              <button
                className="d-icon-action"
                aria-label="STAR-Bewertungen bearbeiten"
                onClick={editRatings}
              >
                <Icon name="edit" size={15} />
              </button>
            </div>
          </SectionTitle>
          <div className="d-profile-body">
            <ProfileRadar project={p} selected={dimension} onSelect={setDimension} />
            <div className="d-radar-foot">
              <span className="d-live-dot" />
              Fiktive manuelle Bewertung · Skala 1–4
              <button onClick={() => navigate('processes')}>
                Zur Prozesssicht
                <Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
        </section>
        <section className="d-card d-dimension">
          <div className="d-dimension-heading">
            <span className="d-icon-tile">
              <Icon name="target" />
            </span>
            <div>
              <div className="d-eyebrow">Fokusdimension</div>
              <h2>{dimension}</h2>
            </div>
            <span className="d-rating">
              {current.current ?? '–'}
              <span>/ 4</span>
            </span>
          </div>
          <div className="d-dimension-progress">
            <span style={{ width: `${(current.current ?? 0) * 25}%` }} />
            <i style={{ left: `${(current.target ?? 0) * 25}%` }} />
          </div>
          <div className="d-dimension-caption">
            <span>Ist-Bild</span>
            <span>Zielbild {current.target ?? 'offen'} / 4</span>
          </div>
          <div className="d-dimension-findings">
            <span className="d-overline">VERKNÜPFTE FINDINGS</span>
            {focused.map((f) => (
              <button key={f.id} onClick={() => inspect(f)}>
                <div>
                  <small>
                    {f.id} · {f.level}
                  </small>
                  <strong>{f.title}</strong>
                  <span>{f.statementIds.length} Belege</span>
                </div>
                <Icon name="chevron" size={16} />
              </button>
            ))}
          </div>
          <button className="d-text-link" onClick={() => navigate('findings')}>
            Alle Findings erkunden
            <Icon name="arrow" size={16} />
          </button>
        </section>
      </div>
      <div className="d-lower-grid">
        <section className="d-card">
          <SectionTitle
            label="Selbstbild und Erwartungen"
            title="Zwei Blicke. Ein gemeinsames Bild."
          >
            <button
              className="d-icon-action"
              aria-label="Innen- und Außensicht öffnen"
              onClick={() => navigate('perspectives')}
            >
              <Icon name="external" size={17} />
            </button>
          </SectionTitle>
          <div className="d-perspective-mini">
            <div>
              <Pill tone="gray">Innen · Produktmanagement</Pill>
              <p>„Wir stecken zu tief im Operativen, um unser Portfolio aktiv zu gestalten.“</p>
              <span>Verdichtete, fiktive Aussage</span>
            </div>
            <div>
              <Pill>Außen · Schnittstellen</Pill>
              <p>
                „Wir brauchen klare Anforderungen, Prioritäten und verlässliche Entscheidungen.“
              </p>
              <span>Verdichtete, fiktive Aussage</span>
            </div>
          </div>
        </section>
        <section className="d-card d-capacity-mini">
          <SectionTitle label="Raum für Veränderung" title="Vom Tagesgeschäft zum Gestalten." />
          <div className="d-capacity-bar">
            <span style={{ width: '75%' }}>75 %</span>
            <span style={{ width: '20%' }}>20 %</span>
            <span style={{ width: '5%' }} />
          </div>
          <div className="d-bar-legend">
            <span>
              <i />
              Operativ
            </span>
            <span>
              <i />
              Taktisch
            </span>
            <span>
              <i />
              Strategisch
            </span>
          </div>
          <p>
            Operative Entlastung schafft die Voraussetzung für taktische und strategische Arbeit.
          </p>
          <button className="d-text-link" onClick={() => navigate('target')}>
            Zielbild erkunden
            <Icon name="arrow" size={16} />
          </button>
          <span className="d-footnote">Illustrative Verteilung, keine Kapazitätsmessung.</span>
        </section>
      </div>
      <div className="d-bottom-note">
        <Icon name="shield" size={15} />
        <span>
          Deine fachliche Entscheidung bleibt der Maßstab. Alle Findings und Empfehlungen sind
          manuell bearbeitbar.
        </span>
      </div>
    </>
  );
}
