import { expect, describe, it, beforeEach } from 'vitest';

import { CreateGymUseCase } from './create-gym-use-case';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

// teste unitário nunca vai ter nada com o banco de dados

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  // o usuário deve ser cadastrado
  it('it should be able to create gym', async () => {
    const { gym } = await sut.handle({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -23.559045,
      longitude: -46.800512,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});