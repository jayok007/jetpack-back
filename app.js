const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jetpackRouter = require('./routers/jetpacks');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', jetpackRouter);

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
