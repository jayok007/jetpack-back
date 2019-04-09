const jetpacks = require('express').Router();
const db = require('../src/Db');
const jetpackRepository = require('../src/Repository/JetpackRepository');

jetpacks.get('/jetpacks', (req, res) => {
  const repository = new jetpackRepository(db);
  const jetpacks = repository.getAll();
  res.status(200).send(jetpacks);
});

module.exports = jetpacks;
