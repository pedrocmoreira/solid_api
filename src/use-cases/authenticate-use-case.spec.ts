import { expect, describe, it, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate-use-case';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  // o usuário deve ser autenticado
  it('it should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.handle({
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  // não deve ser autenticado com o e-mail errado
  it('it should be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.handle({
        email: 'jonhdoe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  // não deve ser autenticado com a senha errado
  it('it should be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password_hash: await hash('123456', 6),
    });

   await expect(() =>
      sut.handle({
        email: 'jonhdoe@example.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

});