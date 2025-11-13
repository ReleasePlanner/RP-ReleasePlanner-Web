/**
 * Release Planner API
 * NestJS application following best practices
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global prefix for all routes
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints || {};
          return Object.values(constraints).join(', ');
        });
        return new Error(messages.join('; '));
      },
    })
  );

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('Release Planner API')
    .setDescription(
      'API REST para la gestión de planes de release, productos, features, calendarios y propietarios IT. ' +
      'Construida con NestJS siguiendo Clean Architecture y mejores prácticas.'
    )
    .setVersion('1.0')
    .addTag('base-phases', 'Gestión de fases base del sistema')
    .addTag('products', 'Gestión de productos y componentes')
    .addTag('features', 'Gestión de features de productos')
    .addTag('calendars', 'Gestión de calendarios y días festivos')
    .addTag('it-owners', 'Gestión de propietarios IT')
    .addTag('plans', 'Gestión de planes de release')
    .addTag('health', 'Health check endpoints')
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Release Planner API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  Logger.log(
    `🚀 Release Planner API is running on: http://localhost:${port}/${globalPrefix}`,
    'Bootstrap'
  );
  Logger.log(
    `📚 Swagger Documentation: http://localhost:${port}/api/docs`,
    'Bootstrap'
  );
  Logger.log(
    `📄 OpenAPI JSON: http://localhost:${port}/api/docs-json`,
    'Bootstrap'
  );
}

bootstrap();
