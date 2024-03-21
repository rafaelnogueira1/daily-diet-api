import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { knex } from '../setup/database';
import { cookies } from '../config/cookies-names';

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const users = await knex.select('*').from('users');

    reply.code(200).send({ total: users.length, results: users });
  });

  app.get('/:id', async (request, reply) => {
    const userByIdSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = userByIdSchema.parse(request.params);

    const accessToken = request.cookies[cookies.accessToken];

    if (id !== accessToken) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }

    const users = await knex.select('*').from('users').where({ id }).first();

    reply.code(200).send({ users });
  });

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      age: z.number(),
      active: z.boolean(),
    });

    const body = createUserBodySchema.parse(request.body);

    const user = {
      id: randomUUID(),
      ...body,
    };

    reply.cookie(cookies.accessToken, user.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    await knex.insert(user).into('users');

    reply.code(201).send();
  });

  app.patch('/:id', async (request, reply) => {
    const updateUserParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      age: z.number(),
      active: z.boolean(),
    });

    const { id } = updateUserParamsSchema.parse(request.params);
    const body = updateUserBodySchema.parse(request.body);

    const accessToken = request.cookies[cookies.accessToken];

    if (id !== accessToken) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }

    await knex.update(body).where({ id }).into('users');

    reply.code(200).send();
  });
}
