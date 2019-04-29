const JetpackRepository = require('../../src/jetpack/JetpackRepository');

describe('Jetpack repository', () => {
  it('should retreive the jetpacks', () => {
    const jetpacks = [{ id: 1, name: 'Toto' }, { id: 2, name: 'Tata' }];
    const dbMock = {
      get: jest.fn(() => dbMock),
      value: () => jetpacks
    };

    const repository = new JetpackRepository(dbMock);

    expect(repository.getAll()).toBe(jetpacks);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
  });
});
