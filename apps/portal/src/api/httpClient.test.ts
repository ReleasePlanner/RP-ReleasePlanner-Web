import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { httpClient, HttpClientError } from "./httpClient";
import { authService } from "./services/auth.service";

// Mock dependencies
vi.mock("./services/auth.service", () => ({
  authService: {
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    refreshToken: vi.fn(),
    clearAuth: vi.fn(),
  },
}));

vi.mock("../utils/logging/Logger", () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("httpClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, "navigator", {
      writable: true,
      configurable: true,
      value: {
        onLine: true,
      },
    });
    vi.mocked(authService.getAccessToken).mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("HttpClientError", () => {
    it("should create error with all properties", () => {
      const error = new HttpClientError(
        "Test error",
        500,
        "TEST_ERROR",
        "TEST_CODE",
        "corr-123",
        "req-456",
        true,
        false
      );

      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(500);
      expect(error.error).toBe("TEST_ERROR");
      expect(error.code).toBe("TEST_CODE");
      expect(error.correlationId).toBe("corr-123");
      expect(error.requestId).toBe("req-456");
      expect(error.isNetworkError).toBe(true);
      expect(error.isTimeout).toBe(false);
    });
  });

  describe("GET requests", () => {
    it("should make successful GET request", async () => {
      const mockData = { id: "1", name: "Test" };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      } as Response);

      const result = await httpClient.get("/test");

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("should include authorization header when token exists", async () => {
      vi.mocked(authService.getAccessToken).mockReturnValue("test-token");
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      } as Response);

      await httpClient.get("/test");

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });
  });

  describe("POST requests", () => {
    it("should make successful POST request with data", async () => {
      const mockData = { id: "1", name: "Test" };
      const postData = { name: "New Item" };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      } as Response);

      const result = await httpClient.post("/test", postData);

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe("Error handling", () => {
    it("should handle 400 Bad Request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          message: "Invalid request",
          error: "BAD_REQUEST",
        }),
        url: "http://localhost:3000/api/test",
      } as Response);

      await expect(httpClient.get("/test")).rejects.toThrow(HttpClientError);
    });

    it("should handle 401 Unauthorized and refresh token", async () => {
      vi.mocked(authService.getAccessToken).mockReturnValue("old-token");
      vi.mocked(authService.getRefreshToken).mockReturnValue("refresh-token");
      vi.mocked(authService.refreshToken).mockResolvedValue({
        accessToken: "new-token",
        refreshToken: "new-refresh",
        user: {
          id: "1",
          username: "test",
          email: "test@test.com",
          role: "user",
        },
      });

      // First call returns 401
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          headers: new Headers(),
          url: "http://localhost:3000/api/test",
        } as Response)
        // Second call after refresh succeeds
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true }),
        } as Response);

      const result = await httpClient.get("/test");

      expect(result).toEqual({ success: true });
      expect(authService.refreshToken).toHaveBeenCalledWith("refresh-token");
    });

    it("should handle 500 Server Error", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "Server error" }),
        url: "http://localhost:3000/api/test",
      } as Response);

      await expect(
        httpClient.get("/test", { skipRetry: true })
      ).rejects.toThrow(HttpClientError);
    }, 10000);

    it("should handle network errors", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(
        httpClient.get("/test", { skipRetry: true })
      ).rejects.toThrow(HttpClientError);
    }, 10000);

    it("should handle timeout errors", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockImplementationOnce(() => {
        controller.abort();
        return Promise.reject(new Error("AbortError"));
      });

      await expect(
        httpClient.get("/test", { timeout: 100, skipRetry: true })
      ).rejects.toThrow(HttpClientError);
    }, 10000);

    it("should handle offline status", async () => {
      Object.defineProperty(globalThis, "navigator", {
        writable: true,
        configurable: true,
        value: {
          onLine: false,
        },
      });

      await expect(httpClient.get("/test")).rejects.toThrow(HttpClientError);
    });
  });

  describe("Retry logic", () => {
    it("should retry on server errors", async () => {
      // First call fails, second succeeds (with reduced retries)
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          headers: new Headers(),
          url: "http://localhost:3000/api/test",
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true }),
        } as Response);

      const result = await httpClient.get("/test", {
        retries: 1,
        retryDelay: 10,
      });

      expect(result).toEqual({ success: true });
      expect(fetch).toHaveBeenCalledTimes(2);
    }, 10000);

    it("should not retry on client errors (4xx)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        headers: new Headers(),
        url: "http://localhost:3000/api/test",
      } as Response);

      await expect(httpClient.get("/test")).rejects.toThrow();

      // Should not retry
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should retry on timeout errors", async () => {
      vi.mocked(fetch)
        .mockRejectedValueOnce(new Error("AbortError"))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: new Headers({ "content-type": "application/json" }),
          json: async () => ({ success: true }),
        } as Response);

      const result = await httpClient.get("/test");

      expect(result).toEqual({ success: true });
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("PUT requests", () => {
    it("should make successful PUT request", async () => {
      const mockData = { id: "1", name: "Updated" };
      const putData = { name: "Updated Item" };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      } as Response);

      const result = await httpClient.put("/test/1", putData);

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(putData),
        })
      );
    });
  });

  describe("PATCH requests", () => {
    it("should make successful PATCH request", async () => {
      const mockData = { id: "1", name: "Patched" };
      const patchData = { name: "Patched Item" };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => mockData,
      } as Response);

      const result = await httpClient.patch("/test/1", patchData);

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(patchData),
        })
      );
    });
  });

  describe("DELETE requests", () => {
    it("should make successful DELETE request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers(),
      } as Response);

      const result = await httpClient.delete("/test/1");

      expect(result).toEqual({});
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("Response handling", () => {
    it("should handle 204 No Content", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers(),
      } as Response);

      const result = await httpClient.get("/test");

      expect(result).toEqual({});
    });

    it("should handle non-JSON responses", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/plain" }),
        text: async () => "Plain text response",
      } as Response);

      const result = await httpClient.get("/test");

      expect(result).toBe("Plain text response");
    });
  });
});
