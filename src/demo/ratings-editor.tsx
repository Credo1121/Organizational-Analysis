import { useState, type FormEvent } from 'react';
import { Modal } from '../components/modal';
import type { Project } from '../domain/schema';
export function RatingsEditor({
  project,
  onSave,
  onClose,
}: {
  project: Project;
  onSave: (ratings: Project['starRatings']) => void;
  onClose: () => void;
}) {
  const [ratings, setRatings] = useState(structuredClone(project.starRatings)),
    [error, setError] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      onSave(ratings);
    } catch (error) {
      setError((error as Error).message);
    }
  }
  return (
    <Modal title="STAR-Bewertungen bearbeiten" onClose={onClose}>
      <p className="d-inline-note">
        Manuelle Demo-Bewertung auf einer Skala von 1–4. Hinterlege deine Bewertungsgrundlage;
        daraus entsteht keine automatische Reife- oder Wirkungsberechnung.
      </p>
      <form onSubmit={submit}>
        {ratings.map((r, i) => (
          <fieldset key={r.dimension}>
            <legend>{r.dimension}</legend>
            <div className="form-grid">
              {(['current', 'target'] as const).map((key) => (
                <label key={key}>
                  {key === 'current' ? 'Ist' : 'Ziel'}
                  <select
                    aria-label={`${key === 'current' ? 'Ist' : 'Ziel'} ${r.dimension}`}
                    value={r[key] ?? ''}
                    onChange={(event) =>
                      setRatings(
                        ratings.map((row, j) =>
                          i === j
                            ? {
                                ...row,
                                [key]: event.target.value ? Number(event.target.value) : null,
                              }
                            : row,
                        ),
                      )
                    }
                  >
                    <option value="">Unbewertet</option>
                    {[1, 2, 3, 4].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <label>
              Bewertungsgrundlage {r.dimension}
              <textarea
                required={r.current !== null || r.target !== null}
                value={r.rationale}
                onChange={(event) =>
                  setRatings(
                    ratings.map((row, j) =>
                      i === j ? { ...row, rationale: event.target.value } : row,
                    ),
                  )
                }
              />
            </label>
          </fieldset>
        ))}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-footer">
          <button className="primary">Bewertungen speichern</button>
          <button type="button" onClick={onClose}>
            Abbrechen
          </button>
        </div>
      </form>
    </Modal>
  );
}
