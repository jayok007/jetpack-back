const request = require('supertest');
const jetpacksRouter = require('../../src/jetpack/jetpackRouter');
const express = require('express');
const { errors } = require('celebrate');
const moment = require('moment');

const mockApp = express();
const mockRepository = {
  getAll: () => ['test'],
  createOne: ({ name, image }) => {
    return {
      id: '1',
      name,
      image,
      bookings: []
    };
  },
  updateOne: jetpack => jetpack,
  bookOne: (jetpack, startDate, endDate) => {
    return {
      id: jetpack.id,
      name: jetpack.name,
      image: jetpack.image,
      bookings: jetpack.bookings.push({
        startDate: startDate,
        endDate: endDate
      })
    };
  },
  get: id => {
    if (id == 1)
      return {
        id: id,
        name: 'Jetpack Luxe',
        image: '',
        bookings: []
      };
    else return undefined;
  },
  checkDate: (startDate, endDate) => {
    return moment(startDate).isBefore(moment(endDate));
  },
  // eslint-disable-next-line no-unused-vars
  isAvailable: (jetpack, startDate, endDate) => {
    return true;
  }
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

  it('should not create an empty jetpack', async () => {
    await request(mockApp)
      .post('/jetpacks')
      .expect(400);
  });

  it('should update an existing jetpack', async () => {
    await request(mockApp)
      .put('/jetpacks/my-id')
      .send({ name: 'updatedName', image: 'updatedImage' })
      .expect(200, { id: 'my-id', name: 'updatedName', image: 'updatedImage' });
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
    await request(mockApp)
      .post('/jetpacks/booking')
      .send({
        idJetpack: '1',
        dateStart: '2013-01-13',
        dateEnd: '2013-01-14'
      })
      .expect(201);
  });

  it('should not add a booking to a jetpack (start after end)', async () => {
    await request(mockApp)
      .post('/jetpacks/booking')
      .send({
        idJetpack: '1',
        dateStart: '2013-03-15',
        dateEnd: '2013-03-14'
      })
      .expect(400);
  });
  it('should not add a booking to a jetpack', async () => {
    await request(mockApp)
      .post('/jetpacks/booking')
      .send({
        idJetpack: '1',
        dateStart: '2013-03-15',
        dateEnd: '2013-03-14'
      })
      .expect(400);
  });

  it('should not add a booking to a jetpack (jetpack not found)', async () => {
    await request(mockApp)
      .post('/jetpacks/booking')
      .send({
        idJetpack: '8',
        dateStart: '2013-03-15',
        dateEnd: '2013-03-14'
      })
      .expect(404);
  });

  it('should return all available jetpack for a specific timerange', async () => {
    await request(mockApp)
      .get('/availibility/jetpacks?dateStart="2012-01-02"&dateEnd="2012-01-03')
      .expect(200);
  });
});
