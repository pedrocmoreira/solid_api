import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';

export async function searchGymsController(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsSchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsSchema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();


  const { gyms } = await searchGymsUseCase.handle({
    query,
    page
  });

  return reply.status(201).send({
    gyms
  });
}