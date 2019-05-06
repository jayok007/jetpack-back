const JetpackRepository = require('../../src/jetpack/JetpackRepository');
const uuid = require('uuid');

jest.mock('uuid');

describe('Jetpack repository', () => {
  const jetpacks = [
    { id: 1, name: 'Toto', bookings: [] },
    {
      id: 2,
      name: 'Tata',
      bookings: [
        {
          dateStart: '2013-03-10',
          dateEnd: '2013-03-11'
        }
      ]
    }
  ];
  let repository;
  let dbMock;

  beforeEach(() => {
    dbMock = {
      get: jest.fn(() => dbMock),
      push: jest.fn(() => dbMock),
      find: jest.fn(() => dbMock),
      assign: jest.fn(() => dbMock),
      write: jest.fn(),
      value: () => jetpacks
    };
    repository = new JetpackRepository(dbMock);
    uuid.mockReturnValue('my-id');
  });

  it('should create a jetpack', () => {
    const jetpack = repository.createOne({
      name: 'Test',
      image: 'Image'
    });

    expect(jetpack).toEqual({
      id: 'my-id',
      name: 'Test',
      image: 'Image',
      bookings: []
    });
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.push).toHaveBeenCalledWith({
      id: 'my-id',
      name: 'Test',
      image: 'Image',
      bookings: []
    });
    expect(dbMock.write).toHaveBeenCalled();
  });

  it('should book a jetpack', () => {
    const dateStart = '2013-03-12';
    const dateEnd = '2013-03-13';

    repository.bookOne(jetpacks[0], dateStart, dateEnd);

    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.find).toHaveBeenCalledWith({ id: jetpacks[0].id });
    expect(dbMock.assign).toHaveBeenCalledWith({
      bookings: [
        {
          dateStart,
          dateEnd
        }
      ]
    });
    expect(dbMock.write).toHaveBeenCalled();
  });

  it('should retrieve a jetpack', () => {
    const jetpack = repository.getOne('my-id');

    expect(jetpack).toBe(jetpack);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.find).toHaveBeenCalledWith({ id: 'my-id' });
  });

  it('should update an existing jetpack', () => {
    const jetpack = {
      id: '1',
      name: 'Name',
      image: 'Image'
    };
    const dbMock = {
      get: jest.fn(() => dbMock),
      find: jest.fn(() => dbMock),
      assign: jest.fn(() => dbMock),
      write: jest.fn()
    };
    const repository = new JetpackRepository(dbMock);

    expect(repository.updateOne(jetpack)).toEqual(jetpack);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.find).toHaveBeenCalledWith({ id: '1' });
    expect(dbMock.assign).toHaveBeenCalledWith({
      name: 'Name',
      image: 'Image'
    });
  });
});
