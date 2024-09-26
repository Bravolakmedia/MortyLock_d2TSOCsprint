import { Module } from '@nestjs/common';
import { MortgageService } from './mortgage.service';
import { MortgageRequestController } from './mortgage.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MortgageService],
  controllers: [MortgageRequestController]
})
export class MortgageModule {}
