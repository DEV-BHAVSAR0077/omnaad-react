import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { ContactDto, EventRegistrationDto } from './public.dto';

@Controller('public')
export class PublicController {
  constructor(private service: PublicService) {}
  @Get('home') home() { return this.service.home(); }
  @Get('settings') settings() { return this.service.settings(); }
  @Get('courses') courses() { return this.service.courses(); }
  @Get('instructors') instructors() { return this.service.instructors(); }
  @Get('gallery/categories') galleryCategories() { return this.service.galleryCategories(); }
  @Get('gallery') gallery(@Query('category') category?: string, @Query('page') page?: string) { return this.service.gallery(category, Number(page)); }
  @Get('events') events(@Query('page') page?: string) { return this.service.events(Number(page)); }
  @Get('events/:slug') event(@Param('slug') slug: string) { return this.service.event(slug); }
  @Post('events/:id/register') @Throttle({ default: { limit: 5, ttl: 60_000 } }) register(@Param('id', ParseIntPipe) id: number, @Body() dto: EventRegistrationDto) { return this.service.register(id, dto); }
  @Get('blogs') blogs(@Query('category') category?: string, @Query('page') page?: string) { return this.service.blogs(category, Number(page)); }
  @Get('blogs/:slug') blog(@Param('slug') slug: string) { return this.service.blog(slug); }
  @Post('contact') @Throttle({ default: { limit: 3, ttl: 60_000 } }) contact(@Body() dto: ContactDto) { return this.service.contact(dto); }
}
