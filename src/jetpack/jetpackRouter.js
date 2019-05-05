const express = require('express');
const { celebrate, Joi } = require('celebrate');

const validateJetpack = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required()
  })
});

const validateBooking = celebrate({
  body: Joi.object().keys({
    id_jetpack: Joi.string().required(),
    date_start: Joi.date().required(),
    date_end: Joi.date().required()
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

  jetpacks.post('/jetpacks/booking', validateBooking, (req, res) => {
    const jetpack = jetpackRepository.get(req.body.id_jetpack);
    if (jetpack == undefined) {
      res.status(404).send({ error: 'Jetpack not found.' });
    }
    if (!jetpackRepository.checkDate(req.body.date_start, req.body.date_end)) {
      res.status(400).send({ error: 'date_start must before date_end.' });
    }
    if (
      jetpackRepository.isAvailable(
        jetpack,
        req.body.date_start,
        req.body.date_end
      )
    ) {
      const newJetpack = jetpackRepository.bookOne(
        jetpack,
        req.body.date_start,
        req.body.date_end
      );
      res.status(201).send(newJetpack);
    } else {
      res.status(400).send({ error: 'Jetpack already booked.' });
    }
  });

  return jetpacks;
};
