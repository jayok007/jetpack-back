const express = require('express');
const { celebrate, Joi } = require('celebrate');

const validateJetpack = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required()
  })
});

const validatePartJetpack = celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    bookings: Joi.array()
  })
});

module.exports = jetpackRepository => {
  const jetpacks = express.Router();

  jetpacks.get('/jetpacks', (req, res) => {
    const jetpacks = jetpackRepository.getAll();
    res.status(200).send(jetpacks);
  });

  jetpacks.post('/jetpacks', validateJetpack, (req, res) => {
    const jetpack = jetpackRepository.createOne(req.body);
    res.status(201).send(jetpack);
  });

  jetpacks.put('/jetpacks/:id', validatePartJetpack, (req, res) => {
    for (const key of req.body) {
      var updatedJetpack = jetpackRepository.updateOne(
        req.params.id,
        key,
        req.body[key]
      );
    }

    res.status(200).send(updatedJetpack);
  });

  return jetpacks;
};
