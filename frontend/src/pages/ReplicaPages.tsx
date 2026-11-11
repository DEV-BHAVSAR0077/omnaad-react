import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, media, message } from '../api';
import { Alert, Empty, Loader } from '../components/Ui';

const text = (html: unknown) => String(html || '').replace(/<[^>]*>/g, ' ').trim();
const date = (value: unknown, options?: Intl.DateTimeFormatOptions) => {
  const parsed = new Date(String(value || ''));
  return Number.isNaN(parsed.getTime()) ? String(value || '') : parsed.toLocaleDateString('en-IN', options || { day: '2-digit', month: 'short', year: 'numeric' });
};
const time = (value: unknown) => {
  if (!value) return '';
  const raw = String(value);
  const parsed = new Date(raw.includes('T') ? raw : '1970-01-01T' + raw);
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export function TestimonialCarousel({ items }: { items: any[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % items.length), 5000);
    return () => window.clearInterval(timer);
  }, [items.length]);
  const item = items[active];
  if (!item) return <Empty />;
  return <div className="testimonial-showcase">
    <div className="testimonial-art">{item.image ? <img key={item.id} src={media(item.image)} alt={item.name} /> : <div className="testimonial-initial">{String(item.name || 'O')[0]}</div>}</div>
    <div className="testimonial-copy">
      <div className="testimonial-progress"><i key={active} /></div>
      <h3>{item.name}</h3><span>{item.designation || 'Om Naad Community'}</span>
      <blockquote><i className="fas fa-quote-left" /><p>{item.testimonial}</p></blockquote>
      {items.length > 1 && <div className="testimonial-controls"><div>{items.map((entry, index) => <button key={entry.id} className={active === index ? 'active' : ''} aria-label={'Show testimonial ' + (index + 1)} onClick={() => setActive(index)} />)}</div><span><button aria-label="Previous testimonial" onClick={() => setActive(value => (value - 1 + items.length) % items.length)}><i className="fas fa-arrow-left" /></button><button aria-label="Next testimonial" onClick={() => setActive(value => (value + 1) % items.length)}><i className="fas fa-arrow-right" /></button></span></div>}
    </div>
  </div>;
}

export function StudioTour() {
  const gear = [
    ['/images/acoustic_guitar_1780025764212.png', 'Premium Guitars', 'A curated selection of acoustic and electric guitars, maintained and ready for warm fingerpicking or punchy rhythm tracks.'],
    ['/images/piano_keys_1780025743715.png', 'Keyboards & Synths', 'Fully weighted digital pianos and versatile MIDI controllers integrated with industry-standard virtual instruments.'],
    ['https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1200&auto=format&fit=crop', 'Professional Drums', 'A fully micd acoustic kit with premium cymbals and carefully tuned shells for a powerful rhythm section.'],
    ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop', 'Control Room & Gear', 'High-fidelity monitoring, professional interfaces and a complete mixing and mastering workflow.'],
  ];
  return <>
    <section className="tour-hero"><div className="hero-overlay" /><div><Link to="/studio" className="back-link"><i className="fas fa-arrow-left" /> Back to Studio</Link><span className="pill">Explore Our Space</span><h1>The <em>Om Naad</em> Studio Tour</h1><p>Step inside our meticulously designed creative haven. Built for artists, engineered for perfection.</p></div></section>
    <section className="section section-wide tour-room"><div className="tour-room-image"><img src="/images/live_performance_1780025782502.png" alt="Live performance room" /></div><div><h2>The Live Room</h2><i className="accent-line" /><p>Our live room is acoustically treated to provide the perfect balance of resonance and clarity. Record a full band, shoot a live performance or host an intimate jam.</p><ul><li>Floating floors for maximum vibration isolation</li><li>Custom diffusers and absorption panels</li><li>Multi-camera setup ready for video production</li><li>Comfortable lounge seating and ambient lighting</li></ul></div></section>
    <section className="section section-wide arsenal-section"><div className="section-heading"><span>Studio Tour</span><h2>Our Arsenal</h2></div><p className="section-intro">Top-tier instruments available for your sessions. Great recordings start with great sources.</p><div className="gear-grid">{gear.map(([image, title, copy]) => <article className="gear-card" key={title}><img src={image} alt={title} /><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>
    <section className="tour-cta"><h2>Ready to Create?</h2><p>Book your session today and experience the Om Naad difference.</p><Link className="primary" to="/jam-session"><i className="fas fa-calendar-alt" /> Book a Jam Session</Link></section>
  </>;
}

export function Gallery() {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  useEffect(() => { api.get('/public/gallery/categories').then(response => setCategories(response.data)); }, []);
  useEffect(() => {
    setLoading(true);
    api.get('/public/gallery', { params: { page: 1, category: category === 'all' ? undefined : category } }).then(response => { setItems(response.data.data); setHasMore(response.data.hasMore); setPage(1); }).finally(() => setLoading(false));
  }, [category]);
  const loadMore = () => api.get('/public/gallery', { params: { page: page + 1, category: category === 'all' ? undefined : category } }).then(response => { setItems(value => [...value, ...response.data.data]); setHasMore(response.data.hasMore); setPage(value => value + 1); });
  return <><section className="gallery-hero"><h1>The Master's Stage</h1><p>A visual journey through performances, masterclasses and the quiet moments of dedication at Om Naad Music Studio.</p></section><section className="gallery-section section-wide"><div className="filter-row"><button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All Media</button>{categories.map(item => <button key={item.id} className={String(item.id) === category ? 'active' : ''} onClick={() => setCategory(String(item.id))}>{item.name}</button>)}</div>{loading ? <Loader /> : items.length ? <div className="masonry-grid">{items.map(item => <button className="gallery-tile" key={item.id} onClick={() => setSelected(item)}>{item.media_type === 'video' ? <><img src={item.thumbnail_path ? media(item.thumbnail_path) : 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop'} alt={item.title} /><i className="fas fa-play" /></> : <img src={media(item.media_path)} alt={item.title} />}<span>{item.title}</span></button>)}</div> : <Empty />}{hasMore && <div className="load-more"><button className="outline" onClick={() => void loadMore()}>Load More Content</button></div>}</section>{selected && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><button aria-label="Close" onClick={() => setSelected(null)}>&times;</button><div onClick={event => event.stopPropagation()}>{selected.media_type === 'video' ? <video src={media(selected.media_path)} controls autoPlay /> : <img src={media(selected.media_path)} alt={selected.title} />}</div></div>}</>;
}

export function Events() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/public/events').then(response => setItems(response.data.data)).finally(() => setLoading(false)); }, []);
  const featured = items.find(item => Boolean(item.is_featured)) || items[0];
  const upcoming = items.filter(item => item.id !== featured?.id).slice(0, 4);
  return <><section className="events-hero"><span>The Master's Stage</span><h1>Events &amp; Workshops</h1><p>Experience the artistry of live music and elevate your craft through exclusive masterclasses and performances.</p></section><section className="section section-wide events-feature-grid">{loading ? <Loader /> : <>{featured ? <Link className="featured-event" to={'/events/' + featured.slug} style={featured.banner_image ? { backgroundImage: 'linear-gradient(0deg,#121212 15%,#12121299,#0002),url(' + media(featured.banner_image) + ')' } : undefined}><div><span>{featured.event_type}</span><b>{date(featured.event_date)}</b></div><h2>{featured.title}</h2><p>{featured.short_description}</p><i>Register Now <span className="fas fa-arrow-right" /></i></Link> : <Empty />}<aside className="up-next"><header><h2>Up Next</h2><i className="far fa-clock" /></header>{upcoming.length ? upcoming.map(item => <Link key={item.id} to={'/events/' + item.slug}><time><b>{date(item.event_date, { month: 'short' })}</b><strong>{date(item.event_date, { day: '2-digit' })}</strong></time><div><h3>{item.title}</h3><p>{item.venue} &bull; {time(item.start_time)}</p></div></Link>) : <p className="muted">No upcoming events scheduled.</p>}<a href="#event-calendar" className="calendar-link">View Calendar</a></aside></>}</section><section id="event-calendar" className="section section-wide event-calendar"><div className="event-calendar-header"><span>Live Stage</span><h2>Event Calendar</h2></div>{items.length ? <div className="event-card-grid">{items.map(item => <EventCard key={item.id} item={item} />)}</div> : !loading && <Empty />}</section></>;
}
function EventCard({ item }: { item: any }) { return <Link className="event-card" to={'/events/' + item.slug}><div className="event-card-media">{item.banner_image && <img src={media(item.banner_image)} alt={item.title} />}<span>{item.event_type}</span></div><div><header><h3>{item.title}</h3><time><strong>{date(item.event_date, { day: '2-digit' })}</strong>{date(item.event_date, { month: 'short' })}</time></header><p>{item.short_description}</p><footer><span><i className="fas fa-map-marker-alt" />{item.venue}</span><b>Details <i className="fas fa-chevron-right" /></b></footer></div></Link>; }

export function Blogs() {
  const [items, setItems] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/public/blogs').then(response => setItems(response.data.data)).finally(() => setLoading(false)); }, []);
  const categories = Array.from(new Map(items.filter(item => item.category_slug).map(item => [String(item.category_slug), String(item.category_name)])).entries());
  const filtered = category === 'all' ? items : items.filter(item => item.category_slug === category);
  const featured = filtered.find(item => Boolean(item.is_featured)) || filtered[0];
  const rest = filtered.filter(item => item.id !== featured?.id);
  return <><section className="blog-hero"><div><span>The Echo Blog</span><h1>The Echo: Insights into<br />Sound &amp; Spirit</h1><p>Explore articles on music theory, performance mastery and the creative journey at Om Naad.</p></div></section><section className="blog-category-bar"><div><b>Categories:</b><button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All Articles</button>{categories.map(([slug, name]) => <button key={slug} className={category === slug ? 'active' : ''} onClick={() => setCategory(slug)}>{name}</button>)}</div></section><section className="section section-wide blog-listing">{loading ? <Loader /> : featured ? <><Link className="featured-blog" to={'/blogs/' + featured.slug}><div>{featured.featured_image ? <img src={media(featured.featured_image)} alt={featured.title} /> : <i className="fas fa-music" />}</div><article><span>Featured {featured.category_name}</span><time>{date(featured.published_at)}</time><h2>{featured.title}</h2><p>{text(featured.excerpt || featured.content).slice(0, 260)}</p><b>Read Full Insight <i className="fas fa-arrow-right" /></b></article></Link><div className="blog-grid">{rest.map(item => <BlogCard key={item.id} item={item} />)}</div></> : <Empty />}</section><Newsletter /></>;
}
function BlogCard({ item }: { item: any }) { return <Link className="blog-card" to={'/blogs/' + item.slug}><div>{item.featured_image ? <img src={media(item.featured_image)} alt={item.title} /> : <i className="fas fa-music" />}</div><article><header><span>{item.category_name || 'General'}</span><time>{date(item.published_at)}</time></header><h3>{item.title}</h3><p>{text(item.excerpt || item.content).slice(0, 150)}</p><b>Read More <i className="fas fa-arrow-right" /></b></article></Link>; }
function Newsletter() { return <section className="newsletter-section"><div><article><h2>Don't Miss a Beat.</h2><p>Subscribe for monthly musical insights, masterclass previews and artistic theory deep dives.</p></article><form onSubmit={event => event.preventDefault()}><input type="email" aria-label="Email address" placeholder="Your email address" /><button>Subscribe</button></form></div></section>; }

export function ReplicaDetail({ kind }: { kind: 'events' | 'blogs' }) {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState('');
  const [modal, setModal] = useState(false);
  useEffect(() => {
    api.get('/public/' + kind + '/' + slug).then(response => setItem(response.data)).catch(reason => setError(message(reason)));
    if (kind === 'blogs') api.get('/public/blogs').then(response => setRelated(response.data.data.filter((entry: any) => entry.slug !== slug).slice(0, 3)));
  }, [kind, slug]);
  if (error) return <section className="section"><Alert>{error}</Alert></section>;
  if (!item) return <Loader />;
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { const response = await api.post('/public/events/' + item.id + '/register', Object.fromEntries(new FormData(event.currentTarget))); setRegistered(response.data.message); } catch (reason) { setRegistered(message(reason)); } };
  if (kind === 'blogs') return <BlogDetail item={item} related={related} />;
  const image = item.banner_image;
  return <><section className="event-detail-hero" style={image ? { backgroundImage: 'linear-gradient(#0a0a0acc,#0a0a0af5),url(' + media(image) + ')' } : undefined}><span>{item.event_type}</span><h1>{item.title}</h1><div><b><i className="far fa-calendar-alt" />{date(item.event_date, { day: '2-digit', month: 'long', year: 'numeric' })}</b><b><i className="far fa-clock" />{time(item.start_time)}{item.end_time && ' - ' + time(item.end_time)}</b><b><i className="fas fa-map-marker-alt" />{item.venue}</b></div></section><section className="section event-detail-layout"><article><Link className="back-link" to="/events"><i className="fas fa-arrow-left" /> Back to All Events</Link><h2>About the Event</h2><div className="prose preline">{text(item.full_description || item.short_description)}</div>{item.gallery?.length > 0 && <><h2>Event Gallery</h2><div className="event-gallery">{item.gallery.map((imageItem: any) => <img key={imageItem.id} src={media(imageItem.image_path)} alt="Event" />)}</div></>}</article><aside className="event-info-card"><h2>Event Details</h2><Info icon="fa-calendar-check" title="Date">{date(item.event_date, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</Info><Info icon="fa-clock" title="Time">{time(item.start_time)}{item.end_time && ' to ' + time(item.end_time)}</Info><Info icon="fa-map-marker-alt" title="Location">{item.venue}<small>{item.venue_address}</small></Info>{item.registration_enabled && <button className="primary" onClick={() => setModal(true)}>{item.button_text || 'Register Now'}</button>}{item.available_seats != null && <p>Only {item.available_seats} spots left!</p>}</aside></section>{modal && <div className="registration-modal" role="dialog" aria-modal="true"><form onSubmit={submit}><button type="button" aria-label="Close" onClick={() => setModal(false)}>&times;</button><h2>Register for Event</h2><p>{item.title}</p><Alert kind={registered.includes('success') ? 'success' : 'error'}>{registered}</Alert><Field name="name" label="Full Name" /><Field name="email" label="Email Address" type="email" /><Field name="phone" label="Phone Number" /><Field name="notes" label="Any Notes? (Optional)" area required={false} /><button className="primary">Complete Registration</button></form></div>}</>;
}
function Info({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) { return <div className="event-info"><i className={'far ' + icon} /><div><b>{title}</b><span>{children}</span></div></div>; }
function BlogDetail({ item, related }: { item: any; related: any[] }) {
  const share = typeof window === 'undefined' ? '' : encodeURIComponent(window.location.href);
  const hero = item.hero_image || item.featured_image;
  return <><section className="blog-detail-hero" style={hero ? { backgroundImage: 'linear-gradient(90deg,#0a0a0ae6,#0a0a0a77),url(' + media(hero) + ')' } : undefined}><div><Link to="/blogs"><i className="fas fa-arrow-left" /> Back to All Articles</Link><span>Featured {item.category_name || 'Mastery'}</span><h1>{item.title}</h1><p><i className="far fa-calendar-alt" />{date(item.published_at, { day: '2-digit', month: 'long', year: 'numeric' })}<i className="far fa-clock" />{item.reading_time || 5} Min Read</p></div></section><section className="blog-detail-body"><article className="preline">{text(item.content)}</article><footer><div><i>{String(item.author_name || item.user_name || 'O')[0]}</i><span><b>{item.author_name || item.user_name || 'Om Naad Team'}</b><small>{item.author_designation || 'Music Educator'}</small></span></div><div><b>Share:</b><a href={'https://www.facebook.com/sharer/sharer.php?u=' + share} target="_blank" rel="noreferrer" aria-label="Share on Facebook"><i className="fab fa-facebook-f" /></a><a href={'https://twitter.com/intent/tweet?url=' + share} target="_blank" rel="noreferrer" aria-label="Share on X"><i className="fab fa-twitter" /></a><a href={'https://www.linkedin.com/sharing/share-offsite/?url=' + share} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn"><i className="fab fa-linkedin-in" /></a></div></footer></section><Newsletter />{related.length > 0 && <section className="section section-wide related-blogs"><div><h2>Related Insights</h2><Link to="/blogs">View All <i className="fas fa-arrow-right" /></Link></div><div className="blog-grid">{related.map(entry => <BlogCard key={entry.id} item={entry} />)}</div></section>}</>;
}

export function ReplicaContact() {
  const [state, setState] = useState('');
  const [settings, setSettings] = useState<Record<string, string>>({});
  useEffect(() => { api.get('/public/settings').then(response => setSettings(response.data)); }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await api.post('/public/contact', Object.fromEntries(new FormData(event.currentTarget))); setState('Message sent successfully!'); event.currentTarget.reset(); } catch (reason) { setState(message(reason)); } };
  const phone = settings.contact_phone || '+91 74900 70921';
  const email = settings.contact_email || 'admin@omnaad.com';
  const address = settings.address || 'Ahmedabad, Gujarat, India';
  return <><section className="contact-hero"><span>Get in Touch</span><h1>Contact <em>OmNaaD</em></h1><p>We would love to hear from you. Whether you have a question about classes, studio bookings or anything else, our team is ready.</p></section><section className="section section-wide contact-layout"><aside className="contact-card"><h2>Contact Information</h2><ContactRow href={'tel:' + phone.replaceAll(' ', '')} icon="fa-phone-alt" title="Phone Number"><p>{phone}</p><small>Mon-Sat: 10AM - 8PM</small></ContactRow><ContactRow href={'mailto:' + email} icon="fa-envelope" title="Email Address"><p>{email}</p></ContactRow><ContactRow href={'https://maps.google.com/?q=' + encodeURIComponent(address)} icon="fa-map-marker-alt" title="Our Studio"><p className="preline">{address}</p></ContactRow><div className="contact-map"><iframe title="Om Naad location" src="https://maps.google.com/maps?q=Omnaad%20music%20academy&t=&z=16&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><h3>Follow Us</h3><div className="contact-social">{[['social_facebook','fa-facebook-f'],['social_instagram','fa-instagram'],['social_youtube','fa-youtube'],['social_twitter','fa-twitter']].map(([key, icon]) => settings[key] && <a key={key} href={settings[key]} target="_blank" rel="noreferrer"><i className={'fab ' + icon} /></a>)}</div></aside><form className="contact-form" onSubmit={submit}><h2>Send us a Message</h2><p>Fill out the form below and we will get back to you as soon as possible.</p><Alert kind={state.includes('success') ? 'success' : 'error'}>{state}</Alert><div className="form-grid"><Field name="first_name" label="First Name *" /><Field name="last_name" label="Last Name *" /><Field name="email" label="Email Address *" type="email" /><Field name="phone" label="Phone Number" required={false} /><label className="field full">I'm interested in *<select name="subject" required defaultValue=""><option value="" disabled>Select an option</option><option value="classes">Music Classes</option><option value="recording">Studio Recording & Production</option><option value="events">Events & Workshops</option><option value="other">Other Inquiry</option></select></label><Field name="message" label="Your Message *" area full /></div><button className="primary">Send Message <i className="fas fa-paper-plane" /></button></form></section></>;
}
function ContactRow({ href, icon, title, children }: { href: string; icon: string; title: string; children: React.ReactNode }) { return <div className="contact-row"><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"><i className={'fas ' + icon} /></a><div><h3>{title}</h3>{children}</div></div>; }
function Field({ name, label, type = 'text', area = false, full = false, required = true }: { name: string; label: string; type?: string; area?: boolean; full?: boolean; required?: boolean }) { return <label className={'field ' + (full ? 'full' : '')}>{label}{area ? <textarea name={name} required={required} /> : <input name={name} type={type} required={required} />}</label>; }

