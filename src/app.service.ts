import { Injectable } from '@nestjs/common';
import { Health } from './health/health';
import { HealthService } from './health/health.service';

@Injectable()
export class AppService {
  constructor(private readonly healthService: HealthService) {}

  getHello(): Health {
    return this.healthService.getHealth();
  }
}
