import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history-use-case';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gyms-use-case';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);

  });

  // pode pesquisar por academias
  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -23.559045,
      longitude: -46.800512,

    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: -23.559045,
      longitude: -46.800512,
    })

    const { gyms } = await sut.handle({
      query: 'JavaScript',
      page: 1,
    });

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ gym_id: 'JavaScript Gym' }),
    ])
  });

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -23.559045,
        longitude: -46.800512,
      })
    }

    const { gyms } = await sut.handle({
      query: 'Javascript',
      page: 2
    });

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ gym_id: 'Javascript Gym 21' }),
      expect.objectContaining({ gym_id: 'Javascript Gym 22' }),
    ])
  });
});

