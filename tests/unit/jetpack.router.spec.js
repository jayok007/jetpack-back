const request = require('supertest');
const jetpacksRouter = require('../../src/jetpack/jetpackRouter');
const app = require('express')();

const mockRepository = { getAll: () => ['test'] };
app.use('/', jetpacksRouter(mockRepository));

describe('Jetpack router', () => {
  it('should retrieve the jetpacks list', async () => {
    const res = await request(app).get('/jetpacks');

    expect(res.body).toEqual(['test']);
  });
});
