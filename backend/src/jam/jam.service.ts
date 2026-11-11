import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { publicUploadPath, randomCode } from '../common/utils';
import { CreateJamDto } from './jam.dto';

export const pricing = (duration: number) => { const price=duration*1100; const tax=price*0.18; return { price,tax,total_amount:price+tax }; };

@Injectable()
export class JamService {
  constructor(private db: DataSource) {}
  async slots(date: string) { return this.db.query(`SELECT TIME_FORMAT(session_time,'%H:%i') time,duration FROM jam_sessions WHERE session_date=? AND status IN ('pending','confirmed')`, [date]); }
  async create(dto: CreateJamDto, file?: Express.Multer.File) {
    if (new Date(`${dto.session_date}T${dto.session_time}`) < new Date()) throw new BadRequestException('Session date and time must be in the future.');
    return this.db.transaction(async (manager) => {
      const overlaps = await manager.query(`SELECT id FROM jam_sessions WHERE session_date=? AND status IN ('pending','confirmed') AND TIME_TO_SEC(session_time) < TIME_TO_SEC(?) + (? * 3600) AND TIME_TO_SEC(session_time) + (duration * 3600) > TIME_TO_SEC(?) FOR UPDATE`, [dto.session_date,dto.session_time,dto.duration,dto.session_time]);
      if (overlaps.length) throw new BadRequestException('The selected date and time slot is not available.');
      const quote=pricing(dto.duration); const booking=randomCode('JAM');
      const result=await manager.query(`INSERT INTO jam_sessions (booking_number,session_type,session_name,session_description,genre,session_date,session_time,duration,price,tax,total_amount,status,payment_status,booker_name,booker_email,booker_mobile,objective,special_requirements,tech_rider_path,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [booking,dto.session_type||'Custom Session',dto.session_name||null,dto.description||null,dto.genre||null,dto.session_date,dto.session_time,dto.duration,quote.price,quote.tax,quote.total_amount,'pending','pending',`${dto.firstname} ${dto.lastname}`,dto.email,dto.phone_number,dto.objective||null,dto.special_requirements||null,publicUploadPath('tech_riders',file),new Date(),new Date()]);
      for (const participant of dto.participants || []) await manager.query(`INSERT INTO participants (jam_session_id,name,email,mobile,instrument,experience_level,created_at,updated_at) VALUES (?,?,?,?,?,?,NOW(),NOW())`, [result.insertId,participant.name,participant.email||null,participant.mobile||null,participant.instrument||null,participant.experience_level||null]);
      return this.get(booking, manager);
    });
  }
  async get(booking: string, manager: DataSource['manager'] = this.db.manager) { const rows=await manager.query(`SELECT * FROM jam_sessions WHERE booking_number=?`,[booking]); if(!rows[0]) throw new NotFoundException(); rows[0].participants=await manager.query(`SELECT * FROM participants WHERE jam_session_id=?`,[rows[0].id]); return rows[0]; }
}
