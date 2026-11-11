import type { ReactNode } from 'react';

export const Hero = ({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) => (
  <section className="page-hero">
    {eyebrow && <span>{eyebrow}</span>}
    <h1>{title}</h1>
    {children && <p>{children}</p>}
  </section>
);

export const Alert = ({ children, kind = 'error' }: { children?: ReactNode; kind?: 'error' | 'success' }) =>
  children ? <div role="alert" className={`alert ${kind}`}>{children}</div> : null;

export const Empty = () => <div className="empty">Nothing to show yet.</div>;
export function Loader() { return <div className="loader">Loading&hellip;</div>; }
