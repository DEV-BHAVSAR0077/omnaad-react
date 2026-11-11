import { Body, Controller, Get, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { DataSource } from 'typeorm';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto } from './payments.dto';

@Controller('payments')
export class PaymentsController{
  constructor(private service:PaymentsService,private db:DataSource){}
  @Post('admissions/:id/order') admissionOrder(@Param('id',ParseIntPipe)id:number){return this.service.admissionOrder(id);}
  @Post('admissions/:id/verify') verifyAdmission(@Param('id',ParseIntPipe)id:number,@Body()dto:VerifyPaymentDto){return this.service.verifyAdmission(id,dto);}
  @Post('jam/:booking/order') jamOrder(@Param('booking')booking:string){return this.service.jamOrder(booking);}
  @Post('jam/verify') verifyJam(@Body()dto:VerifyPaymentDto){return this.service.verifyJam(dto);}
  @Get('admissions/:id/receipt.pdf') async admissionReceipt(@Param('id',ParseIntPipe)id:number,@Res()res:Response){const [row]=await this.db.query(`SELECT * FROM student_admissions WHERE id=? AND payment_status='paid'`,[id]);if(!row)return res.status(404).json({message:'Receipt not found.'});this.pdf(res,`admission-receipt-${id}.pdf`,[['Receipt',row.receipt_number],['Student',row.full_name],['Course',row.course_instrument],['Amount',`INR ${row.payment_amount}`],['Status','Paid']]);}
  @Get('jam/:booking/receipt.pdf') async jamReceipt(@Param('booking')booking:string,@Res()res:Response){const [row]=await this.db.query(`SELECT * FROM jam_sessions WHERE booking_number=? AND payment_status='successful'`,[booking]);if(!row)return res.status(404).json({message:'Receipt not found.'});this.pdf(res,`jam-receipt-${booking}.pdf`,[['Receipt',row.receipt_number],['Booking',row.booking_number],['Customer',row.booker_name],['Session',`${row.session_date} ${row.session_time}`],['Amount',`INR ${row.payment_amount}`]]);}
  private pdf(res:Response,filename:string,fields:string[][]){res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition',`attachment; filename="${filename}"`);const doc=new PDFDocument({margin:50});doc.pipe(res);doc.fontSize(24).text('OM NAAD',{align:'center'}).fontSize(12).text('Music Academy & Recording Studio',{align:'center'}).moveDown(2);for(const [label,value]of fields)doc.font('Helvetica-Bold').text(`${label}:`,{continued:true}).font('Helvetica').text(` ${value||'-'}`).moveDown(.5);doc.end();}
}
