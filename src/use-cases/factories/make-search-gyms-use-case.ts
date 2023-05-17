import { SearchGymUseCase } from '../search-gyms-use-case';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymUseCase(gymsRepository);
  
  return searchGymsUseCase;
}