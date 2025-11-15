/**
 * Tests for ApiCommonModule
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ApiCommonModule } from './api-common.module';

describe('ApiCommonModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ApiCommonModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ApiCommonModule', () => {
    const apiCommonModule = module.get(ApiCommonModule);
    expect(apiCommonModule).toBeDefined();
    expect(apiCommonModule).toBeInstanceOf(ApiCommonModule);
  });

  it('should be a valid NestJS module', () => {
    const apiCommonModule = module.get(ApiCommonModule);
    expect(apiCommonModule.constructor.name).toBe('ApiCommonModule');
  });
});

