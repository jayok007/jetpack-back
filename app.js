const express = require('express');
const bodyParser = require('body-parser');
let app = express();
const jetpackRouter = require('./routers/jetpack');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/jetpack', jetpackRouter);

// app
//   .route('/jetpacks/:id?')
//   .get(require('./controller/Jetpack/GetJetpackController'))
//   .post(require('./controller/Jetpack/CreateJetpackController'));

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
