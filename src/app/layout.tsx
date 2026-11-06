import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'OrgLens · Organisationsanalyse',
  description: 'Lokaler Arbeitsbereich für quellenbasierte Organisationsanalyse.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
