import { Module } from '@nestjs/common';
import { ScheduleModule } from 'nest-schedule';
import { SitemapJob } from './jobs/sitemap.job';
import { ProductsModule } from 'products/products.module';
import { PagesModule } from 'pages/pages.module';

@Module({
  imports: [ScheduleModule.register(), ProductsModule, PagesModule],
  providers: [SitemapJob],
})
export class CronModule {}
