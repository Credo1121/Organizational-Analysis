import { useState } from 'react';
import type { PageProps } from '../types';
import { levels } from '../../domain/schema';
import { PageHeading, Action, Pill, Empty } from '../ui';
import { Icon } from '../icons';
export function Recommendations({ project: p, save, editRecommendation }: PageProps) {
  const [filter, setFilter] = useState('Alle'),
    [dragged, setDragged] = useState<string | null>(null);
  const visible = p.recommendations.filter((r) => filter === 'Alle' || r.level === filter);
  function move(id: string, to: number) {
    const list = [...p.recommendations],
      from = list.findIndex((r) => r.id === id);
    if (from < 0 || to < 0 || to >= list.length) return;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    save({ ...p, recommendations: list });
  }
  return (
    <>
      <PageHeading
        eyebrow="Veränderung / Empfehlungen"
        title="Aus Erkenntnissen werden nächste Schritte."
        description="Bewusst priorisieren. Wirkung beschreiben. Verantwortung übernehmen."
      >
        <Action
          icon="plus"
          primary
          onClick={() =>
            editRecommendation({
              id: `E-${crypto.randomUUID().slice(0, 8)}`,
              title: 'Neue Empfehlung',
              description: '',
              outcome: '',
              findingIds: [],
              dependencies: [],
              level: 'Operativ',
              effort: '',
              released: false,
            })
          }
        >
          Empfehlung erstellen
        </Action>
      </PageHeading>
      <div className="d-backlog-overview">
        <span className="d-icon-tile">
          <Icon name="recommendations" size={23} />
        </span>
        <div>
          <strong>Dein Veränderungs-Backlog</strong>
          <p>{p.recommendations.length} Handlungsempfehlungen · Reihenfolge manuell steuerbar</p>
        </div>
        <Pill tone="gray">Browser-Sitzung</Pill>
      </div>
      <div className="d-tabs">
        {['Alle', ...levels].map((l) => (
          <button key={l} className={filter === l ? 'active' : ''} onClick={() => setFilter(l)}>
            {l}
            <span>{p.recommendations.filter((r) => l === 'Alle' || r.level === l).length}</span>
          </button>
        ))}
      </div>
      <div className="d-backlog-list">
        {visible.map((r) => {
          const i = p.recommendations.findIndex((x) => x.id === r.id);
          return (
            <article
              key={r.id}
              className="d-card d-backlog-item"
              data-id={r.id}
              draggable
              onDragStart={() => setDragged(r.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragged) move(dragged, i);
                setDragged(null);
              }}
            >
              <span className="d-grip">
                <Icon name="grip" size={18} />
              </span>
              <span className="d-rank">{String(i + 1).padStart(2, '0')}</span>
              <div className="d-backlog-content">
                <div className="d-tags">
                  <Pill
                    tone={
                      r.level === 'Operativ' ? 'gray' : r.level === 'Taktisch' ? 'blue' : 'green'
                    }
                  >
                    {r.level}
                  </Pill>
                  <span>
                    {r.id} · {r.released ? 'Zur Diskussion' : 'Entwurf'}
                  </span>
                </div>
                <button className="d-finding-title" onClick={() => editRecommendation(r)}>
                  {r.title}
                </button>
                <p>{r.outcome || 'Erwartetes Ergebnis noch offen.'}</p>
                <div className="d-rec-meta">
                  <span>
                    <Icon name="findings" size={14} />
                    {r.findingIds.length} Findings
                  </span>
                  <span>Aufwand: {r.effort || 'Offen'}</span>
                  {!!r.dependencies.length && <span>Benötigt: {r.dependencies.join(', ')}</span>}
                </div>
              </div>
              <div className="d-order">
                <button
                  aria-label={`${r.title} nach oben`}
                  disabled={i === 0}
                  onClick={() => move(r.id, i - 1)}
                >
                  ↑
                </button>
                <button
                  aria-label={`${r.title} nach unten`}
                  disabled={i === p.recommendations.length - 1}
                  onClick={() => move(r.id, i + 1)}
                >
                  ↓
                </button>
                <button aria-label={`${r.title} bearbeiten`} onClick={() => editRecommendation(r)}>
                  <Icon name="edit" size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <Empty
          title="Keine Empfehlungen in dieser Ebene"
          text="Wähle eine andere Ebene oder lege eine Empfehlung an."
        />
      )}
      <div className="d-inline-note">
        <Icon name="shield" size={17} />
        <p>
          Priorität ist eine bewusste Entscheidung – kein automatisch berechneter Score.
          Abhängigkeiten bleiben beim Umsortieren erhalten.
        </p>
      </div>
    </>
  );
}
