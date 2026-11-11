import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api, media, message } from '../api';
import { Alert, Empty, Hero, Loader } from '../components/Ui';
import type { Item, Page } from '../types';
import { TestimonialCarousel } from './ReplicaPages';

type Settings = Record<string, string>;
const plain = (html: unknown) => String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export function Home() {
  const [data, setData] = useState<Record<string, any> | null>(null);
  useEffect(() => { api.get('/public/home').then(({ data: response }) => setData(response)); }, []);
  return <>
    <section className="home-hero">
      <div className="hero-overlay" />
      <div className="home-hero-content">
        <h1><span className="gradient">Where music takes over</span><br />Learn &bull; Jam &bull; Create</h1>
        <p>A creative space where learning, collaboration and music come together.</p>
        <div className="actions"><Link className="primary" to="/classes">Book Class Now</Link><Link className="outline" to="/studio">Explore Studio</Link></div>
      </div>
      <div className="waveform" aria-hidden>{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ animationDelay: `${(index % 10) * -0.09}s`, height: `${24 + ((index * 37) % 72)}%` }} />)}</div>
    </section>

    <section className="section section-wide services-section">
      <SectionHeading eyebrow="What We Do" title="Our Core Services" />
      <div className="service-grid">
        <Service icon="fa-guitar" title="Music Academy" text="Professional training in Guitar, Keyboard, Vocals, Drums, Tabla, Flute and Music Theory from experienced industry professionals." to="/classes" action="Explore Classes" />
        <Service icon="fa-microphone-alt" title="Jam Room" text="A fully equipped space for rehearsals and Jam sessions. Just bring your music, we'll take care of the rest." to="/jam-session" action="Book Session" />
        <Service icon="fa-compact-disc" title="Live Recordings & Events" text="Every performance deserves to be remembered. We bring it to life through live recordings and events." to="/contact" action="Contact Us" />
      </div>
    </section>

    <section className="section section-wide stories-section">
      <SectionHeading eyebrow="Student Stories" title={<>What Our <em>Community</em> Says</>} />
      <TestimonialCarousel items={data?.testimonials || []} />
    </section>

    <section className="culture-section">
      <div className="culture-overlay" />
      <div className="culture-grid">
        <div><p className="eyebrow">Our Culture</p><h2>Where Passion Meets Profession</h2><p>At Om Naad, we believe every student has a unique sound waiting to be discovered. Academy training combined with real-world studio experience gives our students an unparalleled advantage.</p><ul><li>Certified Courses & Workshops</li><li>Professional Studio Environment</li><li>Live Performance Opportunities</li></ul></div>
        <div className="image-mosaic"><img src="https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=1000&auto=format&fit=crop" alt="Student playing guitar" /><img src="/images/live_performance_1780025782502.png" alt="Live performance" /><img src="/images/acoustic_guitar_1780025764212.png" alt="Acoustic guitar" /><img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop" alt="Music studio" /></div>
      </div>
    </section>
  </>;
}

function Service({ icon, title, text, to, action }: { icon: string; title: string; text: string; to: string; action: string }) {
  return <article className="service-card"><div className="service-icon"><i className={`fas ${icon}`} /></div><h3>{title}</h3><p>{text}</p><Link className="primary" to={to}>{action} <i className="fas fa-arrow-right" /></Link></article>;
}

const SectionHeading = ({ eyebrow, title }: { eyebrow: string; title: React.ReactNode }) => <div className="section-heading"><span>{eyebrow}</span><h2>{title}</h2></div>;

export function About() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  useEffect(() => { Promise.all([api.get('/public/instructors'), api.get('/public/settings')]).then(([people, site]) => { setInstructors(people.data); setSettings(site.data); }); }, []);
  const offerOne = (settings.offer_col1_courses || 'Drums\nKeyboards\nGuitar\nMusic Theory').split(/\r?\n/).filter(Boolean);
  const offerTwo = (settings.offer_col2_courses || 'Tabla\nVocals\nDjembe & Cajon').split(/\r?\n/).filter(Boolean);
  return <>
    <section className="about-hero"><div className="hero-overlay" /><div><span className="pill">Our Story</span><h1>Welcome to<br /><em>Om Naad Music Academy</em></h1><p>Music is more than notes on a page; it is a profound journey of self-expression. We cultivate an environment where tradition meets modern mastery.</p></div></section>
    <section className="section split founder-section">
      <div className="portrait-frame"><img src={settings.founder_photo ? media(settings.founder_photo) : '/images/omnaad_full.png'} alt={settings.founder_name || 'Om Naad founder'} /><div><h3>{settings.founder_name || 'Parth Bhavsar'}</h3><span>{settings.founder_title || 'Founder & Mentor'}</span></div></div>
      <div><p className="eyebrow line">Meet the Heart</p><h2 className="gold-script">{settings.founder_name || 'Parth Bhavsar'}</h2><p className="prose preline">{settings.founder_bio || 'Founder and mentor at Om Naad Music Academy, dedicated to helping every student discover the joy of music.'}</p><div className="number-grid"><div><strong>{settings.founder_experience || '15'}<em>+</em></strong><span>Years Experience</span></div><div><strong>{settings.founder_performances || '2000'}<em>+</em></strong><span>Live Performances</span></div></div></div>
    </section>
    <section className="section section-wide faculty-section"><div className="left-heading"><h2>Distinguished <em>Faculty</em></h2><p>Masters of their craft, dedicated to your growth.</p></div><div className="faculty-grid">{instructors.map(person => <article className="faculty-card" key={person.id}>{person.profile_image ? <img src={media(person.profile_image)} alt={person.name} /> : <div className="initial">{person.name?.[0]}</div>}<div className="faculty-copy"><span>{person.specialization || 'Music Mentor'}</span><h3>{person.name}</h3><p>{person.bio}</p></div></article>)}</div></section>
    <section className="section identity-section"><SectionHeading eyebrow="Core Identity" title="What guides us" /><div className="identity-grid"><Identity icon="fa-eye" title="Our Vision">To nurture musical talent and inspire a lifelong love for music.</Identity><Identity icon="fa-heart" title="Our Values">Excellence, creativity, passion and a collaborative musical community.</Identity><Identity icon="fa-flag" title="Our Mission">Accessible, high-quality education that builds technical skill and artistic confidence.</Identity></div></section>
    <section className="section offers-section"><SectionHeading eyebrow="What We Offer" title="Courses for every ambition" /><div className="offer-grid"><Offer title={settings.offer_col1_title || 'Om Naad Professional Certificates'} items={offerOne} /><Offer title={settings.offer_col2_title || 'Om Naad Certified Courses'} items={offerTwo} /></div></section>
    <section className="section why-section"><SectionHeading eyebrow="Why Choose Om Naad?" title="Learn in a professional culture" /><div className="why-grid"><MiniFeature icon="fa-user-graduate" title="Expert Mentorship" /><MiniFeature icon="fa-globe" title="Global Recognition" /><MiniFeature icon="fa-chalkboard-teacher" title="Hands-on Training" /><MiniFeature icon="fa-clock" title="Flexible Scheduling" /></div></section>
  </>;
}

function Identity({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) { return <article className="identity-card"><i className={`far ${icon}`} /><h3>{title}</h3><p>{children}</p></article>; }
function Offer({ title, items }: { title: string; items: string[] }) { return <article className="offer-card"><h3>{title}</h3><ul>{items.map(item => <li key={item}><i className="far fa-check-circle" />{item}</li>)}</ul></article>; }
function MiniFeature({ icon, title }: { icon: string; title: string }) { return <article className="mini-feature"><i className={`fas ${icon}`} /><h3>{title}</h3></article>; }

export function Studio() {
  return <>
    <section className="studio-hero"><div className="hero-overlay" /><div className="studio-hero-grid"><div><span className="pill">Pro Audio Lab</span><h1>Bring Your <em>Vision</em> To Life.</h1><p>State-of-the-art acoustic treatment, industry-standard microphones, and analog-digital hybrid mixing workflows.</p><div className="actions left"><Link className="primary" to="/jam-session">Book Session</Link><Link className="outline" to="/studio/tour"><i className="fas fa-play" /> Studio Tour</Link></div></div><img src="https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1200&auto=format&fit=crop" alt="Microphone in studio" /></div></section>
    <section className="section section-wide studio-services"><SectionHeading eyebrow="Professional Sound" title="Studio Services" /><div className="studio-service-grid"><StudioService icon="fa-microphone-lines" title="Vocal & Instrument Tracking">Capture pristine audio with premium microphones and professional preamps.</StudioService><StudioService icon="fa-sliders-h" title="Mixing & Mastering">Prepare tracks for streaming, radio and release with professional balancing.</StudioService><StudioService icon="fa-video" title="Reel / YouTube Audio">Background scores, foley and vocal dubbing optimized for social media.</StudioService><StudioService icon="fa-podcast" title="Podcast Recording">Multi-mic recording in a soundproof, distraction-free environment.</StudioService></div></section>
  </>;
}
function StudioService({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) { return <article className="studio-service"><i className={`fas ${icon}`} /><div><h3>{title}</h3><p>{children}</p></div></article>; }

const endpoint = { classes: 'courses', events: 'events', blogs: 'blogs', gallery: 'gallery' } as const;
export function Collection({ kind }: { kind: keyof typeof endpoint }) {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search] = useSearchParams();
  useEffect(() => { setLoading(true); api.get(`/public/${endpoint[kind]}`, { params: { page: search.get('page') || 1, category: search.get('category') } }).then(response => setData(Array.isArray(response.data) ? response.data : (response.data as Page<Item>).data)).finally(() => setLoading(false)); }, [kind, search]);
  if (kind === 'classes') return <><section className="collection-hero"><h1>Master Your <em>Craft</em></h1><p>Explore our premium selection of certified and hobby courses. Whether you are beginning your musical journey or refining your mastery, the stage is yours.</p></section><section className="section section-wide">{loading ? <Loader /> : data.length ? <div className="course-grid">{data.map(item => <CourseCard key={item.id} item={item} />)}</div> : <Empty />}<div className="cta-panel"><h2>Can't find what you're<br />looking for?</h2><p>Contact us to discuss personalized curriculum, master classes, or specific instrument availability.</p><Link className="outline" to="/contact">Get in Touch</Link></div></section></>;
  const copy = { events: ['Events & Workshops', 'Experience live music, workshops and masterclasses with the Om Naad community.'], blogs: ['The Echo Blog', 'Perspectives on music theory, performance mastery and the creative journey.'], gallery: ['Gallery', 'A visual journey through performances, masterclasses and moments of dedication.'] }[kind];
  return <><section className="collection-hero"><h1>{copy[0]}</h1><p>{copy[1]}</p></section><section className="section section-wide">{loading ? <Loader /> : data.length ? <div className={`content-grid ${kind}`}>{data.map(item => <ContentCard key={item.id} item={item} to={kind === 'events' ? `/events/${item.slug}` : kind === 'blogs' ? `/blogs/${item.slug}` : undefined} />)}</div> : <Empty />}</section></>;
}
function CourseCard({ item }: { item: Item }) { const image = item.image; return <Link className="course-card" to={`/admission/${item.slug}`}><div className="card-media">{image ? <img src={media(image)} alt={String(item.title)} /> : <i className="fas fa-music" />}<span>{String(item.type || 'Certified Course')}</span></div><div><h3>{String(item.title)}</h3><p>{plain(item.description)}</p></div></Link>; }
function ContentCard({ item, to }: { item: Item; to?: string }) { const image = item.banner_image || item.featured_image || item.media_path || item.image; const body = <><div className="card-media">{image ? <img src={media(image)} alt={String(item.title || item.name || '')} /> : <i className="fas fa-music" />}</div><div className="content-card-copy"><span>{String(item.event_type || item.category_name || '')}</span><h3>{String(item.title || item.name || 'Untitled')}</h3><p>{plain(item.short_description || item.excerpt || item.description).slice(0, 170)}</p></div></>; return to ? <Link className="content-card" to={to}>{body}</Link> : <article className="content-card">{body}</article>; }

export function Detail({ kind }: { kind: 'events' | 'blogs' }) {
  const { slug } = useParams(); const [item, setItem] = useState<any>(null); const [error, setError] = useState(''); const [registered, setRegistered] = useState('');
  useEffect(() => { api.get(`/public/${kind}/${slug}`).then(response => setItem(response.data)).catch(reason => setError(message(reason))); }, [kind, slug]);
  if (error) return <Alert>{error}</Alert>; if (!item) return <Loader />;
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { const { data } = await api.post(`/public/events/${item.id}/register`, Object.fromEntries(new FormData(event.currentTarget))); setRegistered(data.message); } catch (reason) { setRegistered(message(reason)); } };
  const image = item.hero_image || item.banner_image || item.featured_image;
  return <article className="detail-page"><header style={image ? { backgroundImage: `linear-gradient(#0009,#000d),url(${media(image)})` } : undefined}><span>{item.category_name || item.event_type || 'Om Naad'}</span><h1>{item.title}</h1><p>{item.event_date || item.published_at} {item.venue && ` / ${item.venue}`}</p></header><section className="detail-content"><div className="prose preline">{plain(item.full_description || item.content || item.short_description)}</div>{kind === 'events' && item.registration_enabled && <form className="form" onSubmit={submit}><h2>Register for this event</h2><Alert kind={registered.includes('success') ? 'success' : 'error'}>{registered}</Alert><div className="form-grid"><Field name="name" label="Name" /><Field name="email" label="Email" type="email" /><Field name="phone" label="Phone" /><Field name="notes" label="Notes" area /></div><button className="primary">Register</button></form>}</section></article>;
}
export function Contact() {
  const [state, setState] = useState(''); const [settings, setSettings] = useState<Settings>({});
  useEffect(() => { api.get('/public/settings').then(({ data }) => setSettings(data)); }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await api.post('/public/contact', Object.fromEntries(new FormData(event.currentTarget))); setState('Message sent successfully!'); event.currentTarget.reset(); } catch (reason) { setState(message(reason)); } };
  return <><section className="collection-hero contact-hero"><span className="eyebrow">Get in Touch</span><h1>Let's Create <em>Something Musical</em></h1><p>Questions about classes, studio bookings or events? We are listening.</p></section><section className="section contact-grid"><div className="contact-panel"><h2>Contact Information</h2><p><i className="fas fa-map-marker-alt" /><span>{settings.address || 'Ahmedabad, Gujarat, India'}</span></p><p><i className="fas fa-phone-alt" /><span>{settings.contact_phone || '+91 74900 70921'}</span></p><p><i className="fas fa-envelope" /><span>{settings.contact_email || 'hello@omnaad.com'}</span></p></div><form className="form" onSubmit={submit}><Alert kind={state.includes('success') ? 'success' : 'error'}>{state}</Alert><div className="form-grid"><Field name="first_name" label="First name" /><Field name="last_name" label="Last name" /><Field name="email" label="Email" type="email" /><Field name="phone" label="Phone" required={false} /><label className="field full">Subject<select name="subject" required><option value="classes">Music classes</option><option value="recording">Studio recording</option><option value="events">Events</option><option value="other">Other</option></select></label><Field name="message" label="Message" area full /></div><button className="primary">Send Message</button></form></section></>;
}
export function StaticPage({ kind }: { kind: 'privacy' | 'terms' | 'refund' | 'tour' }) {
  if (kind === 'tour') return <><Hero eyebrow="Inside Om Naad" title="Studio Tour">Explore our acoustically treated creative space before your session.</Hero><section className="section"><div className="studio-service-grid"><StudioService icon="fa-drum" title="Live Room">A tuned rehearsal and tracking room for bands and ensembles.</StudioService><StudioService icon="fa-sliders" title="Control Room">Professional monitoring and a focused mixing environment.</StudioService><StudioService icon="fa-guitar" title="Ready-to-play Gear">Drums, amplifiers, keyboards and essential studio equipment.</StudioService><StudioService icon="fa-headphones" title="Book a Visit">Meet the team and plan your recording or jam session.</StudioService></div><div className="actions"><Link className="primary" to="/contact">Schedule a Tour</Link></div></section></>;
  const content = { privacy: ['Privacy Policy', 'We collect only information needed for admissions, bookings, payments and communication. Personal information and uploaded documents are used to deliver Om Naad services and are not sold. Contact us to request access, correction or deletion where legally permitted.'], terms: ['Terms & Conditions', 'Admissions and bookings are confirmed after successful payment. Students and visitors must follow studio safety, scheduling and conduct rules. Course schedules, instructor availability and event details may change with reasonable notice.'], refund: ['Refund & Cancellation Policy', 'Refund eligibility depends on the service, notice period, sessions already consumed and payment gateway charges. Contact Om Naad with your admission or booking reference so the team can review your request.'] }[kind];
  return <><Hero eyebrow="Om Naad" title={content[0]} /><section className="policy"><p>{content[1]}</p><Link className="primary" to="/contact">Contact Us</Link></section></>;
}
function Field({ name, label, type = 'text', area = false, full = false, required = true }: { name: string; label: string; type?: string; area?: boolean; full?: boolean; required?: boolean }) { return <label className={`field ${full ? 'full' : ''}`}>{label}{area ? <textarea name={name} required={required} /> : <input name={name} type={type} required={required} />}</label>; }
