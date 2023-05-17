import { FastifyRequest, FastifyReply } from 'fastify';


export async function refreshController(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true });

  const { role } = request.user;

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      }
    });

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '1d'
      }
    });

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // Diz se vai ser encriptado pelo hTTPS, se true o front não consegue ler
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
}
