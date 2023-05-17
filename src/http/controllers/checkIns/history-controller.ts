import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeFetchUserCheckInsUseCase } from '@/use-cases/factories/make-fech-user-check-ins-history-use-case';

export async function historyController(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsUseCase = makeFetchUserCheckInsUseCase();


  const { checkIns } = await fetchUserCheckInsUseCase.handle({
    userId: request.user.sub,
    page
  });

  return reply.status(201).send({
    checkIns
  });
}