const request = require('supertest');
const jetpacksRouter = require('../../src/jetpack/jetpackRouter');
const express = require('express');
const { errors } = require('celebrate');

const mockApp = express();
const mockRepository = {
  getAll: () => ['test'],
  createOne: ({ name, image }) => {
    return {
      id: '1',
      name,
      image
    };
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
        image: 'Image'
      });
  });

  it('can not create an empty jetpack', async () => {
    await request(mockApp)
      .post('/jetpacks')
      .expect(400);
  });
});
