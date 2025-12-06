import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { authService } from "./auth.service";
import { httpClient } from "../httpClient";
import {
  TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from "../config";

vi.mock("../httpClient", () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("login", () => {
    it("should login and store tokens and user", async () => {
      const mockResponse = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          role: "user" as const,
        },
      };

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.login({
        username: "testuser",
        password: "password123",
      });

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("access-token");
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBe(
        "refresh-token"
      );
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBe(
        JSON.stringify(mockResponse.user)
      );
    });
  });

  describe("register", () => {
    it("should register and store tokens and user", async () => {
      const mockResponse = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "1",
          username: "newuser",
          email: "new@example.com",
          role: "user" as const,
        },
      };

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.register({
        username: "newuser",
        email: "new@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
      });

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("access-token");
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBe(
        "refresh-token"
      );
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBe(
        JSON.stringify(mockResponse.user)
      );
    });
  });

  describe("refreshToken", () => {
    it("should refresh token and update storage", async () => {
      const mockResponse = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        user: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          role: "user" as const,
        },
      };

      vi.mocked(httpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken("old-refresh-token");

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("new-access-token");
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBe(
        "new-refresh-token"
      );
    });
  });

  describe("logout", () => {
    it("should logout and clear storage even if API call fails", async () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "token");
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, "refresh");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id: "1" }));

      vi.mocked(httpClient.post).mockRejectedValue(new Error("API Error"));

      await authService.logout();

      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull();
    });

    it("should logout successfully when API call succeeds", async () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "token");
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, "refresh");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id: "1" }));

      vi.mocked(httpClient.post).mockResolvedValue({});

      await authService.logout();

      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user from API", async () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: "user" as const,
      };

      vi.mocked(httpClient.post).mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(httpClient.post).toHaveBeenCalledWith("/auth/me");
    });
  });

  describe("getAccessToken", () => {
    it("should return access token from localStorage", () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "test-token");
      expect(authService.getAccessToken()).toBe("test-token");
    });

    it("should return null when no token exists", () => {
      expect(authService.getAccessToken()).toBeNull();
    });
  });

  describe("getRefreshToken", () => {
    it("should return refresh token from localStorage", () => {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, "test-refresh");
      expect(authService.getRefreshToken()).toBe("test-refresh");
    });

    it("should return null when no token exists", () => {
      expect(authService.getRefreshToken()).toBeNull();
    });
  });

  describe("getUser", () => {
    it("should return user from localStorage", () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: "user" as const,
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      expect(authService.getUser()).toEqual(mockUser);
    });

    it("should return null when no user exists", () => {
      expect(authService.getUser()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when access token exists", () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "test-token");
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("should return false when no access token exists", () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe("setTokens", () => {
    it("should set tokens in localStorage", () => {
      authService.setTokens("access-token", "refresh-token");
      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("access-token");
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBe(
        "refresh-token"
      );
    });
  });

  describe("setUser", () => {
    it("should set user in localStorage", () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: "user" as const,
      };

      authService.setUser(mockUser);
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBe(
        JSON.stringify(mockUser)
      );
    });
  });

  describe("clearAuth", () => {
    it("should clear all auth data from localStorage", () => {
      localStorage.setItem(TOKEN_STORAGE_KEY, "token");
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, "refresh");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id: "1" }));

      authService.clearAuth();

      expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
      expect(localStorage.getItem(USER_STORAGE_KEY)).toBeNull();
    });
  });
});
