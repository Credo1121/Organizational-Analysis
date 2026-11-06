import { useState } from 'react';
import type { PageProps } from '../types';
import { PageHeading, Pill, Empty } from '../ui';
import { Icon } from '../icons';
export function Sources({ project: p, inspect }: PageProps) {
  const [query, setQuery] = useState(''),
    [side, setSide] = useState('Alle');
  const rows = p.statements.filter(
    (s) =>
      (side === 'Alle' || s.perspective === side) &&
      `${s.text} ${s.department} ${s.interview} ${s.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="Analyse / Daten & Quellen"
        title="Jedes Finding hat einen Ursprung."
        description="Deine Quellenbasis – strukturiert, nachvollziehbar und miteinander verknüpft."
      />
      <div className="d-source-summary">
        <div className="d-source-mark">
          <Icon name="sources" size={26} />
        </div>
        <div>
          <strong>Interview-Baseline</strong>
          <p>
            {p.statements.length} Problem Statements aus{' '}
            {new Set(p.statements.map((s) => s.interview)).size} fiktiven Interviews · Innen- und
            Außensicht
          </p>
        </div>
        <Pill tone="green">Synthetische Beispieldaten</Pill>
      </div>
      <div className="d-filter-row">
        <div className="d-search-input">
          <Icon name="search" size={17} />
          <input
            aria-label="Quellen suchen"
            placeholder="Aussage, Bereich oder Kennung suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Quellenperspektive"
          className="d-select"
          value={side}
          onChange={(e) => setSide(e.target.value)}
        >
          <option>Alle</option>
          <option>Innen</option>
          <option>Außen</option>
        </select>
      </div>
      <div className="d-card d-table-card">
        <div className="d-table-wrap">
          <table className="d-source-table">
            <thead>
              <tr>
                <th>Quelle</th>
                <th>Problem Statement</th>
                <th>Perspektive</th>
                <th>Verknüpfung</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const links = p.findings.filter((f) => f.statementIds.includes(s.id));
                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.id}</strong>
                      <span>{s.interview}</span>
                    </td>
                    <td>
                      <p>{s.text}</p>
                      <span>
                        {s.department} · {s.topic || 'Themenfeld offen'}
                      </span>
                    </td>
                    <td>
                      <Pill tone={s.perspective === 'Innen' ? 'gray' : 'blue'}>
                        {s.perspective}
                      </Pill>
                    </td>
                    <td>
                      {links.length ? (
                        <button className="d-source-link" onClick={() => inspect(links[0])}>
                          {links.length} Finding{links.length > 1 ? 's' : ''}
                          <Icon name="external" size={14} />
                        </button>
                      ) : (
                        <span>Noch offen</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <Empty
            title="Keine passenden Quellen"
            text="Probiere einen anderen Suchbegriff oder Filter."
          />
        )}
      </div>
      <div className="d-inline-note">
        <Icon name="shield" size={17} />
        <p>
          Die öffentliche Frontend-Demo verwendet ausschließlich fiktive Daten. Dateiimport und
          Pseudonymisierung gehören zum geschützten App-Betrieb und sind hier nicht aktiviert.
        </p>
      </div>
    </>
  );
}
