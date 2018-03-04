const express = require('express');
const app = express();
const googleauth = require('simple-google-openid');
const users = [{"email": "robstow94@gmail.com", "roles": ["user", "admin"]}];

/* Backend */
app.use('/api', require('./api'));

app.use(express.static('static', { extensions: ['html'] }));

const port = process.env.PORT || 8080;

app.listen(port, (err) => {
  if (err) console.log('error', err);
  else console.log(`app listening on port ${port}`);
});
