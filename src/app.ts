import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';

import { ZodError } from 'zod';

import { usersRoutes } from './http/controllers/users/routes';
import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({message: 'Validation error', issues: error.format()});
  }

  if(env.NODE_ENV !== 'production') {
    console.error(error);
  }else {
    // TODO: aqui deveria ser feito um log com uma ferramenta externa por exemplo DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' });
});
