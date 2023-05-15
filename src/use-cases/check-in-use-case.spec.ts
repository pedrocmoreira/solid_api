import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in-use-case';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.559045),
      longitude: new Decimal(-46.800512),
    })

    //cria o mock
    vi.useFakeTimers()
  });

  afterEach(() => {
    //reseta o mock depois dos testes serem feitos
    vi.useRealTimers()
  })

  // o usuário pode fazer um check in
  it('it should be able to check in', async () => {


    const { checkIn } = await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.559045,
      userLongitude: -46.800512
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //o usuário não pode fazer mais de um check-in no mesmo dia
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.559045,
      userLongitude: -46.800512
    });

    await expect(() => sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.559045,
      userLongitude: -46.800512
    })).rejects.toBeInstanceOf(Error);

  });

  //o usuário pode fazer check-in mais de uma vez mas em dias diferentes
  it('should not be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))


    await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.559045,
      userLongitude: -46.800512
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.handle({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.559045,
      userLongitude: -46.800512
    })

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('shoud not be able to check in on a distant gym', async () => {

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.5519263),
      longitude: new Decimal(-46.7878682),
    })

    await expect(() =>
      sut.handle({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.559045,
        userLongitude: -46.800512
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});

//TDD

// Red: causar o erro
// Green: resolver o erro
// Refactor: refatorar a solução do erro