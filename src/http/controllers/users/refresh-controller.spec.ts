import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';

describe('Refresh controller e2e', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {

    await request(app.server).post('/users').send({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    const authResponse = await request(app.server).post('/sessions').send({
        email: 'jonhdoe@email.com',
        password: '123456',
      });

      const cookies = authResponse.get('Set-Cookie');

      const response = await request(app.server)
        .patch('/refresh/token')
        .set('Cookie', cookies)
        .send();
        


    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ]);
  });
});