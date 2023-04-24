import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class PrismaUsersRepository {
  // Aqui vou ter vários métodos que serão a porta de entrada para todos os métodos do banco de dados

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user; 
  }

  
}