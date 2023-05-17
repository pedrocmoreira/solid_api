import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create check-in e2e', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

   const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -27.2892852,
        longitude: -49.6401091
      }
    });

    const profileResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2892852,
        longitude: -49.6401091
      });

    expect(profileResponse.statusCode).toEqual(201);
  });
});