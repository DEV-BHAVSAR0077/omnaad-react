import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadStorage } from '../common/utils';
import { CreateJamDto } from './jam.dto';
import { JamService } from './jam.service';
@Controller('jam-sessions')
export class JamController {
  constructor(private service: JamService) {}
  @Get('slots') slots(@Query('date') date: string) { return this.service.slots(date); }
  @Post() @UseInterceptors(FileInterceptor('tech_rider',{storage:uploadStorage('tech_riders'),limits:{fileSize:5*1024*1024},fileFilter:(_r,f,cb)=>cb(null,/^(image\/(jpeg|png)|application\/pdf)$/.test(f.mimetype))})) create(@Body() dto:CreateJamDto,@UploadedFile() file?:Express.Multer.File){return this.service.create(dto,file);}
  @Get(':booking') get(@Param('booking') booking:string){return this.service.get(booking);}
}
