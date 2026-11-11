import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { publicUploadPath, randomCode } from '../common/utils';
import { CreateAdmissionDto } from './admissions.dto';

@Injectable()
export class AdmissionsService {
  constructor(private db: DataSource) {}
  async create(dto: CreateAdmissionDto, files: { student_photo?: Express.Multer.File[]; aadhaar_card?: Express.Multer.File[] }) {
    if (!dto.declaration_accepted || !dto.terms_accepted) throw new BadRequestException('Declaration and terms must be accepted.');
    if (!files.student_photo?.[0]) throw new BadRequestException('Student photo is required.');
    const [course] = await this.db.query(`SELECT monthly_fee FROM courses WHERE title=? AND is_active=1 LIMIT 1`, [dto.course_instrument]);
    if (!course) throw new BadRequestException('Selected course is not available.');
    const multiplier: Record<string,number> = { Monthly: 1, Quarterly: 3, 'Half Yearly': 6, Yearly: 12 };
    const amount = Number(course.monthly_fee) * multiplier[dto.payment_mode];
    const columns = [...Object.keys(dto), 'application_number','student_photo','aadhaar_card','signature_date','status','payment_amount','payment_status','created_at','updated_at'];
    const values = [...Object.values(dto), randomCode('APP'), publicUploadPath('admissions', files.student_photo[0]), publicUploadPath('admissions', files.aadhaar_card?.[0]), new Date(), 'pending',amount,'pending',new Date(),new Date()];
    const result = await this.db.query(`INSERT INTO student_admissions (${columns.map((key) => `\`${key}\``).join(',')}) VALUES (${columns.map(() => '?').join(',')})`, values);
    return this.get(result.insertId);
  }
  async get(id: number) { const [record] = await this.db.query(`SELECT * FROM student_admissions WHERE id=?`, [id]); if (!record) throw new NotFoundException(); return record; }
}
