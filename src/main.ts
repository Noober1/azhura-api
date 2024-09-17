import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BaseExceptionFilter } from './filters/base-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // configs
  const config = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // session configuration
  app.use(
    session({
      secret: 'entah', // Change this to a secure key
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: false,
        secure: process.env.NODE_ENV === 'production', // Make sure this is false for development over HTTP
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Custom exception filter with logger
  app.useGlobalFilters(new BaseExceptionFilter(logger));

  // API Docs
  const docConfig = new DocumentBuilder()
    .setTitle('Azhura API')
    .setDescription('Mana saia tau?')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('docs', app, document);

  // Global validation configuration
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // custom logger
  if (process.env.NODE_ENV !== 'production') {
    app.useLogger(app.get(LoggerService));
  }

  // cors
  app.enableCors({
    origin: [
      'http://localhost:3000',
      /^https?:\/\/([a-z0-9-]+\.)*ruhiyatna\.id$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // starting application
  const port = config.get('port');
  await app.listen(port);
  console.log(`Listening on port ${port}`);
}
bootstrap();
