import { expect, describe, it, beforeEach, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { ValidateCheckInUseCase } from './validate-check-in-use-case';
import { ResourceNotFoundError } from './errors/resource-not-found-error';


let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    // await gymsRepository.create({
    //   id: 'gym-01',
    //   title: 'Javascript Gym',
    //   description: '',
    //   phone: '',
    //   latitude: -23.55904,
    //   longitude: -46.800512,
    // });

    // cria o mock
    // vi.useFakeTimers();
  });

  afterEach(() => {
    // reseta o mock depois dos testes serem feitos
    // vi.useRealTimers();
  });

  // pode fazer a validação de um check in
  it('it should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    });

    const { checkIn } = await sut.handle({
      checkInId: createdCheckIn.id
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  // não pode validar um check-in que não existe
  it('it should not be able to validate an inexistent check-in', async () => {
    expect(() => sut.handle({
      checkInId: 'inexistent-check-in-id'
    }),).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});