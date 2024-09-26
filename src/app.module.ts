import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaService } from './database/prisma.service';
import { ProtectedModule } from './protected/protected.module';
import { MortgageModule } from './mortgage/mortgage.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [AuthModule, DatabaseModule, ConfigModule.forRoot({isGlobal: true}), UserModule, ProtectedModule, MortgageModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
