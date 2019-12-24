import { Injectable, Inject } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import {
  createSitemap,
  EnumChangefreq,
  ISitemapItemOptionsLoose,
} from 'sitemap';
import { writeFile, existsSync } from 'fs';
import { join } from 'path';
import { ProductsService } from '../../products/products.service';
import { PagesService } from '../../pages/pages.service';
import { BASE_URL, STATIC_DIR } from '../constants';

@Injectable()
export class SitemapJob extends NestSchedule {
  constructor(
    @Inject(PagesService) private readonly pagesService: PagesService,
    @Inject(ProductsService) private readonly productsService: ProductsService,
  ) {
    super();
  }

  @Cron('10 3 * * *')
  async generateSitemap() {
    if (!existsSync(STATIC_DIR)) {
      console.error(
        `Directory for static files (${STATIC_DIR}) does not exist!`,
      );
      return;
    }

    const sitemap = createSitemap({
      hostname: BASE_URL,
    });

    for (const page of await this.pagesService.loadAll()) {
      if (page.slug === 'home') {
        sitemap.add({
          url: '/',
          changefreq: EnumChangefreq.WEEKLY,
          priority: 1,
        });
      } else {
        sitemap.add({
          url: `/${page.slug}`,
          changefreq: EnumChangefreq.WEEKLY,
          priority: 0.5,
        });
      }
    }

    for (const category of await this.productsService.getCategories()) {
      sitemap.add({
        url: `/category/${category}`,
        changefreq: EnumChangefreq.WEEKLY,
        priority: 1,
      });
    }

    for await (const product of await this.productsService.getIterableProducts({
      inStock: true,
    })) {
      const productData: ISitemapItemOptionsLoose = {
        url: `/product/${product.sku}`,
        changefreq: EnumChangefreq.WEEKLY,
        priority: 1,
      };

      if (product.images.length) {
        productData.img = [
          {
            url: product.images[0].url,
            title: product.name,
            caption: product.description,
          },
        ];
      }

      sitemap.add(productData);
    }

    writeFile(join(STATIC_DIR, 'sitemap.xml'), sitemap.toString(), err => {
      if (err) {
        console.error('Error writing sitemap.xml');
        console.error(err);
      } else {
        console.log('Successfully generated sitemap.xml');
      }
    });
  }
}
