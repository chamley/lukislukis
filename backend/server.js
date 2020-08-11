const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8080;

const DB_URL = process.env.MONGODB_URI
console.log(DB_URL);


mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info('Successfully connected to the Mongo database!');
    mongoose.connection.on('error', console.error);
    app.listen(PORT, () => console.info(`Server is running at port: ${PORT}`));
  })
  .catch(console.error);
