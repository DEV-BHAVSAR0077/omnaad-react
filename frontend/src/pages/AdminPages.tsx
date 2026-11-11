import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { api, media, message } from '../api';
import { useAuth } from '../auth';
import { Alert, Loader } from '../components/Ui';
import type { Item, Page } from '../types';

type Field = { name: string; label: string; type?: string; required?: boolean; options?: string[] };
type Meta = { label: string; fields: Field[]; readOnly: boolean };
type NavItem = { path: string; label: string };
type NavGroup = { label: string; icon: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  { label: 'User Management', icon: 'fa-user-shield', items: [{ path: 'users', label: 'Users' }, { path: 'roles', label: 'Roles' }] },
  { label: 'People', icon: 'fa-users', items: [{ path: 'students', label: 'Students' }, { path: 'instructors', label: 'Instructors' }] },
  { label: 'Academic Mgt', icon: 'fa-graduation-cap', items: [{ path: 'courses', label: 'Courses' }, { path: 'enrollments', label: 'Enrollments' }, { path: 'attendance', label: 'Attendance' }] },
  { label: 'Finance', icon: 'fa-file-invoice-dollar', items: [{ path: 'payments', label: 'Payments' }, { path: 'payment-categories', label: 'Payment Categories' }, { path: 'expenses', label: 'Expenses' }, { path: 'expense-categories', label: 'Expense Categories' }] },
  { label: 'Content Mgt', icon: 'fa-photo-video', items: [{ path: 'blogs', label: 'Blogs' }, { path: 'testimonials', label: 'Testimonials' }, { path: 'gallery-items', label: 'Gallery Items' }, { path: 'gallery-categories', label: 'Gallery Categories' }] },
  { label: 'Events Mgt', icon: 'fa-calendar-alt', items: [{ path: 'events', label: 'Events' }, { path: 'event-registrations', label: 'Registrations' }] },
  { label: 'Communication', icon: 'fa-envelope', items: [{ path: 'inquiries', label: 'Inquiries' }, { path: 'jam-sessions', label: 'Jam Sessions' }] },
  { label: 'Reports', icon: 'fa-chart-bar', items: [{ path: 'reports', label: 'System Reports' }] },
  { label: 'System', icon: 'fa-cog', items: [{ path: 'settings', label: 'Settings' }] },
];

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return <div className={`admin-shell${collapsed ? ' sidebar-collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
    <button className="admin-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <Link to="/admin"><img src="/images/omnaad-logo.png" alt="Om Naad" /><span>Om Naad</span></Link>
      </div>
      <nav className="admin-nav" aria-label="Administration">
        <NavLink className="admin-nav-home" to="/admin" end title="Dashboard"><i className="fas fa-home" /><span>Dashboard</span></NavLink>
        {navGroups.map(group => {
          const active = group.items.some(item => location.pathname === `/admin/${item.path}`);
          return <details key={group.label} open={active || undefined}>
            <summary className={active ? 'active' : ''} title={group.label}><span><i className={`fas ${group.icon}`} /><b>{group.label}</b></span><i className="fas fa-chevron-down chevron" /></summary>
            <div className="admin-submenu">{group.items.map(item => <NavLink key={item.path} to={`/admin/${item.path}`}><i /> <span>{item.label}</span></NavLink>)}</div>
          </details>;
        })}
      </nav>
    </aside>
    <div className="admin-main-wrapper">
      <header className="admin-navbar">
        <div>
          <button className="admin-icon-button mobile-toggle" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><i className="fas fa-bars" /></button>
          <button className="admin-icon-button desktop-toggle" aria-label="Toggle navigation width" onClick={() => setCollapsed(value => !value)}><i className="fas fa-bars" /></button>
        </div>
        <div className="admin-account">
          <span className="admin-user"><span>{user?.email}</span><b>{user?.role || 'Admin'}</b></span>
          <Link className="admin-site-link" to="/">Website</Link>
          <button className="admin-signout" onClick={() => void logout()}>Sign Out</button>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  </div>;
}

const icons: Record<string, string> = { users: 'fa-users', students: 'fa-user-graduate', teachers: 'fa-chalkboard-teacher', courses: 'fa-book-open', events: 'fa-calendar-alt', jam_sessions: 'fa-microphone-alt' };
const number = new Intl.NumberFormat('en-IN');
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/admin/dashboard').then(response => setData(response.data)).catch(reason => setError(message(reason))); }, []);
  return <Shell>
    <div className="dashboard-header"><div><h1>Overview</h1><p>Welcome back, {user?.name}. Here's what's happening with your studio today.</p></div><span className="online-status"><i />Studio Online &amp; Active</span></div>
    <Alert>{error}</Alert>
    {!data ? <Loader /> : <>
      <section className="admin-metrics">
        {Object.entries(data.counts).map(([name, value]) => <article className="admin-metric" key={name}><i className={`fas ${icons[name] || 'fa-chart-simple'}`} /><div><span>{name.replaceAll('_', ' ')}</span><strong>{number.format(Number(value))}</strong></div></article>)}
        <article className="admin-metric featured"><i className="fas fa-indian-rupee-sign" /><div><span>Total Revenue</span><strong>{currency.format(Number(data.revenue))}</strong></div></article>
        <article className="admin-metric"><i className="fas fa-clock" /><div><span>Pending Payments</span><strong>{number.format(Number(data.pendingPayments))}</strong></div></article>
      </section>
      <section className="admin-dashboard-grid">
        <article className="admin-panel quick-panel"><PanelTitle icon="fa-bolt">Quick Actions</PanelTitle><div className="quick-actions"><Link to="/admin/students"><i className="fas fa-user-plus" /><span>Add Student</span></Link><Link to="/admin/instructors"><i className="fas fa-chalkboard-teacher" /><span>Add Teacher</span></Link><Link to="/admin/payments"><i className="fas fa-indian-rupee-sign" /><span>Record Payment</span></Link><Link to="/admin/events"><i className="fas fa-calendar-plus" /><span>Create Event</span></Link></div></article>
        <article className="admin-panel recent-panel"><PanelTitle icon="fa-file-invoice">Recent Payments</PanelTitle><DataTable rows={data.recentPayments} limit={5} /></article>
        <article className="admin-panel events-panel"><PanelTitle icon="fa-calendar-check">Upcoming Events</PanelTitle><DataTable rows={data.upcomingEvents} limit={5} /></article>
      </section>
    </>}
  </Shell>;
}

function PanelTitle({ icon, children }: { icon: string; children: React.ReactNode }) { return <h2 className="admin-panel-title"><i className={`fas ${icon}`} />{children}</h2>; }

export function AdminResource() {
  const { resource = '' } = useParams();
  const [meta, setMeta] = useState<Record<string, Meta>>({});
  const [page, setPage] = useState<Page<Item> | null>(null);
  const [edit, setEdit] = useState<Item | null | undefined>(undefined);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const definition = meta[resource];
  const load = () => api.get(`/admin/${resource}`, { params: { search } }).then(response => setPage(response.data)).catch(reason => setError(message(reason)));
  useEffect(() => { api.get('/admin/metadata').then(response => setMeta(response.data)).catch(reason => setError(message(reason))); }, []);
  useEffect(() => { if (definition) void load(); }, [resource, definition]);
  if (!definition) return <Shell>{error ? <Alert>{error}</Alert> : <Loader />}</Shell>;
  const remove = async (id: number) => { if (!confirm('Delete this record?')) return; try { await api.delete(`/admin/${resource}/${id}`); void load(); } catch (reason) { setError(message(reason)); } };
  return <Shell><section className="admin-panel resource-panel"><div className="admin-panel-header"><div><h1>{definition.label}</h1><p>View and manage {definition.label.toLowerCase()}.</p></div><div className="admin-panel-actions"><div className="admin-search"><i className="fas fa-search" /><input value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => event.key === 'Enter' && load()} placeholder="Search" /></div><button className="admin-btn ghost" onClick={load}>Search</button>{!definition.readOnly && <button className="admin-btn primary" onClick={() => setEdit(null)}><i className="fas fa-plus" />Add New</button>}</div></div><Alert>{error}</Alert>{!page ? <Loader /> : <DataTable rows={page.data} actions={row => <>{!definition.readOnly && <button className="admin-btn edit" onClick={() => setEdit(row)}><i className="fas fa-pen" />Edit</button>}<button className="admin-btn danger" onClick={() => void remove(row.id)}><i className="fas fa-trash" />Delete</button></>} />}</section>{edit !== undefined && <ResourceForm resource={resource} meta={definition} item={edit} close={() => setEdit(undefined)} saved={() => { setEdit(undefined); void load(); }} />}</Shell>;
}

function ResourceForm({ resource, meta, item, close, saved }: { resource: string; meta: Meta; item: Item | null; close: () => void; saved: () => void }) {
  const [state, setState] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setState('Saving...'); const data: Record<string, unknown> = Object.fromEntries(new FormData(event.currentTarget));
    try { for (const field of meta.fields.filter(value => value.type === 'file')) { const file = data[field.name]; if (file instanceof File && file.size) { const upload = new FormData(); upload.set('file', file); data[field.name] = (await api.post('/admin/upload', upload)).data.path; } else delete data[field.name]; } for (const field of meta.fields.filter(value => value.type === 'boolean')) data[field.name] = (event.currentTarget.elements.namedItem(field.name) as HTMLInputElement)?.checked; await api[item ? 'patch' : 'post'](`/admin/${resource}${item ? `/${item.id}` : ''}`, data); saved(); } catch (error) { setState(message(error)); }
  };
  return <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="resource-form-title"><form className="admin-form" onSubmit={submit}><div className="admin-form-header"><div><span>{item ? 'Update Record' : 'New Record'}</span><h2 id="resource-form-title">{item ? 'Edit' : 'Add'} {meta.label}</h2></div><button type="button" className="admin-icon-button" aria-label="Close" onClick={close}><i className="fas fa-xmark" /></button></div><Alert>{state}</Alert><div className="admin-form-grid">{meta.fields.map(field => <DynamicField key={field.name} field={field} value={item?.[field.name]} />)}</div><div className="admin-form-actions"><button type="button" className="admin-btn ghost" onClick={close}>Cancel</button><button className="admin-btn primary"><i className="fas fa-check" />Save</button></div></form></div>;
}

function DynamicField({ field, value }: { field: Field; value: unknown }) {
  if (field.type === 'textarea') return <label className="admin-field full"><span>{field.label}</span><textarea name={field.name} defaultValue={String(value || '')} required={field.required} /></label>;
  if (field.type === 'boolean') return <label className="admin-check"><input name={field.name} type="checkbox" defaultChecked={Boolean(value)} /><span>{field.label}</span></label>;
  if (field.type === 'select') return <label className="admin-field"><span>{field.label}</span><select name={field.name} defaultValue={String(value || '')} required={field.required}><option value="">Select</option>{field.options?.map(option => <option key={option}>{option}</option>)}</select></label>;
  return <label className="admin-field"><span>{field.label}</span><input name={field.name} type={field.type || 'text'} defaultValue={field.type === 'file' ? undefined : String(value || '')} required={field.required && !value} />{field.type === 'file' && Boolean(value) && <a href={media(value)} target="_blank" rel="noreferrer">View current file</a>}</label>;
}

export function Settings() {
  const [data, setData] = useState<Record<string, string> | null>(null); const [state, setState] = useState('');
  useEffect(() => { api.get('/admin/settings').then(response => setData(response.data)).catch(reason => setState(message(reason))); }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { setData((await api.patch('/admin/settings', Object.fromEntries(new FormData(event.currentTarget)))).data); setState('Settings saved.'); } catch (error) { setState(message(error)); } };
  return <Shell><section className="admin-panel resource-panel"><div className="admin-panel-header"><div><h1>Site Settings</h1><p>Update public contact and social details.</p></div></div>{!data ? <Loader /> : <form className="admin-settings-form" onSubmit={submit}><Alert kind={state.includes('saved') ? 'success' : 'error'}>{state}</Alert><div className="admin-form-grid">{['contact_phone', 'contact_email', 'address', 'social_instagram', 'social_youtube', 'social_facebook', 'jam_session_bg_image'].map(key => <label className={`admin-field${key === 'address' ? ' full' : ''}`} key={key}><span>{key.replaceAll('_', ' ')}</span><input name={key} defaultValue={data[key] || ''} /></label>)}</div><div className="admin-form-actions"><button className="admin-btn primary"><i className="fas fa-check" />Save Settings</button></div></form>}</section></Shell>;
}

export function Reports() { return <Shell><div className="dashboard-header"><div><h1>Reports</h1><p>Download current business records as CSV files.</p></div></div><div className="report-grid">{['users', 'students', 'payments', 'expenses'].map(type => <a className="report-card" key={type} href={`/api/admin/reports/${type}`}><i className="fas fa-file-csv" /><div><h2>{type}</h2><p>Download CSV</p></div><i className="fas fa-download" /></a>)}</div></Shell>; }

function DataTable({ rows, actions, limit }: { rows: any[]; actions?: (row: any) => React.ReactNode; limit?: number }) {
  if (!rows?.length) return <div className="admin-empty"><i className="far fa-folder-open" /><p>No records found.</p></div>;
  const visibleRows = limit ? rows.slice(0, limit) : rows;
  const keys = Object.keys(rows[0]).filter(key => !['password', 'remember_token', 'gateway_response', 'digital_signature', 'content', 'full_description'].includes(key)).slice(0, limit ? 4 : 10);
  const cell = (key: string, value: unknown) => { if (value == null || value === '') return '-'; if (typeof value === 'boolean') return value ? 'Yes' : 'No'; if (typeof value === 'object') return JSON.stringify(value); if (key === 'amount' || key.endsWith('_amount')) return currency.format(Number(value)); return String(value); };
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{keys.map(key => <th key={key}>{key.replaceAll('_', ' ')}</th>)}{actions && <th>Actions</th>}</tr></thead><tbody>{visibleRows.map((row, index) => <tr key={row.id || index}>{keys.map(key => <td key={key} title={cell(key, row[key])}>{cell(key, row[key])}</td>)}{actions && <td><div className="admin-row-actions">{actions(row)}</div></td>}</tr>)}</tbody></table></div>;
}


