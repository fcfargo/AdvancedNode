const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const logger = require('morgan');

const { overwriteExecFunc } = require('./services/cache');

require('./models/User');
require('./models/Blog');
require('./services/passport');
// mongoose 라이브러리 exec() 함수 덮어쓰기
overwriteExecFunc();

mongoose
  .set('strictQuery', true)
  .connect(keys.mongoURI)
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  }),
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);
require('./routes/uploadRoutes')(app);

if (['production'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
