import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('API: /todos', () => {
    it('should return json', () => {
      expect(appController.getAllTodos()).toEqual({
        todos: [],
        count: 0
      });
    });

    it('should can be accumulated calls.', () => {
      expect(appController.getAllTodos()).toEqual({
        todos: [],
        count: 1
      });
    });
  })
});
