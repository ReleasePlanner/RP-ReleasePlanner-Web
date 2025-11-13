/**
 * Auth Controller Tests
 * 
 * Security and functionality tests for authentication
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { SecurityTestHelpers } from '../common/tests/security.test-helpers';
import { UserRole } from '../users/domain/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testUser: SecurityTestHelpers['TestUser'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject weak passwords', async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'weak', // Too short, no uppercase, no number
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });

    it('should reject duplicate username', async () => {
      const userData = {
        username: `duplicate_${Date.now()}`,
        email: `test1_${Date.now()}@example.com`,
        password: 'TestPassword123!',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to register again with same username
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          ...userData,
          email: `test2_${Date.now()}@example.com`,
        })
        .expect(409);
    });

    it('should enforce rate limiting', async () => {
      const rateLimitTest = await SecurityTestHelpers.testRateLimit(
        app,
        'post',
        '/api/auth/register',
        5, // Should allow 5 registrations per minute
        {
          username: `ratelimit_${Date.now()}`,
          email: `ratelimit_${Date.now()}@example.com`,
          password: 'TestPassword123!',
        },
      );

      expect(rateLimitTest.success).toBe(true);
      expect(rateLimitTest.blockedAtRequest).toBeLessThanOrEqual(6);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      testUser = await SecurityTestHelpers.createTestUser(app);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('id');
    });

    it('should reject invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'WrongPassword123!',
        })
        .expect(401);
    });

    it('should enforce rate limiting', async () => {
      const rateLimitTest = await SecurityTestHelpers.testRateLimit(
        app,
        'post',
        '/api/auth/login',
        10, // Should allow 10 login attempts per minute
        {
          username: testUser.username,
          password: 'WrongPassword',
        },
      );

      expect(rateLimitTest.success).toBe(true);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      testUser = await SecurityTestHelpers.createTestUser(app);
      const loginResponse = await SecurityTestHelpers.loginAndGetToken(
        app,
        testUser.username,
        testUser.password,
      );
      
      // Get refresh token from login
      const fullResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        });
      
      refreshToken = fullResponse.body.refreshToken;
    });

    it('should refresh access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject invalid refresh token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    let token: string;

    beforeEach(async () => {
      testUser = await SecurityTestHelpers.createTestUser(app);
      token = await SecurityTestHelpers.loginAndGetToken(
        app,
        testUser.username,
        testUser.password,
      );
    });

    it('should logout successfully', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .expect(401);
    });
  });

  describe('POST /api/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      testUser = await SecurityTestHelpers.createTestUser(app);
      token = await SecurityTestHelpers.loginAndGetToken(
        app,
        testUser.username,
        testUser.password,
      );
    });

    it('should return current user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.email).toBe(testUser.email);
    });

    it('should require authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/me')
        .expect(401);
    });

    it('should reject invalid token', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});

