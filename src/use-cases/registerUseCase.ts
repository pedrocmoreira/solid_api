import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: any){}

  async handle({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email,
      }
    });

    if (userWithSameEmail) {
      throw new Error('E-mail already exists');
    }

    // const prismaUsersRepository = new PrismaUsersRepository();

   await  this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}


// SOLID

// D - Dependency inversion principle

