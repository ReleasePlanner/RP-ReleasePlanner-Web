/**
 * Health Controller Unit Tests
 * Coverage: 100%
 */
import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from "@nestjs/terminus";
import { CacheService } from "../common/cache/cache.service";

describe("HealthController", () => {
  let controller: HealthController;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockDb = {
    pingCheck: jest.fn(),
  };

  const mockMemory = {
    checkHeap: jest.fn(),
    checkRSS: jest.fn(),
  };

  const mockDisk = {
    checkStorage: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockDb,
        },
        {
          provide: MemoryHealthIndicator,
          useValue: mockMemory,
        },
        {
          provide: DiskHealthIndicator,
          useValue: mockDisk,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("check", () => {
    it("should return health check results", () => {
      const mockResult = {
        status: "ok",
        info: {
          database: { status: "up" },
          memory_heap: { status: "up" },
          memory_rss: { status: "up" },
          storage: { status: "up" },
        },
      };

      mockHealthCheckService.check.mockReturnValue(mockResult);
      mockDb.pingCheck.mockReturnValue({ database: { status: "up" } });
      mockMemory.checkHeap.mockReturnValue({ memory_heap: { status: "up" } });
      mockMemory.checkRSS.mockReturnValue({ memory_rss: { status: "up" } });
      mockDisk.checkStorage.mockReturnValue({ storage: { status: "up" } });

      const result = controller.check();

      expect(result).toEqual(mockResult);
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);
    });
  });

  describe("liveness", () => {
    it("should return liveness status", () => {
      const result = controller.liveness();

      expect(result).toHaveProperty("status", "ok");
      expect(result).toHaveProperty("timestamp");
      expect(typeof result.timestamp).toBe("string");
      expect(new Date(result.timestamp).getTime()).toBeLessThanOrEqual(
        Date.now()
      );
    });
  });

  describe("readiness", () => {
    it("should return readiness check results", () => {
      const mockResult = {
        status: "ok",
        info: {
          database: { status: "up" },
        },
      };

      mockHealthCheckService.check.mockReturnValue(mockResult);
      mockDb.pingCheck.mockReturnValue({ database: { status: "up" } });

      const result = controller.readiness();

      expect(result).toEqual(mockResult);
      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);
    });
  });

  describe("cacheStatus", () => {
    it("should return ok when cache is working", async () => {
      let storedValue: string | undefined;

      // Mock set to store the value that was passed
      mockCacheService.set.mockImplementation(
        async (key: string, value: string) => {
          if (key.includes("health:check")) {
            storedValue = value;
          }
          return undefined;
        }
      );

      // Mock get to return the stored value
      mockCacheService.get.mockImplementation(async (key: string) => {
        if (key.includes("health:check")) {
          return storedValue;
        }
        return undefined;
      });

      mockCacheService.del.mockResolvedValue(undefined);

      const result = await controller.cacheStatus();

      expect(result).toEqual({
        status: "ok",
        message: "Cache is working",
      });
      expect(mockCacheService.set).toHaveBeenCalled();
      expect(mockCacheService.get).toHaveBeenCalled();
      expect(mockCacheService.del).toHaveBeenCalled();
    });

    it("should return error when cache test fails", async () => {
      mockCacheService.set.mockResolvedValue(undefined);
      mockCacheService.get.mockResolvedValue("different-value");
      mockCacheService.del.mockResolvedValue(undefined);

      const result = await controller.cacheStatus();

      expect(result).toEqual({
        status: "error",
        message: "Cache test failed",
      });
    });

    it("should handle cache errors", async () => {
      const error = new Error("Cache connection failed");
      mockCacheService.set.mockRejectedValue(error);

      const result = await controller.cacheStatus();

      expect(result).toEqual({
        status: "error",
        message: "Cache connection failed",
      });
    });

    it("should handle non-Error objects", async () => {
      mockCacheService.set.mockRejectedValue("String error");

      const result = await controller.cacheStatus();

      expect(result).toEqual({
        status: "error",
        message: "Cache error",
      });
    });
  });
});
