import { expect, describe, it, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCase } from './get-user-profile-use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  // deve retornar o perfil do usuário
  it('it should be able to get user profile', async () => {
   const createdUser =  await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.handle({
      userId: createdUser.id,
    });

    expect(user.name).toEqual('Jonh Doe');
  });

  // não deve retornar o perfil do usuário com o id errado
  it('it should be able to get user profile with wrong id', async () => {
    await expect(() => 
      sut.handle({
        userId: 'non-existin-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});