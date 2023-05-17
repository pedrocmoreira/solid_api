import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { createCheckInController } from './create-check-in-controller';
import { validateCheckInController } from './validate-check-in-controller';
import { historyController } from './history-controller';
import { metricsUserController } from './metrics-user-controller';


export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/check-ins/history', historyController);
  app.get('check-ins/metrics', metricsUserController);

  app.post('/gyms/:gymId/check-ins', createCheckInController);
  app.patch('/check-ins/:checkInId/validate', validateCheckInController);
}