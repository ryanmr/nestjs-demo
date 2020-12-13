import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Health } from './health/health';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Health {
    return this.appService.getHello();
  }
}
