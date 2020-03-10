import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  /**
   * @static
   * @type {number}
   * @memberof AppService
   */
  static count: number = 0;

  /**
   * @returns {string}
   * @memberof AppService
   */
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * @returns {number}
   * @memberof AppService
   */
  getCount(): number {
    return AppService.count++;
  }
  
}
