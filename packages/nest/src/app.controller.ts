import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  /**
   * @returns {string}
   * @memberof AppController
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Todos API
   *
   * @returns JSON
   * @memberof AppController
   */
  @Get('/todos')
  getAllTodos() {
    return {
      todos: [],
      count: this.appService.getCount()
    }
  }
  
}
