import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { ValidateCheckInUseCase } from '../validate-check-in-use-case';

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckInsUseCase = new ValidateCheckInUseCase(checkInsRepository);
  
  return validateCheckInsUseCase;
}