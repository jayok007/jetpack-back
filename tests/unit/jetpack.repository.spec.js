const JetpackRepository = require('../../src/jetpack/JetpackRepository');
const uuid = require('uuid');

jest.mock('uuid');

describe('Jetpack repository', () => {
  it('should retreive the jetpacks', () => {
    const dbMock = {
      get: jest.fn(() => dbMock),
      value: () => [{ id: 1, name: 'Toto' }, { id: 2, name: 'Tata' }]
    };
    const repository = new JetpackRepository(dbMock);

    expect(repository.getAll()).toEqual([
      { id: 1, name: 'Toto' },
      { id: 2, name: 'Tata' }
    ]);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
  });

  it('should create a jetpack', () => {
    const dbMock = {
      get: jest.fn(() => dbMock),
      push: jest.fn(() => dbMock),
      write: jest.fn()
    };
    uuid.mockReturnValue('my-id');
    const repository = new JetpackRepository(dbMock);

    const jetpack = repository.createOne({
      name: 'Test',
      image: 'Image'
    });

    expect(jetpack).toEqual({
      id: 'my-id',
      name: 'Test',
      image: 'Image'
    });
  });

  it('should update an existing jetpack', () => {
    const dbMock = {
      get: jest.fn(() => dbMock),
      find: jest.fn(() => dbMock),
      assign: jest.fn(() => dbMock),
      write: jest.fn(() => ['test'])
    };
    const repository = new JetpackRepository(dbMock);

    const updated = repository.updateOne({
      id: '1',
      name: 'Test',
      image: 'Image'
    });

    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.find).toHaveBeenCalledWith({ id: '1' });
    expect(dbMock.assign).toHaveBeenCalledWith({
      name: 'Test',
      image: 'Image'
    });
    expect(updated).toBe('test');
  });
});
