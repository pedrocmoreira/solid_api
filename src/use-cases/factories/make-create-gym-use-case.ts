import { CreateGymUseCase } from '../create-gym-use-case';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(gymsRepository);
  
  return createGymUseCase;
}