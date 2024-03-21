import { FastifyReply, FastifyRequest } from 'fastify';
import { cookies } from '../config/cookies-names';

export async function checkAuthorization(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.cookies[cookies.accessToken];

  if (!userId) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}
