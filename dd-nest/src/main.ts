import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'shared/exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('DarlingDove API')
    .setDescription('DarlingDove API description')
    .setVersion('1.0')
    .setBasePath('/api')
    .addBearerAuth('access_token', 'query')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/explorer', app, document);

  const port = parseInt(process.env.PORT, 10);
  // to use fastify in docker you need to specify a host
  await app.listen(port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
