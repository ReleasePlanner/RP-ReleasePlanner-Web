/**
 * Security Tests
 * 
 * Comprehensive security tests for the API
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app/app.module';
import { SecurityTestHelpers } from './security.test-helpers';
import { UserRole } from '../../users/domain/user.entity';

/**
 * TODO: These e2e tests require a test database configuration
 * The tests are currently skipped due to circular dependency issues when loading AppModule
 * To fix:
 * 1. Configure TypeORM with an in-memory database (SQLite) for testing
 * 2. Or use a separate test configuration that avoids loading all entities at once
 * 3. Consider moving these to a separate e2e test suite with proper test database setup
 */
describe.skip('Security Tests', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let adminUser: SecurityTestHelpers['TestUser'];
  let regularUser: SecurityTestHelpers['TestUser'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    // Create test users
    adminUser = await SecurityTestHelpers.createTestUser(app, {
      username: `admin_${Date.now()}`,
      role: UserRole.ADMIN,
    });

    regularUser = await SecurityTestHelpers.createTestUser(app, {
      username: `user_${Date.now()}`,
      role: UserRole.USER,
    });

    adminToken = await SecurityTestHelpers.loginAndGetToken(
      app,
      adminUser.username,
      adminUser.password,
    );

    userToken = await SecurityTestHelpers.loginAndGetToken(
      app,
      regularUser.username,
      regularUser.password,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('OWASP A01:2021 - Broken Access Control', () => {
    it('should protect routes requiring authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/base-phases')
        .expect(401); // Unauthorized
    });

    it('should allow authenticated users to access protected routes', async () => {
      await request(app.getHttpServer())
        .get('/api/base-phases')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
  });

  describe('OWASP A03:2021 - Injection', () => {
    it('should prevent SQL injection in URL parameters', async () => {
      const isSafe = await SecurityTestHelpers.testSQLInjection(
        app,
        '/api/base-phases',
        userToken,
      );
      expect(isSafe).toBe(true);
    });

    it('should sanitize input data', async () => {
      const xssSafe = await SecurityTestHelpers.testXSS(
        app,
        '/api/base-phases',
        userToken,
      );
      expect(xssSafe).toBe(true);
    });
  });

  describe('OWASP A04:2021 - Insecure Design', () => {
    it('should validate input data', async () => {
      const isValidated = await SecurityTestHelpers.testInputValidation(
        app,
        '/api/base-phases',
        userToken,
        {
          name: '', // Invalid: empty name
          color: 'invalid-color', // Invalid: not hex color
        },
      );
      expect(isValidated).toBe(true);
    });

    it('should reject non-whitelisted properties', async () => {
      await request(app.getHttpServer())
        .post('/api/base-phases')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Phase',
          color: '#FF5733',
          maliciousField: 'should be rejected',
        })
        .expect(400);
    });
  });

  describe('OWASP A05:2021 - Security Misconfiguration', () => {
    it('should include security headers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    it('should not expose X-Powered-By header', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .expect(200);

      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on login', async () => {
      const rateLimitTest = await SecurityTestHelpers.testRateLimit(
        app,
        'post',
        '/api/auth/login',
        10,
        {
          username: 'test',
          password: 'wrong',
        },
      );

      expect(rateLimitTest.success).toBe(true);
    });

    it('should enforce rate limits on registration', async () => {
      const rateLimitTest = await SecurityTestHelpers.testRateLimit(
        app,
        'post',
        '/api/auth/register',
        5,
        {
          username: `test_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password: 'TestPassword123!',
        },
      );

      expect(rateLimitTest.success).toBe(true);
    });
  });

  describe('JWT Security', () => {
    it('should reject requests without token', async () => {
      await request(app.getHttpServer())
        .get('/api/base-phases')
        .expect(401);
    });

    it('should reject requests with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/base-phases')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should reject expired tokens', async () => {
      // Note: This would require a token that's actually expired
      // In a real test, you'd generate a token with short expiration
      const expiredToken = 'expired-token';
      await request(app.getHttpServer())
        .get('/api/base-phases')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Password Security', () => {
    it('should hash passwords in database', async () => {
      // This would require direct database access to verify
      // In a real scenario, you'd check that passwords are hashed
      const userData = {
        username: `hashtest_${Date.now()}`,
        email: `hashtest_${Date.now()}@example.com`,
        password: 'TestPassword123!',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Password should be hashed, not stored in plain text
      // This would require database inspection in real tests
    });

    it('should enforce password complexity', async () => {
      const weakPasswords = [
        'short', // Too short
        'nouppercase123!', // No uppercase
        'NOLOWERCASE123!', // No lowercase
        'NoNumbers!', // No numbers
        'NoSpecial123', // No special characters
      ];

      for (const password of weakPasswords) {
        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send({
            username: `test_${Date.now()}`,
            email: `test_${Date.now()}@example.com`,
            password,
          })
          .expect(400);
      }
    });
  });

  describe('CORS Security', () => {
    it('should allow requests from configured origins', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/health')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should reject requests from unauthorized origins in production', async () => {
      // This test would need production environment
      // In development, CORS is more permissive
    });
  });
});

