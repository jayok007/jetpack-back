const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const { errors } = require('celebrate');
const jetpackRouter = require('./jetpack/jetpackRouter');
const JetpackRepository = require('./jetpack/JetpackRepository');
const db = require('./db');

const PORT = process.env.PORT || 3000;
const jetpackRepository = new JetpackRepository(db);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/api', jetpackRouter(jetpackRepository));
app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
