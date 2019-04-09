const jetpacks = require('express').Router();
const jetpackRepository = require('../src/Repository/JetpackRepository');

jetpacks.get('/jetpacks', (req, res) => {
  const jetpacks = jetpackRepository.findAll();
  res.status(200).send(jetpacks);
});

module.exports = jetpacks;
