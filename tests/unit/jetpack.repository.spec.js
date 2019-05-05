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
          startDate: '2013-03-10T00:00:00.000Z',
          endDate: '2013-03-11T00:00:00.000Z'
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
    const startDate = '2013-03-12T00:00:00.000Z';
    const endDate = '2013-03-13T00:00:00.000Z';

    repository.bookOne(jetpacks[0], startDate, endDate);

    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.find).toHaveBeenCalledWith({ id: jetpacks[0].id });
    expect(dbMock.assign).toHaveBeenCalledWith({
      bookings: [
        {
          startDate: startDate,
          endDate: endDate
        }
      ]
    });
    expect(dbMock.write).toHaveBeenCalled();
  });

  it('should return a jetpack', () => {
    const jetpacks = repository.get('my-id');
    expect(jetpacks).toBe(jetpacks);
    expect(dbMock.get).toHaveBeenCalledWith('jetpacks');
    expect(dbMock.find).toHaveBeenCalledWith({ id: 'my-id' });
  });

  it('should check date order and return true', () => {
    const startDate = '2013-03-12';
    const endDate = '2013-03-13';
    const res = repository.checkDate(startDate, endDate);
    expect(res).toEqual(true);
  });

  it('should check date order and return false', () => {
    const startDate = '2013-03-12';
    const endDate = '2013-03-09';
    const res = repository.checkDate(startDate, endDate);
    expect(res).toEqual(false);
  });

  it('should check date order and return false', () => {
    const startDate = '2013-03-12';
    const endDate = '2013-03-12';
    const res = repository.checkDate(startDate, endDate);
    expect(res).toEqual(false);
  });

  it('should check availability and return false', () => {
    const startDate = '2013-03-11';
    const endDate = '2013-03-11';
    const res = repository.isAvailable(jetpacks[1], startDate, endDate);
    expect(res).toEqual(false);
  });

  it('should check availability and return true', () => {
    const startDate = '2013-03-01';
    const endDate = '2013-03-02';
    const res = repository.isAvailable(jetpacks[1], startDate, endDate);
    expect(res).toEqual(true);
  });
});
