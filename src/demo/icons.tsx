export type IconName =
  | 'overview'
  | 'sources'
  | 'findings'
  | 'perspectives'
  | 'processes'
  | 'target'
  | 'recommendations'
  | 'report'
  | 'arrow'
  | 'chevron'
  | 'search'
  | 'plus'
  | 'edit'
  | 'check'
  | 'reset'
  | 'menu'
  | 'close'
  | 'external'
  | 'grip'
  | 'download'
  | 'shield'
  | 'spark';
const paths: Record<IconName, string> = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  sources: 'M5 3h10l4 4v14H5z M14 3v5h5 M8 12h8 M8 16h6',
  findings: 'M12 3 3 8l9 5 9-5-9-5z M3 12l9 5 9-5 M3 16l9 5 9-5',
  perspectives: 'M3 7h16 M15 3l4 4-4 4 M21 17H5 M9 13l-4 4 4 4',
  processes: 'M4 4h6v6H4z M14 14h6v6h-6z M10 7h7v7 M7 10v7h7',
  target: 'M20 12a8 8 0 1 1-8-8 M16 3h5v5 M21 3l-9 9 M15 12a3 3 0 1 1-3-3',
  recommendations: 'M5 19 19 5 M7 5h12v12',
  report: 'M4 3h16v18H4z M8 7h8 M8 11h8 M8 15h3 M14 15h2',
  arrow: 'M4 12h16 M14 6l6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  search: 'M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  plus: 'M12 4v16 M4 12h16',
  edit: 'm15 4 5 5 M4 20l4-1L21 6l-5-5L3 14l-1 6z',
  check: 'm5 12 4 4L19 6',
  reset: 'M4 9a8 8 0 1 1 0 7 M4 3v6h6',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  close: 'm6 6 12 12 M6 18 18 6',
  external: 'M14 3h7v7 M21 3l-11 11 M10 3H3v18h18v-7',
  grip: 'M9 5h.01 M15 5h.01 M9 12h.01 M15 12h.01 M9 19h.01 M15 19h.01',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z',
};
export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function BrandMark() {
  return (
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#1c4b91" />
      <path
        d="M11 25V15m6 14V11m6 16V13m6 10v-6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
