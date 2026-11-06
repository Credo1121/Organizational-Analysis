'use client';
import { useState, type FormEvent } from 'react';
import {
  stars,
  levels,
  type Finding,
  type Recommendation,
  type ProcessStep,
  type Project,
} from '@/domain/schema';
import { Modal } from './modal';

type EditorProps<T> = {
  value: T;
  project: Project;
  onSave: (v: T) => Promise<void>;
  onClose: () => void;
};
function useEditor<T>(value: T, onSave: (v: T) => Promise<void>) {
  const [draft, setDraft] = useState(value),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const field = <K extends keyof T>(k: K, v: T[K]) => setDraft({ ...draft, [k]: v });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSave(draft);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return { draft, field, error, busy, submit };
}
function Footer({ error, busy, onClose }: { error: string; busy: boolean; onClose: () => void }) {
  return (
    <>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="modal-footer">
        <button className="primary" disabled={busy}>
          {busy ? 'Wird gespeichert …' : 'Änderungen speichern'}
        </button>
        <button type="button" onClick={onClose}>
          Verwerfen
        </button>
      </div>
    </>
  );
}
function toggle(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}
export function FindingEditor({ value, project, onSave, onClose }: EditorProps<Finding>) {
  const { draft: d, field, error, busy, submit } = useEditor(value, onSave);
  return (
    <Modal title="Finding bearbeiten" onClose={onClose}>
      <form onSubmit={submit}>
        <span className="badge">{d.id} · Manuelle Bearbeitung</span>
        <label>
          Titel
          <input required value={d.title} onChange={(e) => field('title', e.target.value)} />
        </label>
        <label>
          Beobachtung
          <textarea value={d.observation} onChange={(e) => field('observation', e.target.value)} />
        </label>
        <div className="form-grid">
          <label>
            Interpretation
            <textarea
              value={d.interpretation}
              onChange={(e) => field('interpretation', e.target.value)}
            />
          </label>
          <label>
            Handlungshypothese
            <textarea value={d.hypothesis} onChange={(e) => field('hypothesis', e.target.value)} />
          </label>
        </div>
        <div className="form-grid">
          <label>
            Cluster / Themenfeld
            <input value={d.cluster} onChange={(e) => field('cluster', e.target.value)} />
          </label>
          <label>
            Arbeitsebene
            <select
              value={d.level}
              onChange={(e) => field('level', e.target.value as Finding['level'])}
            >
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>
        <fieldset>
          <legend>STAR-Zuordnung</legend>
          <div className="check-grid">
            {stars.map((s) => (
              <label className="check" key={s}>
                <input
                  type="checkbox"
                  checked={d.stars.includes(s)}
                  onChange={() => field('stars', toggle(d.stars, s) as Finding['stars'])}
                />
                {s}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Quellen verknüpfen</legend>
          <div className="source-picker">
            {project.statements.map((s) => (
              <label className="check" key={s.id}>
                <input
                  type="checkbox"
                  checked={d.statementIds.includes(s.id)}
                  onChange={() => field('statementIds', toggle(d.statementIds, s.id))}
                />
                <span>
                  <strong>{s.id}</strong> · {s.interview} · {s.perspective}
                  <br />
                  {s.text}
                </span>
              </label>
            ))}
          </div>
          {!project.statements.length && (
            <p className="muted">Zunächst Problem Statements importieren.</p>
          )}
        </fieldset>
        <details>
          <summary>Kundenbewertung dokumentieren</summary>
          <p className="muted small">
            Freitext mit eigener Begründung, kein automatisch berechneter Schweregrad.
          </p>
          <div className="form-grid">
            <label>
              Schwere / Einstufung
              <input
                value={d.severity}
                placeholder="Unbewertet"
                onChange={(e) => field('severity', e.target.value)}
              />
            </label>
            <label>
              Bewertende Rolle
              <input
                value={d.assessmentRole}
                onChange={(e) => field('assessmentRole', e.target.value)}
              />
            </label>
            <label>
              Bewertungsdatum
              <input
                type="date"
                value={d.assessmentDate}
                onChange={(e) => field('assessmentDate', e.target.value)}
              />
            </label>
            <label>
              Begründung
              <textarea
                value={d.assessmentNote}
                onChange={(e) => field('assessmentNote', e.target.value)}
              />
            </label>
          </div>
        </details>
        <label className="check">
          <input
            type="checkbox"
            checked={d.released}
            onChange={(e) => field('released', e.target.checked)}
          />
          Für den Bericht zur Diskussion freigeben (Belege erforderlich)
        </label>
        <p className="hint">
          Deine Änderungen bleiben erhalten. Eine KI-Verarbeitung findet in diesem PoC nicht statt.
        </p>
        <Footer error={error} busy={busy} onClose={onClose} />
      </form>
    </Modal>
  );
}
export function RecommendationEditor({
  value,
  project,
  onSave,
  onClose,
}: EditorProps<Recommendation>) {
  const { draft: d, field, error, busy, submit } = useEditor(value, onSave);
  return (
    <Modal title="Empfehlung bearbeiten" onClose={onClose}>
      <form onSubmit={submit}>
        <span className="badge">{d.id}</span>
        <label>
          Titel
          <input required value={d.title} onChange={(e) => field('title', e.target.value)} />
        </label>
        <label>
          Beschreibung
          <textarea value={d.description} onChange={(e) => field('description', e.target.value)} />
        </label>
        <label>
          Erwartetes Ergebnis
          <textarea value={d.outcome} onChange={(e) => field('outcome', e.target.value)} />
        </label>
        <div className="form-grid">
          <label>
            Arbeitsebene
            <select
              value={d.level}
              onChange={(e) => field('level', e.target.value as Recommendation['level'])}
            >
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label>
            Umsetzungsaufwand / Annahme
            <input
              value={d.effort}
              placeholder="Offen"
              onChange={(e) => field('effort', e.target.value)}
            />
          </label>
        </div>
        <fieldset>
          <legend>Findings</legend>
          {project.findings.map((f) => (
            <label className="check" key={f.id}>
              <input
                type="checkbox"
                checked={d.findingIds.includes(f.id)}
                onChange={() => field('findingIds', toggle(d.findingIds, f.id))}
              />
              {f.id} · {f.title} {!f.released && '· Entwurf'}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Benötigt zuvor</legend>
          {project.recommendations
            .filter((r) => r.id !== d.id)
            .map((r) => (
              <label className="check" key={r.id}>
                <input
                  type="checkbox"
                  checked={d.dependencies.includes(r.id)}
                  onChange={() => field('dependencies', toggle(d.dependencies, r.id))}
                />
                {r.id} · {r.title}
              </label>
            ))}
        </fieldset>
        <label className="check">
          <input
            type="checkbox"
            checked={d.released}
            onChange={(e) => field('released', e.target.checked)}
          />
          Für den Ergebnisbericht freigeben
        </label>
        <Footer error={error} busy={busy} onClose={onClose} />
      </form>
    </Modal>
  );
}
export function ProcessEditor({ value, project, onSave, onClose }: EditorProps<ProcessStep>) {
  const { draft: d, field, error, busy, submit } = useEditor(value, onSave);
  return (
    <Modal title="Prozess und Reife bearbeiten" onClose={onClose}>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            Kernprozess
            <input required value={d.process} onChange={(e) => field('process', e.target.value)} />
          </label>
          <label>
            Prozessschritt
            <input required value={d.step} onChange={(e) => field('step', e.target.value)} />
          </label>
        </div>
        <div className="form-grid">
          {(['currentRole', 'targetRole'] as const).map((k) => (
            <label key={k}>
              {k === 'currentRole' ? 'RACI Ist' : 'RACI Ziel'}
              <select
                value={d[k]}
                onChange={(e) => field(k, e.target.value as ProcessStep[typeof k])}
              >
                {['Offen', 'R', 'A', 'C', 'I'].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          ))}
          {(['current', 'target'] as const).map((k) => (
            <label key={k}>
              {k === 'current' ? 'Reifegrad Ist' : 'Reifegrad Ziel'}
              <select
                value={d[k] ?? ''}
                onChange={(e) => field(k, e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Unbewertet</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <label>
          Quelle der Einschätzung
          <input value={d.source} onChange={(e) => field('source', e.target.value)} />
        </label>
        <label>
          Nachweis für die Zielreife
          <textarea value={d.evidence} onChange={(e) => field('evidence', e.target.value)} />
        </label>
        <fieldset>
          <legend>Verknüpfte Findings</legend>
          {project.findings.map((f) => (
            <label className="check" key={f.id}>
              <input
                type="checkbox"
                checked={d.findingIds.includes(f.id)}
                onChange={() => field('findingIds', toggle(d.findingIds, f.id))}
              />
              {f.id} · {f.title}
            </label>
          ))}
        </fieldset>
        <p className="hint">Eine Empfehlung erhöht die bewertete Ist-Reife nicht automatisch.</p>
        <Footer error={error} busy={busy} onClose={onClose} />
      </form>
    </Modal>
  );
}
