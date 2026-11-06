import { stars, type Project } from './schema';
export function radarMarkup(ratings: Project['starRatings']): string {
  const cx = 220,
    cy = 190,
    r = 132;
  const point = (i: number, value: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return `${cx + (Math.cos(a) * r * value) / 4},${cy + (Math.sin(a) * r * value) / 4}`;
  };
  const ring = (n: number) => stars.map((_, i) => point(i, n)).join(' ');
  const series = (key: 'current' | 'target') => {
    const values = stars.map((d) => ratings.find((r) => r.dimension === d)?.[key] ?? null);
    const polygon = values.every((v) => v !== null)
      ? `<polygon points="${values.map((v, i) => point(i, v!)).join(' ')}" class="radar-${key}"/>`
      : '';
    return (
      polygon +
      values
        .map((v, i) =>
          v === null
            ? ''
            : `<circle cx="${point(i, v).split(',')[0]}" cy="${point(i, v).split(',')[1]}" r="4" class="dot-${key}"/>`,
        )
        .join('')
    );
  };
  return `<svg viewBox="0 0 440 390" role="img" aria-label="STAR-Bewertung: Ist und Ziel. Einzelwerte stehen in der Textübersicht."><defs><radialGradient id="radar-glow"><stop offset="0" stop-color="#1c4b91" stop-opacity=".07"/><stop offset="1" stop-color="#1c4b91" stop-opacity="0"/></radialGradient></defs><circle cx="220" cy="190" r="160" fill="url(#radar-glow)"/><circle cx="220" cy="190" r="157" fill="none" stroke="#c4d4eb" stroke-dasharray="1 7"/>${[1, 2, 3, 4].map((n) => `<polygon points="${ring(n)}" fill="none" stroke="#dce4f0"/><text x="227" y="${cy - (r * n) / 4 + 4}" class="radar-scale">${n}</text>`).join('')}${stars
    .map((d, i) => {
      const [x, y] = point(i, 4.65).split(',').map(Number);
      return `<line x1="220" y1="190" x2="${point(i, 4).split(',')[0]}" y2="${point(i, 4).split(',')[1]}" stroke="#dce4f0"/><text x="${x}" y="${y}" text-anchor="${i === 0 ? 'middle' : i < 3 ? 'start' : 'end'}" class="radar-label">${d}</text>`;
    })
    .join(
      '',
    )}${series('target')}${series('current')}${ratings.every((r) => r.current === null && r.target === null) ? '<text x="220" y="190" text-anchor="middle" class="radar-scale">Noch unbewertet</text>' : ''}</svg>`;
}
export const radarCss = `.radar-current{fill:#1c4b9122;stroke:#1c4b91;stroke-width:2}.radar-target{fill:none;stroke:#4279c8;stroke-width:1.5;stroke-dasharray:5 5}.dot-current{fill:#1c4b91}.dot-target{fill:white;stroke:#4279c8;stroke-width:1.5}.radar-scale{font-size:11px;fill:#64748b}.radar-label{font-size:12px;fill:#334155}.radar svg{width:100%;max-height:390px}`;
