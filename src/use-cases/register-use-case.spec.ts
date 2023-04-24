import { expect, describe, it } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterUseCase } from './registerUseCase';

// teste unitário nunca vai ter nada com o banco de dados

describe('Register Use Case', () => {
  // a senha do usuário deve ter um hash durante o registro 
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },
      
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      }
    });

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
});