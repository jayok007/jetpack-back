const JetpackRepository = require('../../src/jetpack/JetpackRepository');
const uuid = require('uuid');

jest.mock('uuid');

describe('Jetpack repository', () => {
  const jetpacks = [{ id: 1, name: 'Toto' }, { id: 2, name: 'Tata' }];
  let repository;
  let dbMock;

  beforeEach(() => {
    dbMock = {
      get: jest.fn(() => dbMock),
      push: jest.fn(() => dbMock),
      write: jest.fn(),
      value: () => jetpacks
    };
    repository = new JetpackRepository(dbMock);
    uuid.mockReturnValue('my-id');
  });

  it('should retreive the jetpacks', () => {
    expect(repository.getAll()).toBe(jetpacks);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
  });

  it('should create a jetpack', () => {
    const jetpack = repository.createOne({
      name: 'Test',
      image: 'Image'
    });

    expect(jetpack).toEqual({
      id: 'my-id',
      name: 'Test',
      image: 'Image'
    });
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.push).toHaveBeenCalledWith({
      id: 'my-id',
      name: 'Test',
      image: 'Image'
    });
    expect(dbMock.write).toHaveBeenCalled();
  });
});
