'use client';
import { useState } from 'react';
import { parseCsv, detectedTerms, replaceTerms, fingerprint, type CsvRow } from '@/domain/csv';
import {
  statementSchema,
  processSchema,
  type Project,
  type Statement,
  type ProcessStep,
} from '@/domain/schema';
import { api } from './api';

const statementFields = {
  id: 'Statement-ID',
  text: 'Problem Statement',
  interview: 'Interviewpartner / Kennung',
  department: 'Bereich',
  perspective: 'Perspektive (Innen/Außen)',
  topic: 'Themenfeld (optional)',
};
const processFields = {
  id: 'Schritt-ID',
  process: 'Kernprozess',
  step: 'Prozessschritt',
  currentRole: 'RACI Ist',
  targetRole: 'RACI Ziel',
  current: 'Reifegrad Ist',
  target: 'Reifegrad Ziel',
  source: 'Quelle / Person',
  evidence: 'Zielreife-Nachweis (optional)',
};
export function Importer({
  project,
  onImported,
  onCancel,
}: {
  project: Project;
  onImported: (p: Project) => void;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState<'statements' | 'processes'>('statements');
  const [rows, setRows] = useState<CsvRow[]>([]),
    [headers, setHeaders] = useState<string[]>([]),
    [mapping, setMapping] = useState<Record<string, string>>({});
  const [terms, setTerms] = useState(''),
    [preview, setPreview] = useState<{ statements: Statement[]; processes: ProcessStep[] } | null>(
      null,
    );
  const [replacements, setReplacements] = useState<Record<string, string>>({}),
    [confirmed, setConfirmed] = useState(false),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const fields = kind === 'statements' ? statementFields : processFields;
  async function file(file: File | undefined) {
    setError('');
    setPreview(null);
    setReplacements({});
    setConfirmed(false);
    try {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) throw new Error('Maximal 2 MiB pro Datei.');
      const parsed = parseCsv(await file.text());
      setRows(parsed.rows);
      setHeaders(parsed.headers);
      setMapping(
        Object.fromEntries(
          Object.keys(fields).map((k) => [
            k,
            parsed.headers.find((h) => h.toLowerCase() === k.toLowerCase()) ?? '',
          ]),
        ),
      );
    } catch (e) {
      setError((e as Error).message);
      setRows([]);
      setHeaders([]);
    }
  }
  async function prepare() {
    setBusy(true);
    setError('');
    setConfirmed(false);
    try {
      const personColumn = mapping[kind === 'statements' ? 'interview' : 'source'];
      const found = detectedTerms(rows, personColumn, terms);
      const { key } = await api<{ key: string }>('import-key');
      const fps = await Promise.all(found.map((t) => fingerprint(t, key)));
      const codes = await api<Record<string, string>>('pseudonyms', 'POST', { fingerprints: fps });
      const replacement = Object.fromEntries(found.map((t, i) => [t, codes[fps[i]]]));
      setReplacements(replacement);
      const cleaned = rows.map((row) =>
        Object.fromEntries(
          Object.keys(fields).map((k) => [k, replaceTerms(row[mapping[k]] ?? '', replacement)]),
        ),
      );
      if (kind === 'statements') {
        const statements = cleaned.map((row, i) => {
          const result = statementSchema.safeParse(row);
          if (!result.success)
            throw new Error(
              `Zeile ${i + 2}: ${result.error.issues.map((x) => x.path.join('.') + ' – ' + x.message).join('; ')}`,
            );
          return result.data;
        });
        if (new Set(statements.map((s) => s.id)).size !== statements.length)
          throw new Error('Doppelte Statement-IDs in der Datei.');
        setPreview({ statements, processes: [] });
      } else {
        const processes = cleaned.map((row, i) => {
          const result = processSchema.safeParse({
            ...row,
            current: row.current === '' ? null : Number(row.current),
            target: row.target === '' ? null : Number(row.target),
            findingIds: [],
          });
          if (!result.success)
            throw new Error(
              `Zeile ${i + 2}: ${result.error.issues.map((x) => x.path.join('.') + ' – ' + x.message).join('; ')}`,
            );
          return result.data;
        });
        setPreview({ statements: [], processes });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function commit() {
    if (!preview || !confirmed) return;
    setBusy(true);
    setError('');
    try {
      const next = await api<Project>('import', 'POST', {
        ...preview,
        version: project.version,
        confirmed: true,
      });
      setRows([]);
      setTerms('');
      setReplacements({});
      onImported(next);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="importer">
      <div className="eyebrow">REQ-01 · Geschützter Import</div>
      <h2>Eine saubere Analyse beginnt bei den Quellen.</h2>
      <p className="muted">
        Originale bleiben bis zur Freigabe in dieser Browseransicht. Nur bereinigte Inhalte werden
        als Projektdaten gespeichert.
      </p>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {!preview ? (
        <>
          <div className="form-grid">
            <label>
              Datentyp
              <select
                value={kind}
                disabled={!!rows.length}
                onChange={(e) => setKind(e.target.value as typeof kind)}
              >
                <option value="statements">Problem Statements</option>
                <option value="processes">RACI & Prozessreife</option>
              </select>
            </label>
            <label>
              CSV-Datei · maximal 2 MiB
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => void file(e.target.files?.[0])}
              />
            </label>
          </div>
          <p className="muted small">
            Vorlagen:{' '}
            <a href="/samples/problem-statements.csv" download>
              Problem Statements
            </a>{' '}
            ·{' '}
            <a href="/samples/raci.csv" download>
              RACI
            </a>{' '}
            · UTF-8, Komma oder Semikolon.
          </p>
          {!!rows.length && (
            <>
              <h3>1. Spalten zuordnen</h3>
              <div className="form-grid">
                {Object.entries(fields).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <select
                      value={mapping[key] ?? ''}
                      onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}
                    >
                      <option value="">Nicht zugeordnet</option>
                      {headers.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
              <h3>2. Personendaten ersetzen</h3>
              <p className="muted">
                Personenfeld, E-Mail-Adressen und mögliche Telefonnummern werden berücksichtigt.
                Ergänze weitere Namen oder sensible Begriffe, jeweils eine Angabe pro Zeile.
                Identitäten werden nicht vollständig automatisch erkannt.
              </p>
              <label>
                Weitere Namen / Begriffe
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Zum Beispiel ein Name, der nur im Freitext steht"
                  rows={3}
                />
              </label>
              <button className="primary" onClick={() => void prepare()} disabled={busy}>
                {busy ? 'Vorschau wird erstellt …' : `${rows.length} Zeilen bereinigen und prüfen`}
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <h3>3. Bereinigte Vorschau manuell prüfen</h3>
          <p className="notice">
            {Object.keys(replacements).length} Begriffe ersetzt. Prüfe alle Zeilen auf verbliebene
            Personendaten, auch indirekte Identifikatoren. Die Erkennung ist keine Garantie für
            Anonymität.
          </p>
          <div className="table-wrap preview">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{kind === 'statements' ? 'Problem Statement' : 'Prozessschritt'}</th>
                  <th>Quelle</th>
                  <th>Einordnung</th>
                </tr>
              </thead>
              <tbody>
                {preview.statements.map((s, i) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <textarea
                        aria-label={`Problemtext ${s.id}`}
                        value={s.text}
                        onChange={(e) => {
                          setConfirmed(false);
                          setPreview({
                            ...preview,
                            statements: preview.statements.map((x, j) =>
                              j === i ? { ...x, text: e.target.value } : x,
                            ),
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Quelle ${s.id}`}
                        value={s.interview}
                        onChange={(e) => {
                          setConfirmed(false);
                          setPreview({
                            ...preview,
                            statements: preview.statements.map((x, j) =>
                              j === i ? { ...x, interview: e.target.value } : x,
                            ),
                          });
                        }}
                      />
                    </td>
                    <td>
                      {s.perspective} · {s.department}
                      <br />
                      {s.topic || 'Themenfeld offen'}
                    </td>
                  </tr>
                ))}
                {preview.processes.map((s, i) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>
                      <textarea
                        aria-label={`Prozessschritt ${s.id}`}
                        value={s.step}
                        onChange={(e) => {
                          setConfirmed(false);
                          setPreview({
                            ...preview,
                            processes: preview.processes.map((x, j) =>
                              j === i ? { ...x, step: e.target.value } : x,
                            ),
                          });
                        }}
                      />
                    </td>
                    <td>{s.source}</td>
                    <td>
                      {s.currentRole} → {s.targetRole}
                      <br />
                      {s.current ?? 'Offen'} → {s.target ?? 'Offen'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted small">
            Für Korrekturen in weiteren Feldern: zurück zur Zuordnung, Begriffe ergänzen und
            Vorschau neu erstellen.
          </p>
          <label className="check">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Ich habe alle bereinigten Inhalte geprüft und gebe sie für die Analyse frei.
          </label>
          <div className="button-row">
            <button className="primary" disabled={!confirmed || busy} onClick={() => void commit()}>
              Bereinigte Daten übernehmen
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setConfirmed(false);
              }}
            >
              Zurück zur Zuordnung
            </button>
          </div>
        </>
      )}
      <button className="text-button" onClick={onCancel}>
        Import abbrechen und Originale verwerfen
      </button>
    </div>
  );
}
