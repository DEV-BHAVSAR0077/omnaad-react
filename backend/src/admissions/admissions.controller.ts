import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateAdmissionDto } from './admissions.dto';
import { AdmissionsService } from './admissions.service';
import { uploadStorage } from '../common/utils';

@Controller('admissions')
export class AdmissionsController {
  constructor(private service: AdmissionsService) {}
  @Post() @UseInterceptors(FileFieldsInterceptor([{name:'student_photo',maxCount:1},{name:'aadhaar_card',maxCount:1}], { storage: uploadStorage('admissions'), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (_r,file,cb) => cb(null,/^(image\/(jpeg|png|webp)|application\/pdf)$/.test(file.mimetype)) }))
  create(@Body() dto: CreateAdmissionDto, @UploadedFiles() files: { student_photo?: Express.Multer.File[]; aadhaar_card?: Express.Multer.File[] }) { return this.service.create(dto, files); }
  @Get(':id') get(@Param('id', ParseIntPipe) id: number) { return this.service.get(id); }
}
