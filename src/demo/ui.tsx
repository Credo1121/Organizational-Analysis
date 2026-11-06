import type { ReactNode } from 'react';
import { Icon, type IconName } from './icons';
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="d-page-heading">
      <div>
        <div className="d-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="d-heading-actions">{children}</div>}
    </div>
  );
}
export function Action({
  children,
  onClick,
  icon = 'arrow',
  primary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: IconName;
  primary?: boolean;
}) {
  return (
    <button className={`d-button ${primary ? 'd-primary' : ''}`} onClick={onClick}>
      {children}
      <Icon name={icon} size={16} />
    </button>
  );
}
export function Pill({
  children,
  tone = 'blue',
}: {
  children: ReactNode;
  tone?: 'blue' | 'gray' | 'amber' | 'green';
}) {
  return <span className={`d-pill ${tone}`}>{children}</span>;
}
export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="d-empty">
      <Icon name="search" size={28} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
export function SectionTitle({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="d-section-title">
      <div>
        <div className="d-eyebrow">{label}</div>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
