/**
 * Metrics Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { register } from 'prom-client';

describe('MetricsController', () => {
  let controller: MetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMetrics', () => {
    it('should return Prometheus metrics', async () => {
      const mockMetrics = '# HELP test_metric Test metric\n# TYPE test_metric counter\ntest_metric 1';
      jest.spyOn(register, 'metrics').mockResolvedValue(mockMetrics);

      const result = await controller.getMetrics();

      expect(result).toBe(mockMetrics);
      expect(register.metrics).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting metrics', async () => {
      jest.spyOn(register, 'metrics').mockRejectedValue(new Error('Metrics error'));

      await expect(controller.getMetrics()).rejects.toThrow('Metrics error');
    });
  });
});

