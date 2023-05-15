import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms-use-case';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);

  });

  // pode pesquisar por academias perto da localização
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -23.559045,
      longitude: -46.800512,

    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -23.612947,
      longitude: -46.5106783
    })

    const { gyms } = await sut.handle({
      userLatitude: -23.559045,
      userLongitude: -46.800512
    });

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  });
});

