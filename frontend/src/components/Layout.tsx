import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/classes', 'Classes'],
  ['/studio', 'Studio'],
  ['/gallery', 'Gallery'],
  ['/events', 'Events'],
  ['/blogs', 'Blog'],
  ['/contact', 'Contact'],
] as const;

type Settings = Record<string, string>;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    api.get('/public/settings').then(({ data }) => setSettings(data)).catch(() => undefined);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashboard = user?.role?.toLowerCase() === 'student' ? '/student' : '/admin';

  return <>
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-shell">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <img src="/images/omnaad-logo.png" alt="Om Naad Logo" />
          <span>Om Naad</span>
        </Link>
        <button className="menu" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span aria-hidden>{open ? '\u00d7' : '\u2630'}</span>
        </button>
        <nav className={open ? 'open' : ''} aria-label="Primary navigation">
          {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          <div className="nav-account">
            {user ? <>
              <Link className="outline compact" to={dashboard} onClick={() => setOpen(false)}>Dashboard</Link>
              <button className="nav-logout" onClick={() => void logout()}>Logout</button>
            </> : <Link className="outline compact" to="/login" onClick={() => setOpen(false)}>Login</Link>}
          </div>
        </nav>
      </div>
    </header>

    <main>{children}</main>

    <footer className="site-footer">
      <div className="footer-glow footer-glow-one" />
      <div className="footer-glow footer-glow-two" />
      <div className="footer-grid">
        <div className="footer-brand">
          <Link className="brand" to="/"><img src="/images/omnaad-logo.png" alt="Om Naad Logo" /><span>Om Naad</span></Link>
          <p>Premium music academy and Jam Room in Ahmedabad. Learn, create and perform in an inspiring environment.</p>
          <div className="social-links">
            {settings.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram" /></a>}
            {settings.social_youtube && <a href={settings.social_youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fab fa-youtube" /></a>}
            {settings.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>}
          </div>
        </div>
        <FooterColumn title="Quick Links" links={links.slice(1, 7)} />
        <div className="footer-column"><h4>Our Services</h4><Link to="/admission/guitar">Guitar Classes</Link><Link to="/admission/vocal-class">Vocal Training</Link><Link to="/admission/piano">Piano Lessons</Link><Link to="/jam-session">Jam Session</Link><Link to="/contact">Hire Artist</Link></div>
        <div className="footer-column"><h4>Policy Pages</h4><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-conditions">Terms & Conditions</Link><Link to="/refund-policy">Refund & Cancellation</Link></div>
        <div className="footer-column footer-contact"><h4>Contact Us</h4><p><i className="fas fa-map-marker-alt" />{settings.address || 'Om Naad Music Academy, Ahmedabad, Gujarat, India'}</p><p><i className="fas fa-phone-alt" />{settings.contact_phone || '+91 74900 70921'}</p><p><i className="fas fa-envelope" />{settings.contact_email || 'hello@omnaad.com'}</p></div>
      </div>
      <div className="footer-bottom">&copy; {new Date().getFullYear()} Om Naad Music Academy. All rights reserved.</div>
    </footer>
  </>;
}

function FooterColumn({ title, links: items }: { title: string; links: readonly (readonly [string, string])[] }) {
  return <div className="footer-column"><h4>{title}</h4>{items.map(([to, label]) => <Link key={to} to={to}><i className="fas fa-chevron-right" />{label}</Link>)}</div>;
}
