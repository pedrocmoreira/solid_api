import { Environment } from 'vitest';

export default <Environment>{
  name: 'prisma',
  async setup() {
    console.log('Executou!!');

    return {
     async teardown() { 
        console.log('Teardown');
      }, // O teardown é o que quero executar depois de cada teste
    };
  }
};