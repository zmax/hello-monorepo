import { Injectable } from '@nestjs/common';
import { UniqleIndex } from '@beyond/utils';

@Injectable()
export class AppService {

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
    return UniqleIndex.index();
  }
  
}
