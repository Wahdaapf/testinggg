import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationException, ValidationFilter } from './util/filter.validation';
import { ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api', {
    exclude: ['/images/(.*)'], // Mengecualikan rute untuk file statis
  });

  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg = {};
        errors.forEach((err) => {
          const propertyName = err.property || 'general';
          errMsg[propertyName] = [...Object.values(err.constraints)];
        });
        return new ValidationException(errMsg);
      }
    })
  )
  const port = process.env.PORT;
  //set port di app
  await app.listen(port);
}
bootstrap();
