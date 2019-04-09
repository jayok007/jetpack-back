const jetpackRepository = require('../../src/Repository/JetpackRepository');

describe('Get all jetpacks', () => {
  test('Check lowdb get', () => {
    const jetpacks = [{ id: 1, name: 'Toto' }, { id: 2, name: 'Tata' }];
    const dbMock = {
      get: jest.fn(() => dbMock),
      value: () => jetpacks
    };

    const repository = new jetpackRepository(dbMock);

    expect(repository.getAll()).toBe(jetpacks);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
  });
});
