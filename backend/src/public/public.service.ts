import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ContactDto, EventRegistrationDto } from './public.dto';

@Injectable()
export class PublicService {
  constructor(private db: DataSource) {}
  async settings() {
    const rows = await this.db.query(`SELECT \`key\`,\`value\` FROM settings`);
    return Object.fromEntries(rows.map((row: {key:string,value:string}) => [row.key, row.value]));
  }
  async home() {
    const [testimonials, courses, events, settings] = await Promise.all([
      this.db.query(`SELECT * FROM testimonials WHERE status=1 ORDER BY display_order,created_at DESC LIMIT 10`),
      this.db.query(`SELECT * FROM courses WHERE is_active=1 ORDER BY created_at DESC LIMIT 6`),
      this.db.query(`SELECT * FROM events WHERE status=1 AND event_date>=CURDATE() ORDER BY event_date LIMIT 4`),
      this.settings(),
    ]);
    return { testimonials, courses, events, settings };
  }
  courses() { return this.db.query(`SELECT * FROM courses WHERE is_active=1 ORDER BY created_at DESC`); }
  instructors() { return this.db.query(`SELECT u.id,u.name,u.email,t.* FROM users u JOIN roles r ON r.id=u.role_id JOIN teachers t ON t.user_id=u.id WHERE LOWER(r.name)='instructor' ORDER BY u.name`); }
  async gallery(category?: string, page = 1) { return this.paginate(`SELECT gi.*,gc.name category_name FROM gallery_items gi JOIN gallery_categories gc ON gc.id=gi.category_id WHERE gi.status=1 ${category ? 'AND gi.category_id=?' : ''} ORDER BY gi.created_at DESC`, category ? [category] : [], page); }
  galleryCategories() { return this.db.query(`SELECT * FROM gallery_categories WHERE status=1 ORDER BY name`); }
  async events(page = 1) { return this.paginate(`SELECT * FROM events WHERE status=1 ORDER BY display_order,event_date`, [], page); }
  async event(slug: string) { const [event] = await this.db.query(`SELECT * FROM events WHERE slug=? AND status=1`, [slug]); if (!event) throw new NotFoundException(); event.gallery = await this.db.query(`SELECT * FROM event_gallery WHERE event_id=?`, [event.id]); return event; }
  async register(eventId: number, dto: EventRegistrationDto) {
    return this.db.transaction(async (manager) => {
      const [event] = await manager.query(`SELECT * FROM events WHERE id=? FOR UPDATE`, [eventId]);
      if (!event || !event.status || !event.registration_enabled) throw new BadRequestException('Registration is currently disabled for this event.');
      if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) throw new BadRequestException('The registration deadline has passed.');
      if (event.available_seats !== null && event.available_seats <= 0) throw new BadRequestException('Sorry, this event is fully booked.');
      await manager.query(`INSERT INTO event_registrations (event_id,name,email,phone,notes,created_at,updated_at) VALUES (?,?,?,?,?,NOW(),NOW())`, [eventId,dto.name,dto.email,dto.phone,dto.notes || null]);
      if (event.available_seats !== null) await manager.query(`UPDATE events SET available_seats=available_seats-1,updated_at=NOW() WHERE id=?`, [eventId]);
      return { message: 'You have successfully registered for this event!' };
    });
  }
  async blogs(category?: string, page = 1) {
    const where = category ? `AND (bc.slug=? OR bc.id=?)` : '';
    return this.paginate(`SELECT b.*,bc.name category_name,bc.slug category_slug FROM blogs b LEFT JOIN blog_categories bc ON bc.id=b.category_id WHERE b.status='published' ${where} ORDER BY b.published_at DESC`, category ? [category,category] : [], page);
  }
  blog(slug: string) { return this.db.query(`SELECT b.*,bc.name category_name,u.name user_name FROM blogs b LEFT JOIN blog_categories bc ON bc.id=b.category_id LEFT JOIN users u ON u.id=b.user_id WHERE b.slug=? AND b.status='published' LIMIT 1`, [slug]).then((rows) => { if (!rows[0]) throw new NotFoundException(); return rows[0]; }); }
  async contact(dto: ContactDto) { await this.db.query(`INSERT INTO inquiries (name,email,phone,message,status,created_at,updated_at) VALUES (?,?,?,?, 'new',NOW(),NOW())`, [`${dto.first_name} ${dto.last_name}`,dto.email,dto.phone || null,`Subject: ${dto.subject}\n\n${dto.message}`]); return { message: 'Message sent successfully!' }; }
  private async paginate(sql: string, parameters: unknown[], page: number, perPage = 12) {
    const safePage = Math.max(1, Number(page) || 1); const offset = (safePage - 1) * perPage;
    const data = await this.db.query(`${sql} LIMIT ? OFFSET ?`, [...parameters, perPage, offset]);
    return { data, page: safePage, hasMore: data.length === perPage };
  }
}
