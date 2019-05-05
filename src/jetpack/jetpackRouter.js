const express = require('express');
const { celebrate, Joi } = require('celebrate');

const validateJetpack = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required()
  })
});

const validateUpdateJetpack = celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    bookings: Joi.array()
  }),
  params: Joi.object().keys({
    id: Joi.string().required()
  })
});

const validateBooking = celebrate({
  body: Joi.object().keys({
    idJetpack: Joi.string().required(),
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required()
  })
});

const validateAvailibility = celebrate({
  query: Joi.object().keys({
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required()
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

  jetpacks.put('/jetpacks/:id', validateUpdateJetpack, (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
      jetpackRepository.updateOne(req.params.id, key, value);
    }

    res.status(200).send(jetpackRepository.get(req.params.id));
  });

  jetpacks.get('/availibility/jetpacks', validateAvailibility, (req, res) => {
    const jetpacks = jetpackRepository.getAll();
    const availableJetpacks = [];
    for (const jetpack of jetpacks) {
      if (
        jetpackRepository.isAvailable(
          jetpack,
          req.query.dateStart,
          req.query.dateEnd
        )
      ) {
        availableJetpacks.push(jetpack);
      }
    }
    res.status(200).send(jetpacks);
  });

  jetpacks.post('/jetpacks/booking', validateBooking, (req, res) => {
    const jetpack = jetpackRepository.get(req.body.idJetpack);
    if (jetpack == undefined) {
      res.status(404).send({ error: 'Jetpack not found.' });
    }
    if (!jetpackRepository.checkDate(req.body.dateStart, req.body.dateEnd)) {
      res.status(400).send({ error: 'dateStart must before dateEnd.' });
    }
    if (
      jetpackRepository.isAvailable(
        jetpack,
        req.body.dateStart,
        req.body.dateEnd
      )
    ) {
      const newJetpack = jetpackRepository.bookOne(
        jetpack,
        req.body.dateStart,
        req.body.dateEnd
      );
      res.status(201).send(newJetpack);
    } else {
      res.status(400).send({ error: 'Jetpack already booked.' });
    }
  });

  return jetpacks;
};
