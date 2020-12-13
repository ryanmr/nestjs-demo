import { Injectable } from '@nestjs/common';
import { cpus } from 'os';
import { Health } from './health';
import { computeUsage } from './health.util';

@Injectable()
export class HealthService {
  public getHealth() {
    const health: Health = {
      project: 'NestJS Demo 🎉',
      authors: ['Ryan'],
      usage: this.getCpuUsage().user,
      uptime: this.getUptime(),
      time: Date.now(),
    };

    return health;
  }

  private getCpuUsage() {
    return computeUsage(cpus());
  }

  private getUptime() {
    return process.uptime();
  }
}
