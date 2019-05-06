const request = require('supertest');
const jetpacksRouter = require('../../src/jetpack/jetpackRouter');
const express = require('express');
const { errors } = require('celebrate');

const mockApp = express();
const mockRepository = {
  getAll: () => ['test'],
  createOne: ({ name, image }) => ({
    id: '1',
    name,
    image,
    bookings: []
  }),
  updateOne: ({ id, name, image }) => ({ id, name, image, bookings: [] }),
  getOne: id => ({
    id,
    name: 'Jetpack Luxe',
    image: '',
    bookings: []
  }),
  isAvailable: () => true
};

mockApp.use(express.json());
mockApp.use('/', jetpacksRouter(mockRepository));
mockApp.use(errors());

describe('Jetpack router', () => {
  it('should retrieve the all jetpacks', async () => {
    await request(mockApp)
      .get('/jetpacks')
      .expect(200, ['test']);
  });

  it('should create a jetpack', async () => {
    await request(mockApp)
      .post('/jetpacks')
      .send({ name: 'Test', image: 'Image' })
      .expect(201, {
        id: '1',
        name: 'Test',
        image: 'Image',
        bookings: []
      });
  });

  it('should update an existing jetpack', async () => {
    await request(mockApp)
      .put('/jetpacks/my-id')
      .send({ name: 'updatedName', image: 'updatedImage' })
      .expect(200, {
        id: 'my-id',
        name: 'updatedName',
        image: 'updatedImage',
        bookings: []
      });
  });

  it('should not create an empty jetpack', async () => {
    await request(mockApp)
      .post('/jetpacks')
      .expect(400);
  });

  it('should not update a jetpack with no name', async () => {
    await request(mockApp)
      .put('/jetpacks/my-id')
      .send({ image: 'updatedImage' })
      .expect(400);
  });

  it('should not update a jetpack with no image', async () => {
    await request(mockApp)
      .put('/jetpacks/my-id')
      .send({ name: 'updatedName' })
      .expect(400);
  });

  it('should add a booking to a jetpack', async () => {
    mockRepository.bookOne = () => ({
      dateStart: '2013-01-13',
      dateEnd: '2013-01-14'
    });

    await request(mockApp)
      .post('/jetpacks/1/bookings')
      .send({
        dateStart: '2013-01-13',
        dateEnd: '2013-01-14'
      })
      .expect(201, {
        dateStart: '2013-01-13',
        dateEnd: '2013-01-14'
      });
  });

  it('should not add a booking when dates are invalid', async () => {
    await request(mockApp)
      .post('/jetpacks/1/bookings')
      .send({
        dateStart: '2013-03-15',
        dateEnd: '2013-03-14'
      })
      .expect(400);
  });

  it('should not add a booking when jetpack does not exist', async () => {
    mockRepository.getOne = () => null;

    await request(mockApp)
      .post('/jetpacks/booking')
      .send({
        idJetpack: '8',
        dateStart: '2013-03-12',
        dateEnd: '2013-03-14'
      })
      .expect(404);
  });

  it('should retrieve all available jetpacks', async () => {
    mockRepository.getAvailableJetpacks = jest.fn(() => ['available']);

    await request(mockApp)
      .get('/availability/jetpacks?dateStart=2012-01-02&dateEnd=2012-01-03')
      .expect(200, ['available']);

    expect(mockRepository.getAvailableJetpacks).toHaveBeenCalledWith(
      '2012-01-02',
      '2012-01-03'
    );
  });
});
