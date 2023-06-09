import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';

export async function nearbyGymsController(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsSchema = z.object({
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180;
    })
  });

  const { latitude, longitude } = nearbyGymsSchema.parse(request.query);

  const nearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await nearbyGymsUseCase.handle({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({
    gyms
  });
}