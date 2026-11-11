import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class StudentService {
  constructor(private db:DataSource){}
  private async admission(userId:number){const [row]=await this.db.query(`SELECT * FROM student_admissions WHERE user_id=? LIMIT 1`,[userId]);return row||null;}
  async dashboard(userId:number){const admission=await this.admission(userId);const [paid]=admission?await this.db.query(`SELECT COALESCE(SUM(amount),0) total FROM payments WHERE admission_id=? AND status IN ('successful','paid')`,[admission.id]):[{total:0}];return{admission,totalFees:Number(admission?.payment_amount||0),paidAmount:Number(paid.total),remainingFees:Math.max(0,Number(admission?.payment_amount||0)-Number(paid.total))};}
  async attendance(userId:number){const records=await this.db.query(`SELECT a.*,c.title course_title FROM attendances a LEFT JOIN courses c ON c.id=a.course_id WHERE a.user_id=? ORDER BY a.date DESC`,[userId]);const counts={present:0,absent:0,leave:0,late:0,excused:0};for(const record of records){const key=String(record.status).toLowerCase() as keyof typeof counts;if(key in counts)counts[key]++;}return{records,counts};}
  async history(userId:number){const admission=await this.admission(userId);if(!admission)return{payments:[],receipts:[]};const[payments,receipts]=await Promise.all([this.db.query(`SELECT p.*,pc.name category_name FROM payments p LEFT JOIN payment_categories pc ON pc.id=p.payment_category_id WHERE p.admission_id=? ORDER BY p.created_at DESC`,[admission.id]),this.db.query(`SELECT * FROM receipts WHERE admission_id=? ORDER BY created_at DESC`,[admission.id])]);return{payments,receipts};}
  async documents(userId:number){const admission=await this.admission(userId);if(!admission)throw new NotFoundException('Admission record not found.');return{application_number:admission.application_number,student_photo:admission.student_photo,aadhaar_card:admission.aadhaar_card,receipt_number:admission.receipt_number};}
}
