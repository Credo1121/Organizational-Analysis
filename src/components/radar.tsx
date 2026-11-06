import { radarMarkup } from '@/domain/radar';
import { type Project } from '@/domain/schema';
export function Radar({ project }: { project: Project }) {
  return (
    <>
      <div
        className="radar"
        dangerouslySetInnerHTML={{ __html: radarMarkup(project.starRatings) }}
      />
      <div className="radar-legend">
        <span>
          <i className="line" />
          Ist
        </span>
        <span>
          <i className="line dashed" />
          Ziel
        </span>
      </div>
      <p className="muted small center">Manuelle Bewertung · keine automatische Berechnung</p>
    </>
  );
}
