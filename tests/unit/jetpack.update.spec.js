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
      find: jest.fn(() => dbMock),
      assign: jest.fn(() => dbMock),
      write: jest.fn(),
      value: () => jetpacks
    };
    repository = new JetpackRepository(dbMock);
    uuid.mockReturnValue('my-id');
  });

  it('should return "not an id" with non integer value input', () => {});

  it('should return "jetpack not found with this id" with <0 integer input', () => {});

  it('should return "jetpack not found with this id" with out of range integer input', () => {});

  it('should return "name value wrong format" with wrong formated input as name', () => {});

  it('should return "image value wrong format" with wrong formated input as image', () => {});

  it('should return "unchanged" with same name and/or image input as previous values', () => {});

  it('should return "jetpack changed" with different name and/or image input from previous values', () => {
    repository.updateOne({
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
    expect(dbMock.write).toHaveBeenCalled();
  });
});
