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
          { id: '1', name: 'Name 1', image: 'Image 1', bookings: [] },
          {
            id: '2',
            name: 'Name 2',
            image: 'Image 2',
            bookings: [{ dateStart: '2012-02-05', dateEnd: '2012-02-11' }]
          },
          {
            id: '3',
            name: 'Name 3',
            image: 'Image 3',
            bookings: [{ dateStart: '2012-02-01', dateEnd: '2012-02-03' }]
          }
        ]
      })
      .write();
    repository = new JetpackRepository(inMemoryDb);
  });

  it('should retrieve available jetpacks', () => {
    const availableJetpacks = repository.getAvailableJetpacks(
      '2012-02-04',
      '2012-02-06'
    );

    expect(availableJetpacks).toEqual([
      { id: '1', name: 'Name 1', image: 'Image 1', bookings: [] },
      {
        id: '3',
        name: 'Name 3',
        image: 'Image 3',
        bookings: [{ dateStart: '2012-02-01', dateEnd: '2012-02-03' }]
      }
    ]);
  });

  it('should get the jetpacks', () => {
    const jetpacks = repository.getAll();

    expect(jetpacks).toEqual([
      { id: '1', name: 'Name 1', image: 'Image 1', bookings: [] },
      {
        id: '2',
        name: 'Name 2',
        image: 'Image 2',
        bookings: [{ dateStart: '2012-02-05', dateEnd: '2012-02-11' }]
      },
      {
        id: '3',
        name: 'Name 3',
        image: 'Image 3',
        bookings: [{ dateStart: '2012-02-01', dateEnd: '2012-02-03' }]
      }
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

  it('should update a jetpack', () => {
    repository.updateOne({
      id: '1',
      name: 'Updated',
      image: 'Updated'
    });

    expect(repository.getAll()[0]).toEqual({
      id: '1',
      name: 'Updated',
      image: 'Updated',
      bookings: []
    });
  });
});
