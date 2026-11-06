import { useId } from 'react';
import { stars, type Project } from '../domain/schema';
export function ProfileRadar({
  project,
  selected,
  onSelect,
  interactive = true,
}: {
  project: Project;
  selected: string;
  onSelect: (s: string) => void;
  interactive?: boolean;
}) {
  const uid = useId();
  const cx = 260,
    cy = 205,
    r = 145;
  const point = (i: number, value: number) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    return [cx + (Math.cos(a) * r * value) / 4, cy + (Math.sin(a) * r * value) / 4];
  };
  const coords = (n: number) => stars.map((_, i) => point(i, n).join(',')).join(' ');
  const data = (key: 'current' | 'target') =>
    stars.map((d) => project.starRatings.find((x) => x.dimension === d)?.[key] ?? null);
  return (
    <div className="d-radar">
      <svg
        viewBox="0 0 520 420"
        role={interactive ? 'group' : 'img'}
        aria-label="STAR-Profil mit fiktiven Ist- und Zielbewertungen"
      >
        <defs>
          <radialGradient id={uid}>
            <stop stopColor="#3f7ed1" stopOpacity=".12" />
            <stop offset="1" stopColor="#3f7ed1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-fill`} x2="1" y2="1">
            <stop stopColor="#2461ae" stopOpacity=".28" />
            <stop offset="1" stopColor="#2461ae" stopOpacity=".05" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r="175" fill={`url(#${uid})`} />
        <circle cx={cx} cy={cy} r="169" className="d-orbit" />
        {[1, 2, 3, 4].map((n) => (
          <g key={n}>
            <polygon points={coords(n)} className="d-grid" />
            <text x="268" y={cy - (r * n) / 4 + 4} className="d-scale">
              {n}
            </text>
          </g>
        ))}
        {stars.map((s, i) => {
          const [x, y] = point(i, 4);
          const [lx, ly] = point(i, 4.85);
          return (
            <g
              key={s}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={interactive ? `Dimension ${s} öffnen` : undefined}
              className={`d-axis ${selected === s ? 'selected' : ''}`}
              onClick={interactive ? () => onSelect(s) : undefined}
              onKeyDown={(e) => {
                if (interactive && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelect(s);
                }
              }}
            >
              <line x1={cx} y1={cy} x2={x} y2={y} />
              <circle cx={x} cy={y} r="3" />
              <text x={lx} y={ly} textAnchor={i === 0 ? 'middle' : i < 3 ? 'start' : 'end'}>
                {s}
              </text>
            </g>
          );
        })}
        {(['target', 'current'] as const).map((key) => {
          const values = data(key);
          return (
            <g key={key}>
              {values.every((v) => v !== null) && (
                <polygon
                  className={`d-polygon ${key}`}
                  points={values.map((v, i) => point(i, v!).join(',')).join(' ')}
                  fill={key === 'current' ? `url(#${uid}-fill)` : 'none'}
                />
              )}
              {values.map(
                (v, i) =>
                  v !== null && (
                    <circle
                      key={i}
                      cx={point(i, v)[0]}
                      cy={point(i, v)[1]}
                      r={key === 'current' ? 4.2 : 3.7}
                      className={`d-node ${key}`}
                    />
                  ),
              )}
            </g>
          );
        })}
      </svg>
      <div className="d-chart-legend">
        <span>
          <i />
          Ist-Bild
        </span>
        <span>
          <i className="d-dashed" />
          Zielbild
        </span>
      </div>
      <div className="d-sr-only">
        {project.starRatings.map((rating) => (
          <p key={rating.dimension}>
            {rating.dimension}: Ist {rating.current ?? 'unbewertet'}, Ziel{' '}
            {rating.target ?? 'unbewertet'}. {rating.rationale}
          </p>
        ))}
      </div>
    </div>
  );
}
