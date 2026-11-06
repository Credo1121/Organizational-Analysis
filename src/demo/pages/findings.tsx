import { useState } from 'react';
import { stars } from '../../domain/schema';
import type { PageProps } from '../types';
import { PageHeading, Action, Pill, Empty } from '../ui';
import { Icon } from '../icons';
export function Findings({ project: p, inspect, editFinding }: PageProps) {
  const [filter, setFilter] = useState('Alle'),
    [query, setQuery] = useState('');
  const filtered = p.findings.filter(
    (f) =>
      (filter === 'Alle' || f.stars.includes(filter as (typeof stars)[number])) &&
      `${f.title} ${f.cluster} ${f.observation}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="Analyse / Findings & Cluster"
        title="Die Themen hinter den Aussagen."
        description="Beobachtungen verdichten. Zusammenhänge verstehen. Jede Aussage belegen."
      >
        <Action
          primary
          icon="plus"
          onClick={() =>
            editFinding({
              id: `F-${crypto.randomUUID().slice(0, 8)}`,
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
            })
          }
        >
          Finding erstellen
        </Action>
      </PageHeading>
      <div className="d-filter-row">
        <div className="d-search-input">
          <Icon name="search" size={17} />
          <input
            aria-label="Findings suchen"
            placeholder="Finding oder Cluster suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="d-result-count">{filtered.length} Findings</span>
      </div>
      <div className="d-tabs" aria-label="STAR-Filter">
        {['Alle', ...stars].map((s) => (
          <button
            key={s}
            aria-pressed={filter === s}
            className={filter === s ? 'active' : ''}
            onClick={() => setFilter(s)}
          >
            {s}
            {s === 'Alle' && <span>{p.findings.length}</span>}
          </button>
        ))}
      </div>
      <div className="d-finding-grid">
        {filtered.map((f) => (
          <article className="d-card d-finding" key={f.id}>
            <div className="d-finding-top">
              <span className="d-overline">
                {f.id} <span> / {f.level}</span>
              </span>
              <span className={`d-state ${f.released ? 'reviewed' : ''}`}>
                <i />
                {f.released ? 'Zur Diskussion' : 'Entwurf'}
              </span>
            </div>
            <button className="d-finding-title" onClick={() => inspect(f)}>
              {f.title}
              <Icon name="external" size={17} />
            </button>
            <p>{f.observation}</p>
            <div className="d-tags">
              {f.stars.map((s) => (
                <Pill key={s} tone="gray">
                  {s}
                </Pill>
              ))}
            </div>
            <div className="d-finding-bottom">
              <button onClick={() => inspect(f)}>
                <Icon name="sources" size={14} />
                {f.statementIds.length} Belege ansehen
              </button>
              <button onClick={() => editFinding(f)} aria-label={`${f.title} bearbeiten`}>
                <Icon name="edit" size={15} />
                Bearbeiten
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          title="Keine passenden Findings"
          text="Ändere den Suchbegriff oder die gewählte Dimension."
        />
      )}
    </>
  );
}
