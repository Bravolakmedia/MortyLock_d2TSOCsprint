import { Module } from '@nestjs/common';
import { ProtectedController } from './some-protected.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // Import the guard if needed

@Module({
  controllers: [ProtectedController],
  providers: [JwtAuthGuard],  // Add the guard if it's being used here
})
export class ProtectedModule {}
