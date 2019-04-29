const request = require('supertest');
const jetpacksRouter = require('../../routers/jetpacks');
const jetpackRepository = require('../../src/Repository/JetpackRepository');
const app = require('express')();

jest.mock('../../src/Repository/JetpackRepository');

app.use('/api', jetpacksRouter);

describe('jetpack.router', () => {
  let jetpacks = ['test'];

  beforeEach(() => {
    jetpackRepository.prototype.getAll = () => jetpacks;
  });

  it('should retrieve the jetpacks list', async () => {
    const res = await request(app).get('/api/jetpacks');

    expect(res.body).toEqual(jetpacks);
  });
});
