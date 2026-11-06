import { useState } from 'react';
import { levels } from '../../domain/schema';
import type { PageProps } from '../types';
import { PageHeading, Pill, SectionTitle } from '../ui';
import { Icon } from '../icons';
export function Target({ project: p, editRecommendation }: PageProps) {
  const [target, setTarget] = useState([50, 35, 15]);
  const baseline = [75, 20, 5];
  function adjust(index: number, value: number) {
    setTarget((old) => {
      const other = [0, 1, 2].filter((i) => i !== index),
        sum = old[other[0]] + old[other[1]],
        remaining = 100 - value;
      const first = Math.round(sum ? (old[other[0]] / sum) * remaining : remaining / 2);
      const next = [...old];
      next[index] = value;
      next[other[0]] = first;
      next[other[1]] = remaining - first;
      return next;
    });
  }
  const focus = target[2] - baseline[2] > target[1] - baseline[1] ? 'Strategisch' : 'Taktisch';
  const recommended = p.recommendations.filter((r) => r.level === 'Operativ' || r.level === focus);
  return (
    <>
      <PageHeading
        eyebrow="Veränderung / Zielbild"
        title="Mehr Raum für die richtige Arbeit."
        description="Erkunde, welche Hebel ein anderes Arbeitsmodell unterstützen könnten."
      />
      <div className="d-target-grid">
        <section className="d-card">
          <SectionTitle
            label="Arbeitsverteilung · illustrative Werte"
            title="Heute operativ. Morgen gestaltend."
          />
          <div className="d-distribution">
            <div className="d-section-inline">
              <span>Beispiel-Ist</span>
              <small>75 / 20 / 5</small>
            </div>
            <div className="d-capacity-bar">
              {baseline.map((v, i) => (
                <span key={i} style={{ width: `${v}%` }}>
                  {v >= 10 ? `${v} %` : ''}
                </span>
              ))}
            </div>
            <div className="d-section-inline">
              <strong>Dein Zielbild</strong>
              <small>{target.join(' / ')}</small>
            </div>
            <div className="d-capacity-bar target">
              {target.map((v, i) => (
                <span key={i} style={{ width: `${v}%` }}>
                  {v >= 10 ? `${v} %` : ''}
                </span>
              ))}
            </div>
            <div className="d-bar-legend">
              {levels.map((l) => (
                <span key={l}>
                  <i />
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="d-sliders">
            {levels.map((l, i) => (
              <label key={l}>
                <span>
                  <strong>{l}</strong>
                  <b>
                    {target[i]}
                    <small> %</small>
                  </b>
                </span>
                <input
                  aria-label={`Zielanteil ${l}`}
                  type="range"
                  min="0"
                  max="100"
                  value={target[i]}
                  onChange={(e) => adjust(i, Number(e.target.value))}
                />
              </label>
            ))}
          </div>
          <p className="d-footnote">
            Summe immer 100 %. Änderungen verteilen die verbleibenden Anteile proportional. Diese
            UI-Simulation ist keine Zeitersparnis- oder Kapazitätsprognose.
          </p>
        </section>
        <section>
          <div className="d-blue-callout">
            <Icon name="spark" size={26} />
            <Pill tone="gray">Fokus: {focus.toLowerCase()} arbeiten</Pill>
            <h2>Entlastung kommt vor zusätzlichem Anspruch.</h2>
            <p>
              Damit mehr {focus === 'Strategisch' ? 'Strategie' : 'taktische Arbeit'} möglich wird,
              braucht es zuerst Raum im operativen Alltag.
            </p>
          </div>
          <div className="d-card">
            <SectionTitle
              label="Mögliche Voraussetzungen"
              title="Diese Hebel passen zum Zielbild."
            />
            {recommended.map((r) => (
              <button key={r.id} className="d-target-rec" onClick={() => editRecommendation(r)}>
                <span className="d-icon-tile">
                  <Icon name={r.level === 'Operativ' ? 'processes' : 'target'} size={18} />
                </span>
                <div>
                  <small>
                    {r.level === 'Operativ' ? 'OPERATIVE ENTLASTUNG' : r.level.toUpperCase()}
                  </small>
                  <strong>{r.title}</strong>
                </div>
                <Icon name="chevron" size={16} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
