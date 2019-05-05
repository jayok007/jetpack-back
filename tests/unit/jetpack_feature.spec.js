const JetpackRepository = require('../../src/jetpack/JetpackRepository');
const db = require('../../src/db');
const uuid = require('uuid');

jest.mock('uuid');

describe('Jetpack feature', () => {
  let inMemoryDb;
  let repository;

  beforeEach(() => {
    inMemoryDb = db();
    inMemoryDb
      .defaults({
        jetpacks: [
          { id: '1', name: 'Name 1', image: 'Image 1' },
          { id: '2', name: 'Name 2', image: 'Image 2' },
          { id: '3', name: 'Name 3', image: 'Image 3' }
        ]
      })
      .write();
    repository = new JetpackRepository(inMemoryDb);
  });

  it('should get the jetpacks', () => {
    const jetpacks = repository.getAll();

    expect(jetpacks).toEqual([
      { id: '1', name: 'Name 1', image: 'Image 1' },
      { id: '2', name: 'Name 2', image: 'Image 2' },
      { id: '3', name: 'Name 3', image: 'Image 3' }
    ]);
  });

  it('should create a jetpack', () => {
    uuid.mockReturnValue('my-id');

    const jetpack = repository.createOne({ name: 'Name', image: 'Image' });

    expect(jetpack).toEqual({
      id: 'my-id',
      name: 'Name',
      image: 'Image',
      bookings: []
    });
  });
});
