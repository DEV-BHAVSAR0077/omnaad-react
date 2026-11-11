import { Module } from '@nestjs/common';
import { JamController } from './jam.controller';
import { JamService } from './jam.service';
@Module({controllers:[JamController],providers:[JamService],exports:[JamService]}) export class JamModule{}
