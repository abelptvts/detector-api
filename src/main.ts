import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe());
    app.useStaticAssets('./upload', { prefix: '/captures/' });
    app.setGlobalPrefix('api');
    await app.listen(3000);
}
bootstrap();
