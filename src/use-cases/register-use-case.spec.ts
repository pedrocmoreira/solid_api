import { expect, describe, it } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterUseCase } from './register-use-case';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

// teste unitário nunca vai ter nada com o banco de dados

describe('Register Use Case', () => {
  // o usuário deve ser cadastrado
  it('it should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.handle({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  // a senha do usuário deve ter um hash durante o registro 
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.handle({
      name: 'Jonh Doe',
      email: 'jonhdoe@email.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  // não deve ser possível criar um usuário com o mesmo email
  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = 'jonhdoe@email.com';

    await registerUseCase.handle({
      name: 'Jonh Doe',
      email,
      password: '123456',
    });


    await expect(() =>
      registerUseCase.handle({
        name: 'Jonh Doe',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});