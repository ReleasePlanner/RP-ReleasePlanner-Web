/**
 * Security Test Helpers
 * 
 * Utilities for security testing
 */
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRole } from '../../users/domain/user.entity';

export interface TestUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export class SecurityTestHelpers {
  /**
   * Create a test user via API
   */
  static async createTestUser(
    app: INestApplication,
    userData: Partial<TestUser> = {},
  ): Promise<TestUser> {
    const defaultUser: Partial<TestUser> = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'TestPassword123!',
      role: UserRole.USER,
      ...userData,
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: defaultUser.username,
        email: defaultUser.email,
        password: defaultUser.password,
        role: defaultUser.role,
      })
      .expect(201);

    return {
      id: response.body.user.id,
      username: defaultUser.username!,
      email: defaultUser.email!,
      password: defaultUser.password!,
      role: defaultUser.role!,
    };
  }

  /**
   * Login and get access token
   */
  static async loginAndGetToken(
    app: INestApplication,
    username: string,
    password: string,
  ): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username, password })
      .expect(200);

    return response.body.accessToken;
  }

  /**
   * Make authenticated request
   */
  static async authenticatedRequest(
    app: INestApplication,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    token: string,
    body?: any,
  ): Promise<request.Response> {
    const req = request(app.getHttpServer())[method](url)
      .set('Authorization', `Bearer ${token}`);

    if (body) {
      req.send(body);
    }

    return req;
  }

  /**
   * Test rate limiting
   */
  static async testRateLimit(
    app: INestApplication,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    maxRequests: number,
    body?: any,
  ): Promise<{ success: boolean; blockedAtRequest: number | null }> {
    let blockedAtRequest: number | null = null;

    for (let i = 1; i <= maxRequests + 5; i++) {
      const req = request(app.getHttpServer())[method](url);
      if (body) {
        req.send(body);
      }

      const response = await req;

      if (response.status === 429 && blockedAtRequest === null) {
        blockedAtRequest = i;
      }
    }

    return {
      success: blockedAtRequest !== null,
      blockedAtRequest,
    };
  }

  /**
   * Test SQL injection attempt
   */
  static async testSQLInjection(
    app: INestApplication,
    url: string,
    token: string,
  ): Promise<boolean> {
    const sqlInjectionAttempts = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "1' OR '1'='1",
    ];

    for (const attempt of sqlInjectionAttempts) {
      const response = await request(app.getHttpServer())
        .get(`${url}/${attempt}`)
        .set('Authorization', `Bearer ${token}`);

      // Should not return 500 or expose database errors
      if (response.status === 500) {
        return false; // Vulnerable
      }

      // Check if response contains SQL error messages
      const responseText = JSON.stringify(response.body);
      if (
        responseText.includes('syntax error') ||
        responseText.includes('SQL') ||
        responseText.includes('database')
      ) {
        return false; // Vulnerable
      }
    }

    return true; // Safe
  }

  /**
   * Test XSS attempt
   */
  static async testXSS(
    app: INestApplication,
    url: string,
    token: string,
    method: 'post' | 'put' | 'patch' = 'post',
  ): Promise<boolean> {
    const xssAttempts = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    ];

    for (const attempt of xssAttempts) {
      const response = await request(app.getHttpServer())[method](url)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: attempt, description: attempt });

      // Check if XSS payload is reflected in response
      const responseText = JSON.stringify(response.body);
      if (
        responseText.includes('<script>') ||
        responseText.includes('onerror=') ||
        responseText.includes('javascript:')
      ) {
        return false; // Vulnerable
      }
    }

    return true; // Safe
  }

  /**
   * Test authorization (RBAC)
   */
  static async testAuthorization(
    app: INestApplication,
    url: string,
    userToken: string,
    requiredRole?: UserRole,
  ): Promise<{ authorized: boolean; statusCode: number }> {
    const response = await request(app.getHttpServer())
      .get(url)
      .set('Authorization', `Bearer ${userToken}`);

    return {
      authorized: response.status === 200,
      statusCode: response.status,
    };
  }

  /**
   * Test input validation
   */
  static async testInputValidation(
    app: INestApplication,
    url: string,
    token: string,
    invalidData: any,
  ): Promise<boolean> {
    const response = await request(app.getHttpServer())
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(invalidData);

    // Should return 400 Bad Request for invalid input
    return response.status === 400;
  }
}

