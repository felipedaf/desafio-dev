import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(): { message: string } {
    return this.appService.ping();
  }

  @Get('store')
  getStores() {
    return this.appService.getStores();
  }

  @Get('transaction/:storeId')
  getTransactions(@Param('storeId') storeId) {
    return this.appService.getTransactions(storeId);
  }
}
