import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin1234!';
  const role = process.env.ADMIN_ROLE || 'admin';

  const existing = await usersService.findByUsername(username);

  if (existing) {
    Logger.log(`El usuario administrador '${username}' ya existe en la base de datos.`);
    await app.close();
    process.exit(0);
  }

  const user = await usersService.create(username, password, role);
  Logger.log(`Usuario administrador creado: ${user.username} (ID: ${user.id})`);

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  Logger.error('Error creando el usuario administrador:', error);
  process.exit(1);
});
