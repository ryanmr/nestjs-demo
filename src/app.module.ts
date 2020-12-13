import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from './health/health.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, HealthService],
})
export class AppModule {}
