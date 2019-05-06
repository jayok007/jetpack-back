const express = require('express');
const { celebrate, Joi } = require('celebrate');
const Boom = require('@hapi/boom');
const moment = require('moment');

const validateJetpack = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required()
  }),
  params: Joi.object().keys({
    id: Joi.string()
  })
});

const validateBooking = celebrate({
  body: Joi.object().keys({
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required()
  }),
  params: Joi.object().keys({
    id: Joi.string().required()
  })
});

const validateAvailibility = celebrate({
  query: Joi.object().keys({
    dateStart: Joi.date().required(),
    dateEnd: Joi.date().required()
  })
});

const isAvailable = (jetpack, dateStart, dateEnd) => {
  return jetpack.bookings.every(
    b =>
      moment(dateEnd).isBefore(moment(b.dateStart), 'day') ||
      moment(dateStart).isAfter(moment(b.dateEnd), 'day')
  );
};

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

  jetpacks.put('/jetpacks/:id', validateJetpack, (req, res) => {
    const updatedJetpack = jetpackRepository.updateOne({
      id: req.params.id,
      ...req.body
    });
    res.status(200).send(updatedJetpack);
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

  jetpacks.post('/jetpacks/:id/bookings', validateBooking, (req, res) => {
    const { dateStart, dateEnd } = req.body;
    const { id } = req.params;

    if (moment(dateStart).isAfter(moment(dateEnd), 'day')) {
      return res.status(400).send(Boom.badRequest('Invalid dates'));
    }

    const jetpack = jetpackRepository.getOne(id);

    if (!jetpack) {
      return res
        .status(404)
        .send(Boom.notFound(`Jetpack id "${id}" does not exist`));
    }

    if (!isAvailable(jetpack, dateStart, dateEnd)) {
      return res.status(400).send(Boom.badRequest('Jetpack already booked'));
    }

    res
      .status(201)
      .send(jetpackRepository.bookOne(jetpack, dateStart, dateEnd));
  });

  return jetpacks;
};
