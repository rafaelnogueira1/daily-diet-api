import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    reply.code(200).send({ results: [] });
  });

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
      age: z.number(),
      active: z.boolean(),
    });

    const body = bodySchema.parse(request.body);

    const user = {
      id: randomUUID(),
      ...body,
    };

    reply.code(201).send(user);
  });
}
