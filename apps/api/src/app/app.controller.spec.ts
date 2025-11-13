import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return API version message', () => {
      jest.spyOn(service, 'getHello').mockReturnValue('Release Planner API v1.0.0');
      expect(controller.getHello()).toBe('Release Planner API v1.0.0');
      expect(service.getHello).toHaveBeenCalled();
    });
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = controller.getHealth();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });
});
