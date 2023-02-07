require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.set('strictQuery', true).connect(keys.mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});
