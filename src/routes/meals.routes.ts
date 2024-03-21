import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../setup/database';
import { cookies } from '../config/cookies-names';
import { checkAuthorization } from '../middlewares/check-authorization';

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkAuthorization);

  app.get('/', async (request, reply) => {
    const userId = request.cookies[cookies.accessToken];

    const meals = await knex('meals').where({ user_id: userId }).select();

    reply.code(200).send({ total: meals.length, meals });
  });

  app.get('/:id', async (request, reply) => {
    const mealByIdSchema = z.object({
      id: z.string().uuid(),
    });

    const userId = request.cookies[cookies.accessToken];

    const { id } = mealByIdSchema.parse(request.params);

    const meal = await knex('meals').where({ id, user_id: userId }).first();

    if (!meal) {
      return reply.code(404).send({ message: 'Meal not found' });
    }

    reply.code(200).send({ meal });
  });

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      is_diet: z.boolean(),
    });

    const body = createMealBodySchema.parse(request.body);

    const userId = request.cookies[cookies.accessToken];

    await knex('meals').insert({ ...body, id: randomUUID(), user_id: userId });

    reply.code(201).send();
  });

  app.patch('/:id', async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      is_diet: z.boolean(),
    });

    const userId = request.cookies[cookies.accessToken];

    const { id } = updateMealParamsSchema.parse(request.params);

    const body = updateMealBodySchema.parse(request.body);

    const meal = await knex('meals').where({ id, user_id: userId }).first();

    if (!meal) {
      return reply.code(404).send({ message: 'Meal not found' });
    }

    await knex('meals').where({ id, user_id: userId }).update(body);

    reply.code(200).send();
  });

  app.delete('/:id', async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const userId = request.cookies[cookies.accessToken];

    const { id } = deleteMealParamsSchema.parse(request.params);

    const meal = await knex('meals').where({ id, user_id: userId }).first();

    if (!meal) {
      return reply.code(404).send({ message: 'Meal not found' });
    }

    await knex('meals').where({ id, user_id: userId }).del();

    reply.code(204).send();
  });
}
