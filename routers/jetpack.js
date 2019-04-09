const jetpack = require('express').Router();
const JetpackEntity = require('../src/Entity/Jetpack');
const uuidv4 = require('uuid/v4');
const db = require('../src/Db');
const JetpackRepository = require('../src/Repository/JetpackRepository');

jetpack.get('/:id', function(req, res) {
  //
  res.status(201).send('hello');
});

jetpack.post('/:id', function(req, res) {
  console.log(req.body);
  let jetpack = new JetpackEntity();
  jetpack.id = uuidv4();
  jetpack.name = req.body.name;
  jetpack.image = req.body.image;

  const repository = new JetpackRepository(db);
  repository.create(jetpack);
  res.header('Access-Control-Allow-Origin', '*');
  res.status(201).send(jetpack.toJson());
});

module.exports = jetpack;

// module.exports = (req, res) => {
//   console.log(req.body);
//   let jetpack = new Jetpack();
//   jetpack.id = uuidv4();
//   jetpack.name = req.body.name;
//   jetpack.image = req.body.image;

//   const repository = new JetpackRepository(db);
//   repository.create(jetpack);
//   res.header('Access-Control-Allow-Origin', '*');
//   res.status(201).send(jetpack.toJson());
// };
